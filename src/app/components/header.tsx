"use client";

import { useState, useEffect } from "react";
import { useGameStore } from "../store/useGameStore";
import Link from "next/link";
import ProfileModal from "./ProfileModal";
import { getImageUrl } from "../utils/image";

const RANK_THRESHOLDS = [
  { rank: "CHALLENGER",  minScore: 2800, color: "#00e5ff" },
  { rank: "GRANDMASTER", minScore: 1800, color: "#ff4444" },
  { rank: "MASTER",      minScore: 1200, color: "#a855f7" },
  { rank: "DIAMOND",     minScore: 750,  color: "#60a5fa" },
  { rank: "EMERALD",     minScore: 450,  color: "#10b981" },
  { rank: "PLATINUM",    minScore: 250,  color: "#2dd4bf" },
  { rank: "GOLD",        minScore: 120,  color: "#f59e0b" },
  { rank: "SILVER",      minScore: 50,   color: "#94a3b8" },
  { rank: "BRONZE",      minScore: 10,   color: "#c2773f" },
  { rank: "IRON",        minScore: 0,    color: "#71717a" },
];

function getRankInfo(rankName: string) {
  return RANK_THRESHOLDS.find(t => t.rank === rankName) ?? RANK_THRESHOLDS[RANK_THRESHOLDS.length - 1];
}

function RankIcon({ rank, size = 20 }: { rank: string; size?: number }) {
  const info = getRankInfo(rank);
  return (
    <div
      className="flex items-center justify-center rounded-full font-black border-2 shrink-0 bg-[#0f172a]"
      style={{
        width: size,
        height: size,
        color: info.color,
        borderColor: info.color,
        fontSize: size * 0.4,
      }}
    >
      {rank[0] || 'I'}
    </div>
  );
}

export default function Header() {
  const { user, initializeSession } = useGameStore();
  const [showProfile, setShowProfile] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Always sync user from server on mount so Score is never stale
  useEffect(() => {
    setMounted(true);
    initializeSession();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <header className="w-full flex items-center justify-between px-4 sm:px-6 py-3 bg-[#1E293B] text-white shadow-md z-50 min-h-[68px] sm:min-h-[86px]">
      {/* Left: Logo */}
      <div className="flex-1 flex justify-start">
        <Link href="/" className="group flex items-center gap-2 sm:gap-3 transition-transform duration-200 hover:scale-[1.02] shrink-0">
          <div className="relative shrink-0 w-10 h-10 sm:w-11 sm:h-11">
            <img 
              src="/img/logo.png" 
              alt="Poro Guess Logo" 
              className="w-full h-full object-contain rounded-full border border-white/20 transition-transform duration-200 group-hover:rotate-6 shrink-0" 
            />
          </div>
          <div className="flex flex-col justify-center -space-y-1 shrink-0">
            <span className="text-[1.1rem] sm:text-2xl tracking-wider flex items-center">
              <span className="font-black text-blue-400">PORO</span>
              <span className="font-light text-zinc-200">GUESS</span>
            </span>
            <span className="text-[7px] sm:text-[9px] uppercase tracking-widest text-blue-300 font-medium">Daily LoL Challenge</span>
          </div>
        </Link>
      </div>

      {/* Center: Navigation Links (Desktop) */}
      <div className="flex shrink-0 justify-center gap-4 xl:gap-8 hidden lg:flex">
        <Link href="/classic" className="text-sm font-medium text-zinc-300 hover:text-white transition-colors uppercase tracking-wider">
          Classic
        </Link>
        <Link href="/traits" className="text-sm font-medium text-zinc-300 hover:text-white transition-colors uppercase tracking-wider">
          Traits
        </Link>
        <Link href="/jigsaw" className="text-sm font-medium text-zinc-300 hover:text-white transition-colors uppercase tracking-wider">
          Splash Jigsaw
        </Link>
        <Link href="/matcher" className="text-sm font-medium text-zinc-300 hover:text-white transition-colors uppercase tracking-wider">
          Icon Matcher
        </Link>
        <Link href="/leaderboard" className="text-sm font-medium text-yellow-500 hover:text-yellow-400 transition-colors uppercase tracking-wider flex items-center gap-1.5">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path><path d="M4 22h16"></path><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path></svg>
          Leaderboard
        </Link>
      </div>

      {/* Right: Controls */}
      <div className="flex-1 flex justify-end items-center gap-2 sm:gap-4 shrink-0 min-h-[42px] sm:min-h-[54px]">
        {/* Guest Sign In Button */}
        {mounted && user?.isGuest && (
          <button
            onClick={() => {
              import("../utils/api").then(({ AuthService }) => AuthService.loginWithGoogle(user.id));
            }}
            className="relative hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold transition-colors shadow-sm cursor-pointer"
          >
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border border-black/50 shadow-sm"></span>
            </span>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Sign In
          </button>
        )}

        {/* User Profile Frame */}
        {!mounted || !user ? (
          <div className="flex items-center gap-2 sm:gap-3 bg-[#1e232d]/50 p-1 pr-3 sm:p-1.5 sm:pr-4 rounded-3xl border border-zinc-700/30 animate-pulse">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-zinc-700/50" />
            <div className="flex flex-col justify-center gap-1.5 overflow-hidden">
              <div className="w-16 sm:w-24 h-3 sm:h-3.5 bg-zinc-700/50 rounded" />
              <div className="w-12 sm:w-16 h-2 sm:h-2.5 bg-zinc-700/50 rounded hidden sm:block" />
            </div>
          </div>
        ) : (() => {
          const rankInfo = getRankInfo(user.rank || 'IRON');
          return (
            <div
              className="flex items-center gap-2 sm:gap-3 bg-[#1e232d] hover:bg-[#252b36] transition-colors p-1 pr-3 sm:p-1.5 sm:pr-4 rounded-3xl border border-zinc-700/50 cursor-pointer group"
              onClick={() => setShowProfile(prev => !prev)}
            >
              {/* Avatar */}
              <div className="relative shrink-0">
                <div 
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden border-2 flex items-center justify-center transition-transform duration-200 group-hover:scale-105"
                  style={{ borderColor: rankInfo.color }}
                >
                  <img 
                    src={getImageUrl(user.iconPath) || "/img/default-avatar.png"} 
                    alt={user.username} 
                    className="w-full h-full object-cover scale-[1.15]"
                    onError={(e) => (e.currentTarget.src = "/img/default-avatar.png")}
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 bg-[#1e232d] rounded-full scale-75 sm:scale-100">
                  <RankIcon rank={user.rank || 'IRON'} size={18} />
                </div>
              </div>

              {/* User Info */}
              <div className="flex flex-col justify-center shrink-1 overflow-hidden">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="text-xs sm:text-sm font-bold tracking-wide truncate max-w-[60px] sm:max-w-[100px] lg:max-w-[150px]" style={{ color: rankInfo.color }}>
                    {user.username}
                  </span>
                  {user.streak > 0 && (
                    <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-orange-500/20 border border-orange-500/30 shrink-0">
                      <span className="text-[10px]">🔥</span>
                      <span className="text-[10px] text-orange-400 font-bold leading-none">{user.streak}</span>
                    </div>
                  )}
                </div>
                <div className="mt-0.5 hidden sm:block">
                  <span className="text-[10px] sm:text-[11px] text-yellow-500 font-bold tracking-wider leading-none">SCORE: {user.score ?? 0}</span>
                </div>
              </div>
            </div>
          );
        })()}

        {/* Hamburger Menu Button */}
        <button 
          className="relative lg:hidden p-2 text-zinc-300 hover:text-white bg-zinc-800/50 hover:bg-zinc-700/50 rounded-xl border border-white/10 transition-colors cursor-pointer"
          onClick={() => setShowMobileMenu(true)}
        >
          {mounted && user?.isGuest && (
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border border-black/50 shadow-sm"></span>
            </span>
          )}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
      </div>
    </header>

      {/* Mobile Slide-out Drawer */}
      <div 
        className={`fixed inset-0 z-[60] bg-black/80 transition-opacity duration-300 lg:hidden ${showMobileMenu ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} 
        onClick={() => setShowMobileMenu(false)}
      >
        <div 
          className={`absolute top-0 right-0 h-full w-64 bg-[#111827] border-l border-zinc-800 shadow-2xl p-6 transition-transform duration-300 ease-out transform ${showMobileMenu ? 'translate-x-0' : 'translate-x-full'}`}
          onClick={e => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-8">
            <span className="font-black text-xl tracking-wider text-white">MENU</span>
            <button className="text-zinc-400 hover:text-white p-2 bg-zinc-800/50 rounded-full" onClick={() => setShowMobileMenu(false)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>
          <div className="flex flex-col gap-6">
            <Link href="/classic" onClick={() => setShowMobileMenu(false)} className="text-lg font-bold text-zinc-300 hover:text-white transition-colors">Classic</Link>
            <Link href="/traits" onClick={() => setShowMobileMenu(false)} className="text-lg font-bold text-zinc-300 hover:text-white transition-colors">Traits</Link>
            <Link href="/jigsaw" onClick={() => setShowMobileMenu(false)} className="text-lg font-bold text-zinc-300 hover:text-white transition-colors">Splash Jigsaw</Link>
            <Link href="/matcher" onClick={() => setShowMobileMenu(false)} className="text-lg font-bold text-zinc-300 hover:text-white transition-colors">Icon Matcher</Link>
            <div className="h-px w-full bg-zinc-800/50 my-2"></div>
            <Link href="/leaderboard" onClick={() => setShowMobileMenu(false)} className="text-lg font-bold text-yellow-500 hover:text-yellow-400 flex items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path><path d="M4 22h16"></path><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path></svg>
              Leaderboard
            </Link>
            {mounted && user?.isGuest && (
              <>
                <div className="h-px w-full bg-zinc-800/50 my-2"></div>
                <button
                  onClick={() => {
                    setShowMobileMenu(false);
                    import("../utils/api").then(({ AuthService }) => AuthService.loginWithGoogle(user.id));
                  }}
                  className="relative flex items-center justify-center gap-2 w-full px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold transition-colors shadow-lg shadow-blue-500/20 group overflow-hidden text-sm whitespace-nowrap"
                >
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#fff"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#fff"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#fff"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#fff"/>
                  </svg>
                  Sign in with Google
                </button>
                <p className="text-center text-[10px] text-zinc-500 -mt-2">Don't lose your progress!</p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Profile Modal */}
      {mounted && user && (
        <ProfileModal
          show={showProfile}
          user={user}
          onClose={() => setShowProfile(false)}
        />
      )}
    </>
  );
}
