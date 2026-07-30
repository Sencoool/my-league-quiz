import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  UserProfileResponse,
  DailyChallengeResponse,
  UserProgressResponse,
  ChampionEntity,
  UserService,
  AuthService,
  DailyChallengeService,
  ChampionService,
  UserProgressService
} from '../utils/api';

const SESSION_REFRESH_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

interface GameState {
  // Auth / User state
  user: UserProfileResponse | null;
  isLoadingUser: boolean;
  lastSessionRefresh: number; // Unix timestamp ms
  
  // Game data state
  classicChallenge: DailyChallengeResponse | null;
  jigsawChallenge: DailyChallengeResponse | null;
  traitsChallenge: DailyChallengeResponse | null;
  matcherChallenge: DailyChallengeResponse | null;
  activeChallenge: DailyChallengeResponse | null;
  championsList: ChampionEntity[];
  isLoadingData: boolean;
  
  // Progress state
  classicProgress: UserProgressResponse | null;
  jigsawProgress: UserProgressResponse | null;
  traitsProgress: UserProgressResponse | null;
  matcherProgress: UserProgressResponse | null;
  isSubmittingGuess: boolean;
  
  // Modal trigger state
  showVictoryModalMode: 'CLASSIC' | 'JIGSAW' | 'TRAITS' | 'MATCHER' | null;
  triggerVictoryModal: (mode: 'CLASSIC' | 'JIGSAW' | 'TRAITS' | 'MATCHER') => void;
  clearVictoryModal: () => void;
  
  // Actions
  initializeSession: () => Promise<void>;
  fetchInitialData: () => Promise<void>;
  setActiveMode: (mode: 'CLASSIC' | 'JIGSAW' | 'TRAITS' | 'MATCHER') => Promise<void>;
  loadProgress: () => Promise<void>;
  makeGuess: (championId?: number, options?: { moves?: number; timeElapsed?: number; isWon?: boolean; score?: number }) => Promise<void>;
  refreshUser: () => Promise<void>;
  resetProgress: () => void;
  logout: () => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isLoadingUser: false,
      lastSessionRefresh: 0,
      
      classicChallenge: null,
      jigsawChallenge: null,
      traitsChallenge: null,
      matcherChallenge: null,
      activeChallenge: null,
      championsList: [],
      isLoadingData: false,
      
      classicProgress: null,
      jigsawProgress: null,
      traitsProgress: null,
      matcherProgress: null,
      isSubmittingGuess: false,
      
      showVictoryModalMode: null,
      triggerVictoryModal: (mode) => set({ showVictoryModalMode: mode }),
      clearVictoryModal: () => set({ showVictoryModalMode: null }),
      
      // Initialize User Session (debounced — skips if refreshed within 5 minutes)
      initializeSession: async () => {
        const { user, lastSessionRefresh } = get();
        const now = Date.now();
        if (user && now - lastSessionRefresh < SESSION_REFRESH_INTERVAL_MS) {
          return; // Already fresh, skip network call
        }
        
        // 1. If JWT token exists, try to use it first
        if (AuthService.hasToken()) {
          try {
            set({ isLoadingUser: true });
            const me = await UserService.getMe();
            set({ user: me, isLoadingUser: false, lastSessionRefresh: Date.now() });
            return;
          } catch (e) {
            // Token expired or invalid — clear it and fall through to guest
            console.warn('JWT token invalid, clearing...', e);
            AuthService.clearToken();
          }
        }

        // 2. If we have a user in state, refresh from server
        if (user) {
          try {
            set({ isLoadingUser: true });
            const freshUser = await UserService.getUser(user.id);
            set({ user: freshUser, isLoadingUser: false, lastSessionRefresh: Date.now() });
            return;
          } catch (e) {
            console.error('Failed to load existing user, creating new guest...', e);
          }
        }
        
        // 3. Create new guest
        try {
          set({ isLoadingUser: true });
          const newGuest = await UserService.createGuest();
          set({ user: newGuest, isLoadingUser: false, lastSessionRefresh: Date.now() });
        } catch (e) {
          console.error('Error creating guest user:', e);
          set({ isLoadingUser: false });
        }
      },
      
      // Fetch initial game data (Challenges and Champions)
      fetchInitialData: async () => {
        // If data is already hydrated by Server Components (StoreInitializer), skip network request
        if (get().championsList.length > 0 && get().classicChallenge) {
          const { user, activeChallenge } = get();
          if (user && activeChallenge) {
            get().loadProgress();
          }
          return;
        }

        try {
          set({ isLoadingData: true });
          const [challenges, champions] = await Promise.all([
            DailyChallengeService.getAll(),
            ChampionService.getAll()
          ]);
          
          const classicChallenge = challenges.find(c => c.mode === 'CLASSIC') || null;
          const jigsawChallenge = challenges.find(c => c.mode === 'JIGSAW') || null;
          const traitsChallenge = challenges.find(c => c.mode === 'TRAITS') || null;
          const matcherChallenge = challenges.find(c => c.mode === 'MATCHER') || null;
          
          set({ 
            classicChallenge,
            jigsawChallenge,
            traitsChallenge,
            matcherChallenge,
            // default to classic, or can be set by the page
            activeChallenge: get().activeChallenge || classicChallenge,
            championsList: champions,
            isLoadingData: false 
          });
          
          // Automatically load progress if we have user and challenge
          const { user, activeChallenge } = get();
          if (user && activeChallenge) {
            get().loadProgress();
          }
        } catch (e) {
          console.error('Failed to fetch initial game data:', e);
          set({ isLoadingData: false });
        }
      },
      
      // Set active mode
      setActiveMode: async (mode: 'CLASSIC' | 'JIGSAW' | 'TRAITS' | 'MATCHER') => {
        const { classicChallenge, jigsawChallenge, traitsChallenge, matcherChallenge, activeChallenge } = get();
        const nextChallenge = mode === 'CLASSIC' ? classicChallenge : mode === 'JIGSAW' ? jigsawChallenge : mode === 'TRAITS' ? traitsChallenge : matcherChallenge;
        
        if (nextChallenge && nextChallenge.id !== activeChallenge?.id) {
          set({ activeChallenge: nextChallenge });
          // Load progress for new active challenge
          await get().loadProgress();
        }
      },
      
      // Load progress for active challenge
      loadProgress: async () => {
        const { user, activeChallenge } = get();
        if (!user || !activeChallenge) return;
        
        const isClassic = activeChallenge.mode === 'CLASSIC';
        const isJigsaw = activeChallenge.mode === 'JIGSAW';
        const isTraits = activeChallenge.mode === 'TRAITS';
        const isMatcher = activeChallenge.mode === 'MATCHER';
        
        try {
          const progress = await UserProgressService.getProgress(user.id, activeChallenge.id);
          // Prevent race condition: only update if activeChallenge hasn't changed during fetch
          if (get().activeChallenge?.id === activeChallenge.id) {
            if (isClassic) set({ classicProgress: progress });
            else if (isJigsaw) set({ jigsawProgress: progress });
            else if (isTraits) set({ traitsProgress: progress });
            else if (isMatcher) set({ matcherProgress: progress });
          }
        } catch (e: any) {
          // Prevent race condition
          if (get().activeChallenge?.id !== activeChallenge.id) return;
          
          if (e.response?.status === 404) {
            // No progress yet, this is fine
            if (isClassic) set({ classicProgress: null });
            else if (isJigsaw) set({ jigsawProgress: null });
            else set({ traitsProgress: null });
          } else {
            console.error('Failed to load progress:', e);
          }
        }
      },
      
      // Make a guess
      makeGuess: async (championId?: number, options?: { moves?: number; timeElapsed?: number; isWon?: boolean; score?: number }) => {
        const { user, activeChallenge, classicProgress, jigsawProgress, traitsProgress } = get();
        if (!user || !activeChallenge) return;
        
        const isClassic = activeChallenge.mode === 'CLASSIC';
        const isJigsaw = activeChallenge.mode === 'JIGSAW';
        const currentProgress = isClassic ? classicProgress : isJigsaw ? jigsawProgress : traitsProgress;
        
        if (currentProgress?.isWon) return; // Already won
        
        try {
          set({ isSubmittingGuess: true });
          const newProgress = await UserProgressService.makeGuess(user.id, activeChallenge.id, championId, options);
          if (isClassic) set({ classicProgress: newProgress, isSubmittingGuess: false });
          else if (isJigsaw) set({ jigsawProgress: newProgress, isSubmittingGuess: false });
          else set({ traitsProgress: newProgress, isSubmittingGuess: false });
          
          if (newProgress.isWon && !currentProgress?.isWon) {
             set({ showVictoryModalMode: activeChallenge.mode });
          }
        } catch (e) {
          console.error('Failed to submit guess:', e);
          set({ isSubmittingGuess: false });
        }
      },
      
      refreshUser: async () => {
        const { user } = get();
        if (!user) return;
        try {
          const freshUser = await UserService.getUser(user.id);
          set({ user: freshUser });
        } catch (e) {
          console.error('Failed to refresh user:', e);
        }
      },

      resetProgress: () => set({ classicProgress: null, jigsawProgress: null, traitsProgress: null, matcherProgress: null }),

      logout: async () => {
        AuthService.clearToken();
        // Clear local traits state to prevent state bleed between accounts
        import('./useTraitsStore').then(({ useTraitsStore }) => {
          useTraitsStore.getState().clearAll();
        });

        try {
          // Immediately create a new guest account to replace the logged out user
          const newGuest = await UserService.createGuest();
          set({ 
            user: newGuest, 
            classicProgress: null, 
            jigsawProgress: null, 
            traitsProgress: null, 
            matcherProgress: null 
          });
        } catch (e) {
          console.error("Failed to create guest session after logout:", e);
          set({ user: null });
        }
      },
    }),
    {
      name: 'poro-guess-storage',
      // Persist user + refresh timestamp — everything else is fetched server-side
      partialize: (state) => ({
        user: state.user,
        lastSessionRefresh: state.lastSessionRefresh,
      }),
    }
  )
);
