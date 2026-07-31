"use client";

import { useState, useEffect, useRef, useDeferredValue } from "react";
import SafeImage from "./SafeImage";
import { useRouter } from "next/navigation";
import {
  DailyChallengeService,
  UserProgressService,
  AuthService,
  type UserProfileResponse,
  type DailyChallengeResponse,
  type UserProgressResponse,
  UserService,
} from "../utils/api";
import { useGameStore } from "../store/useGameStore";

// ── Rank helpers ──────────────────────────────────────────────────────────────
const RANK_THRESHOLDS = [
  { rank: "CHALLENGER",  minScore: 2800, nextScore: Infinity, color: "#5eb6c9" },
  { rank: "GRANDMASTER", minScore: 1800, nextScore: 2800,     color: "#d97373" },
  { rank: "MASTER",      minScore: 1200, nextScore: 1800,     color: "#a98bcf" },
  { rank: "DIAMOND",     minScore: 750,  nextScore: 1200,     color: "#7ba8d6" },
  { rank: "EMERALD",     minScore: 450,  nextScore: 750,      color: "#6db59b" },
  { rank: "PLATINUM",    minScore: 250,  nextScore: 450,      color: "#77c9c0" },
  { rank: "GOLD",        minScore: 120,  nextScore: 250,      color: "#d4b261" },
  { rank: "SILVER",      minScore: 50,   nextScore: 120,      color: "#a3b0b5" },
  { rank: "BRONZE",      minScore: 10,   nextScore: 50,       color: "#b88a65" },
  { rank: "IRON",        minScore: 0,    nextScore: 10,       color: "#8d9196" },
];

function getRankInfo(rankName: string) {
  return RANK_THRESHOLDS.find(t => t.rank === rankName) ?? RANK_THRESHOLDS[RANK_THRESHOLDS.length - 1];
}

function getRankProgress(score: number, rankName: string): number {
  const info = RANK_THRESHOLDS.find(t => t.rank === rankName) ?? RANK_THRESHOLDS[RANK_THRESHOLDS.length - 1];
  if (info.nextScore === Infinity) return 100;
  const range = info.nextScore - info.minScore;
  const gained = score - info.minScore;
  return Math.min(100, Math.max(0, (gained / range) * 100));
}

function getNextRank(rankName: string) {
  const idx = RANK_THRESHOLDS.findIndex(t => t.rank === rankName);
  return idx > 0 ? RANK_THRESHOLDS[idx - 1] : null;
}

function RankIcon({ rank, size = 32 }: { rank: string; size?: number }) {
  const info = getRankInfo(rank);
  return (
    <div
      className="flex items-center justify-center rounded-full font-black border-2 shrink-0 bg-[#0f172a]"
      style={{ width: size, height: size, color: info.color, borderColor: info.color, fontSize: size * 0.38 }}
    >
      {rank[0] || "I"}
    </div>
  );
}

// ── Mode definitions ──────────────────────────────────────────────────────────
const MODES = [
  { key: "CLASSIC", label: "Classic",       icon: "🧩", href: "/classic" },
  { key: "TRAITS",  label: "Traits",        icon: "🔮", href: "/traits" },
  { key: "JIGSAW",  label: "Splash Jigsaw", icon: "🖼️", href: "/jigsaw" },
  { key: "MATCHER", label: "Icon Matcher",  icon: "🃏", href: "/matcher" },
];

// ── ModeCard ──────────────────────────────────────────────────────────────────
function ModeCard({
  mode,
  challenge,
  progress,
  loading,
  onClick,
}: {
  mode: typeof MODES[0];
  challenge: DailyChallengeResponse | undefined;
  progress: UserProgressResponse | null | undefined;
  loading: boolean;
  onClick: () => void;
}) {
  const isWon = progress?.isWon ?? false;

  let statusLabel = "Not played";
  let statusColor = "text-zinc-500";

  if (loading) {
    statusLabel = "Loading…";
  } else if (!challenge) {
    statusLabel = "No challenge";
    statusColor = "text-zinc-600";
  } else if (isWon) {
    statusLabel = "Completed";
    statusColor = "text-emerald-400";
  } else if (progress) {
    const guesses = progress.guesses?.length ?? 0;
    statusLabel = `In progress (${guesses} guess${guesses !== 1 ? "es" : ""})`;
    statusColor = "text-yellow-400";
  }

  const isPlayable = challenge && !isWon && !loading;

  return (
    <div
      onClick={isPlayable ? onClick : undefined}
      className={`flex items-center justify-between px-3 py-2.5 rounded-xl border transition-all ${
        isWon
          ? "bg-[#0d252d] border-[#0e5649] shadow-[0_0_15px_rgba(16,185,129,0.15)]"
          : isPlayable
          ? "bg-[#171c26] border-[#2a3143] cursor-pointer hover:bg-[#1a202c] hover:border-[#384158] shadow-sm hover:shadow-md"
          : "bg-[#0f1522] border-[#1c2233] cursor-not-allowed text-zinc-600"
      }`}
    >
      <div className="flex items-center gap-3">
        <span className={`text-lg leading-none ${!isPlayable && !isWon ? 'opacity-50' : ''}`}>{mode.icon}</span>
        <div>
          <p className={`text-sm font-semibold leading-none ${!isPlayable && !isWon ? 'text-zinc-500' : 'text-white'}`}>{mode.label}</p>
          <p className={`text-xs mt-0.5 ${statusColor}`}>{statusLabel}</p>
        </div>
      </div>
      {isWon && progress?.scoreGained != null && (
        <span className="text-sm font-black text-yellow-400 shrink-0">
          +{progress.scoreGained} PTS
        </span>
      )}
      {!isWon && !loading && challenge && (
        <div className="w-2 h-2 rounded-full bg-zinc-600 shrink-0" />
      )}
      {isWon && progress?.scoreGained == null && (
        <span className="text-xs text-emerald-500 shrink-0 font-bold">✓</span>
      )}
    </div>
  );
}

// ── AvatarPickerModal ────────────────────────────────────────────────────────
import { getImageUrl } from "../utils/image";

function AvatarPickerModal({
  user,
  championsList,
  onClose,
  onSelect,
}: {
  user: UserProfileResponse;
  championsList: any[];
  onClose: () => void;
  onSelect: (iconPath: string) => void;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const deferredSearchTerm = useDeferredValue(searchTerm);
  const [selectedIcon, setSelectedIcon] = useState<string>(user.iconPath || "");
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Wait for the modal's entry animation (300ms) to finish before rendering the heavy grid
    const timer = setTimeout(() => setIsReady(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const allAvatars = [
    { id: "poro-default", name: "Poro", iconPath: "" },
    ...[...championsList].sort((a, b) => a.name.localeCompare(b.name)),
  ];

  const filtered = allAvatars.filter((c) =>
    c.name.toLowerCase().includes(deferredSearchTerm.toLowerCase())
  );

  return (
    <div
      className="flex flex-col w-full h-[600px] max-h-[80vh] bg-[#0d1524]"
      style={{ animation: "slideDown 0.2s ease forwards" }}
    >
      <div className="p-5 pb-4 border-b border-white/10 flex items-center justify-between shrink-0">
          <h2 className="text-xl font-bold text-white tracking-wide">Choose Avatar</h2>
          <button onClick={onClose} className="p-2 rounded-full bg-zinc-800/50 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors cursor-pointer">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </div>

        <div className="p-4 shrink-0 border-b border-white/10 bg-[#111827] flex justify-center">
          <div className="relative w-full max-w-sm">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-zinc-500">
                <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search avatar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-zinc-900 border border-zinc-700/50 rounded-full text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all shadow-inner"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#0a0f18]">
          <div className="p-4 grid grid-cols-4 sm:grid-cols-5 gap-3">
            {!isReady ? (
              <div className="col-span-full py-20 flex flex-col items-center justify-center gap-4">
                <div className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
                <span className="text-zinc-500 font-medium text-sm animate-pulse">Loading avatars...</span>
              </div>
            ) : (
              filtered.map((champ) => {
                const isSelected = selectedIcon === champ.iconPath;
              return (
                <div key={champ.id} className="relative group">
                  <div
                    onClick={() => setSelectedIcon(champ.iconPath)}
                    className={`relative aspect-square rounded-full overflow-hidden border-2 cursor-pointer transition-all duration-200 hover:scale-110 hover:shadow-xl ${
                      isSelected 
                        ? "border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.5)] scale-105" 
                        : "border-zinc-800 hover:border-zinc-400 opacity-80 hover:opacity-100"
                    }`}
                  >
                    <SafeImage
                      src={champ.iconPath ? getImageUrl(champ.iconPath) : "/img/default-avatar.png"}
                      alt={champ.name}
                      className="w-full h-full object-cover scale-[1.15] transition-transform duration-300 group-hover:scale-[1.25]"
                      loading="lazy"
                      
                     width={300} height={300} fallbackSrc="/img/Red.png" />
                  </div>
                  {isSelected && (
                    <div className="absolute -bottom-1 -right-1 bg-[#0a0f18] rounded-full p-[3px] shadow-lg pointer-events-none">
                      <div className="bg-emerald-500 text-white rounded-full p-1 shadow-[0_0_10px_rgba(16,185,129,0.5)]">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
            {isReady && filtered.length === 0 && (
              <div className="col-span-full py-16 flex flex-col items-center justify-center gap-3">
                <div className="text-4xl opacity-50 grayscale">🔍</div>
                <span className="text-zinc-500 font-medium tracking-wide">No avatars match your search</span>
              </div>
            )}
          </div>
        </div>

        <div className="p-4 border-t border-white/10 bg-[#111827] flex justify-end gap-3 shrink-0">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl text-zinc-300 font-medium hover:bg-zinc-800 hover:text-white transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={() => onSelect(selectedIcon)}
            disabled={selectedIcon === (user.iconPath || "")}
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20 cursor-pointer"
          >
            Save
          </button>
      </div>
    </div>
  );
}

function RankTierList({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="flex flex-col w-full h-full"
      style={{ animation: "slideDown 0.2s ease forwards" }}
    >
      <div className="p-5 pb-4 border-b border-zinc-700/60 flex items-center justify-between shrink-0">
        <h2 className="text-xl font-bold text-white tracking-wide">Rank Tiers</h2>
        <button
          onClick={onClose}
          className="p-2 rounded-full bg-zinc-800/50 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors cursor-pointer"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
        </button>
      </div>
      <div className="p-4 bg-[#0a0f18] flex flex-col gap-2 rounded-b-[2rem]">
        {RANK_THRESHOLDS.map((tier) => (
          <div
            key={tier.rank}
            className="group flex items-center justify-between p-3 rounded-xl border transition-all duration-200 cursor-default border-white/5 bg-white/[0.03] hover:bg-[var(--rank-bg)] hover:border-[var(--rank-border)]"
            style={{
              "--rank-color": tier.color,
              "--rank-bg": `${tier.color}20`,
              "--rank-border": `${tier.color}60`,
              "--rank-badge-bg-hover": `${tier.color}15`,
            } as React.CSSProperties}
          >
            <div className="flex items-center gap-3">
              <RankIcon rank={tier.rank} size={36} />
              <span 
                className="font-bold tracking-widest uppercase text-sm sm:text-base transition-colors duration-200"
                style={{ color: tier.color, textShadow: `0 0 8px ${tier.color}40` }}
              >
                {tier.rank}
              </span>
            </div>
            <span 
              className="text-sm font-bold px-3 py-1 rounded-lg transition-all duration-200 bg-black/30 group-hover:bg-[var(--rank-badge-bg-hover)]"
              style={{ color: tier.color }}
            >
              {tier.minScore === 0 ? "0" : tier.minScore.toLocaleString()} PTS
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main ProfileModal ─────────────────────────────────────────────────────────
interface ProfileModalProps {
  show: boolean;
  user: UserProfileResponse;
  onClose: () => void;
}

export default function ProfileModal({ show, user, onClose }: ProfileModalProps) {
  const router = useRouter();
  const { logout, setActiveMode, championsList } = useGameStore();
  const [challenges, setChallenges] = useState<DailyChallengeResponse[]>([]);
  const [progressMap, setProgressMap] = useState<Record<string, UserProgressResponse | null>>({});
  const [loading, setLoading] = useState(false);

  // Username Editing State
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState(user.username);
  const [isSavingName, setIsSavingName] = useState(false);
  const [nameError, setNameError] = useState("");
  
  // Avatar Editing State
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [isSavingAvatar, setIsSavingAvatar] = useState(false);

  // Rank Info State
  const [showRankInfo, setShowRankInfo] = useState(false);

  // Reset editing state when modal opens/closes
  useEffect(() => {
    if (show) {
      setNewName(user.username);
      setIsEditingName(false);
      setShowAvatarPicker(false);
      setShowRankInfo(false);
      setNameError("");
    }
  }, [show, user.username]);

  const handleSaveName = async () => {
    if (!newName.trim() || newName === user.username) {
      setIsEditingName(false);
      setNameError("");
      return;
    }
    try {
      setNameError("");
      setIsSavingName(true);
      await UserService.updateUser(user.id, { username: newName.trim() });
      await useGameStore.getState().refreshUser();
      setIsEditingName(false);
    } catch (e: any) {
      console.error("Failed to update username", e);
      if (e.response?.status === 409) {
        setNameError("This username is already taken");
      } else {
        setNameError("Failed to update username");
      }
    } finally {
      setIsSavingName(false);
    }
  };

  const handleSelectAvatar = async (iconPath: string) => {
    if (iconPath === user.iconPath || isSavingAvatar) return;
    try {
      setIsSavingAvatar(true);
      await UserService.updateUser(user.id, { iconPath });
      await useGameStore.getState().refreshUser();
      setShowAvatarPicker(false);
    } catch (e) {
      console.error("Failed to update avatar", e);
    } finally {
      setIsSavingAvatar(false);
    }
  };

  useEffect(() => {
    if (!show) return;

    const fetchAll = async () => {
      // Only show loading indicator if we don't have cached data yet
      if (challenges.length === 0) {
        setLoading(true);
      }
      
      try {
        if (championsList.length === 0) {
          await useGameStore.getState().fetchInitialData();
        }
        const chs = await DailyChallengeService.getAll();
        setChallenges(chs);

        const entries = await Promise.all(
          chs.map(async (c) => {
            try {
              const prog = await UserProgressService.getProgress(user.id, c.id);
              return [c.mode, prog] as [string, UserProgressResponse];
            } catch {
              return [c.mode, null] as [string, null];
            }
          })
        );
        setProgressMap(Object.fromEntries(entries));
      } catch {
        /* silently fail */
      } finally {
        setLoading(false);
      }
    };
    
    fetchAll();
  }, [show, user.id]);

  if (!show) return null;

  const rankInfo  = getRankInfo(user.rank || "IRON");
  const nextRank  = getNextRank(user.rank || "IRON");
  const currentScore = user.score ?? 0;
  const barWidth  = getRankProgress(currentScore, user.rank || "IRON");
  const ptsToNext = nextRank ? nextRank.minScore - currentScore : 0;

  const totalTodayPts = Object.values(progressMap).reduce(
    (sum, p) => sum + (p?.scoreGained ?? 0),
    0
  );

  return (
    <>



      
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 z-[100] will-change-opacity" 
        onClick={onClose}
        style={{ animation: "slideDown 0.2s ease forwards" }}
      />
      
      {/* Centered Modal Container */}
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 pointer-events-none">
        {/* Modal Panel Animation Wrapper */}
        <div
          className="pointer-events-auto w-full max-w-[520px] max-h-[90vh] shadow-2xl relative flex flex-col rounded-[2rem]"
          style={{ 
            animation: "answerDown 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards"
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Scrollable Content Container */}
          <div 
            className="w-full h-full overflow-y-auto custom-scrollbar bg-[#0d1524] border border-zinc-800 rounded-[2rem] flex flex-col overflow-hidden"
          >
          {showAvatarPicker ? (
            <AvatarPickerModal
              user={user}
              championsList={championsList}
              onClose={() => setShowAvatarPicker(false)}
              onSelect={(iconPath) => {
                handleSelectAvatar(iconPath);
                setShowAvatarPicker(false);
              }}
            />
          ) : showRankInfo ? (
            <RankTierList onClose={() => setShowRankInfo(false)} />
          ) : (
            <>
              {/* ── User Header ── */}
              <div className="p-4 sm:p-6 pb-2 flex items-start gap-4 relative z-10">
            <div className="relative shrink-0 group cursor-pointer" onClick={() => setShowAvatarPicker(true)}>
              <div 
                className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-4 shadow-lg bg-[#0d1524] transition-all group-hover:opacity-80 ${isSavingAvatar ? 'animate-pulse' : ''}`}
                style={{ borderColor: rankInfo.color }}
              >
                <SafeImage
                  src={getImageUrl(user.iconPath) || "/img/default-avatar.png"}
                  alt={user.username}
                  className="w-full h-full object-cover scale-[1.15]"
                  
                 width={300} height={300} fallbackSrc="/img/Red.png" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full bg-black/40 pointer-events-none">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
              </div>
              <div className="absolute -bottom-2 -right-2 bg-[#0d1524] rounded-full p-1 shadow-md scale-75 sm:scale-100 pointer-events-none">
                <RankIcon rank={user.rank || "IRON"} size={26} />
              </div>
            </div>

            <div className="flex-1 min-w-0 pt-1">
              {isEditingName ? (
                <div className="flex flex-col gap-1 mb-1">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newName}
                      onChange={(e) => {
                        setNewName(e.target.value);
                        setNameError("");
                      }}
                      disabled={isSavingName}
                      maxLength={15}
                      className={`w-full max-w-[200px] px-2 py-1 bg-zinc-900 border ${nameError ? 'border-red-500' : 'border-zinc-700'} rounded-md text-white text-lg font-bold focus:outline-none focus:border-emerald-500 disabled:opacity-50`}
                      autoFocus
                      onKeyDown={(e) => e.key === "Enter" && handleSaveName()}
                    />
                    <button
                      onClick={handleSaveName}
                      disabled={isSavingName || !newName.trim()}
                      className="p-1.5 rounded-md bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-colors disabled:opacity-50 cursor-pointer"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </button>
                    <button
                      onClick={() => {
                        setNewName(user.username);
                        setIsEditingName(false);
                        setNameError("");
                      }}
                      disabled={isSavingName}
                      className="p-1.5 rounded-md bg-zinc-800/80 text-zinc-400 hover:text-white transition-colors disabled:opacity-50 cursor-pointer"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </div>
                  {nameError && (
                    <span className="text-xs text-red-500 font-medium px-1 drop-shadow-sm">{nameError}</span>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <p className="text-xl sm:text-2xl font-black truncate tracking-wide text-white drop-shadow-md">
                    {user.username}
                  </p>
                  {!user.isGuest && (
                    <button
                      onClick={() => setIsEditingName(true)}
                      className="p-1.5 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-full transition-colors cursor-pointer"
                      title="Edit Username"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 20h9" />
                        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                      </svg>
                    </button>
                  )}
                </div>
              )}
              <div className="flex items-center gap-2 sm:gap-3 mt-1 sm:mt-1.5 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <span 
                    className="text-xs sm:text-sm font-bold tracking-widest uppercase"
                    style={{ color: rankInfo.color, textShadow: `0 0 8px ${rankInfo.color}40` }}
                  >
                    {user.rank || "IRON"}
                  </span>
                  <button
                    onClick={() => setShowRankInfo(true)}
                    className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] sm:text-xs font-bold text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors cursor-pointer border border-zinc-700"
                    title="Rank Information"
                  >
                    ?
                  </button>
                </div>
                <span className="text-xs sm:text-sm text-yellow-400 font-bold px-2 py-0.5 bg-yellow-400/10 rounded-md border border-yellow-400/20">
                  {currentScore} PTS
                </span>
                {user.streak > 0 && (
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 sm:px-2.5 sm:py-1 bg-orange-500/10 border border-orange-500/20 rounded-full">
                    <span className="text-xs">🔥</span>
                    <span className="text-[10px] sm:text-xs text-orange-400 font-bold uppercase tracking-wider">
                      {user.streak} Day Streak
                    </span>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={onClose}
              className="shrink-0 text-zinc-500 hover:text-white transition-colors bg-zinc-800/50 hover:bg-zinc-700/50 p-2 rounded-full cursor-pointer"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* ── Rank Progress Bar ── */}
          <div className="px-4 sm:px-6 pb-4 sm:pb-6 pt-2 relative z-10">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest" style={{ color: rankInfo.color }}>
                {user.rank || "IRON"}
              </span>
              {nextRank ? (
                <span className="text-[10px] sm:text-xs text-zinc-400 font-medium tracking-wide">
                  <span className="text-zinc-200 font-bold">{ptsToNext} PTS</span> to <span style={{ color: nextRank.color, fontWeight: 'bold' }}>{nextRank.rank}</span>
                </span>
              ) : (
                <span className="text-[10px] sm:text-xs text-yellow-400 font-bold tracking-widest">MAX RANK ✓</span>
              )}
            </div>
            <div className="w-full h-2 bg-zinc-800/80 rounded-full overflow-hidden shadow-inner border border-white/5">
              <div
                className="h-full rounded-full transition-all duration-1000 ease-out"
                style={{ 
                  width: `${barWidth}%`, 
                  backgroundColor: "#10b981",
                  boxShadow: `0 0 10px #10b98180`
                }}
              />
            </div>
          </div>

          {/* ── Divider ── */}
          <div className="border-t border-zinc-700/60 shadow-[0_-1px_2px_rgba(0,0,0,0.5)] z-10" />

          {/* ── Today's Games ── */}
          <div className="p-4 sm:p-6 flex-1">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-zinc-300 uppercase tracking-widest flex items-center gap-2">
                <span>🎮</span> Today&apos;s Games
              </h3>
              {totalTodayPts > 0 && (
                <span className="text-sm font-black text-yellow-400 bg-yellow-400/10 px-3 py-1 rounded-full border border-yellow-400/20 shadow-sm">
                  +{totalTodayPts} PTS
                </span>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              {MODES.map((mode) => {
                const challenge = challenges.find((c) => c.mode === mode.key);
                const prog = progressMap[mode.key];
                return (
                  <ModeCard
                    key={mode.key}
                    mode={mode}
                    challenge={challenge}
                    progress={prog}
                    loading={loading}
                    onClick={() => {
                      if (challenge) {
                        setActiveMode(mode.key as any);
                        router.push(mode.href);
                        onClose();
                      }
                    }}
                  />
                );
              })}
            </div>

            {/* ── Auth Actions ── */}
            <div className="mt-4 pt-4 border-t border-zinc-700/60">
              {user.isGuest ? (
                <button
                  onClick={() => AuthService.loginWithGoogle(user.id)}
                  className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg bg-white hover:bg-zinc-100 text-zinc-900 font-bold text-sm transition-all shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Sign in with Google to save progress
                </button>
              ) : (
                <button
                  onClick={() => { logout(); onClose(); }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-zinc-800/50 hover:bg-zinc-700/50 border border-zinc-700/50 hover:border-zinc-600 text-zinc-400 hover:text-zinc-300 font-medium text-sm transition-all cursor-pointer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                  </svg>
                  Sign Out
                </button>
              )}
            </div>
          </div>
          </>
        )}
          </div>
        </div>
      </div>

    </>
  );
}
