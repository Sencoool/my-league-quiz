"use client";

import { useEffect, useState, useRef } from "react";
import { useVirtualizer } from '@tanstack/react-virtual';
import SafeImage from "../components/SafeImage";
import { useGameStore } from "../store/useGameStore";
import { LeaderboardUserResponse } from "../utils/api";
import { getImageUrl } from "../utils/image";

const RANK_THRESHOLDS = [
  { rank: "CHALLENGER",  minScore: 2800, color: "#00e5ff", glow: "rgba(0,229,255,0.4)" },
  { rank: "GRANDMASTER", minScore: 1800, color: "#ff4444", glow: "rgba(255,68,68,0.4)" },
  { rank: "MASTER",      minScore: 1200, color: "#a855f7", glow: "rgba(168,85,247,0.4)" },
  { rank: "DIAMOND",     minScore: 750,  color: "#60a5fa", glow: "rgba(96,165,250,0.4)" },
  { rank: "EMERALD",     minScore: 450,  color: "#10b981", glow: "rgba(16,185,129,0.4)" },
  { rank: "PLATINUM",    minScore: 250,  color: "#2dd4bf", glow: "rgba(45,212,191,0.4)" },
  { rank: "GOLD",        minScore: 120,  color: "#f59e0b", glow: "rgba(245,158,11,0.4)" },
  { rank: "SILVER",      minScore: 50,   color: "#94a3b8", glow: "rgba(148,163,184,0.4)" },
  { rank: "BRONZE",      minScore: 10,   color: "#c2773f", glow: "rgba(194,119,63,0.4)" },
  { rank: "IRON",        minScore: 0,    color: "#71717a", glow: "rgba(113,113,122,0.4)" },
];

function RankIcon({ rank, size = 28 }: { rank: string; size?: number }) {
  const info = RANK_THRESHOLDS.find(t => t.rank === rank) ?? RANK_THRESHOLDS[RANK_THRESHOLDS.length - 1];
  return (
    <div
      className="flex items-center justify-center rounded-full font-black border-2 shrink-0"
      style={{
        width: size,
        height: size,
        color: info.color,
        borderColor: info.color,
        boxShadow: `0 0 8px ${info.glow}`,
        fontSize: size * 0.36,
      }}
    >
      {rank[0]}
    </div>
  );
}

/** A single leaderboard row */
function PlayerRow({
  player,
  position,
  isCurrentUser,
}: {
  player: LeaderboardUserResponse;
  position: number;
  isCurrentUser: boolean;
}) {
  let positionColor = "text-zinc-400";
  let nameColor = "text-white";
  let rowBg = isCurrentUser ? "bg-blue-900/20" : "hover:bg-white/[0.02]";
  let rowBorder = isCurrentUser ? "border-l-4 border-blue-500" : "border-l-4 border-transparent";

  if (position === 1) {
    positionColor = "text-yellow-400 font-black drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]";
    nameColor = "text-yellow-400 font-black drop-shadow-[0_0_8px_rgba(250,204,21,0.3)]";
    if (!isCurrentUser) rowBg = "bg-yellow-500/5 hover:bg-yellow-500/10";
  } else if (position === 2) {
    positionColor = "text-zinc-300 font-bold drop-shadow-[0_0_8px_rgba(212,212,216,0.5)]";
    nameColor = "text-zinc-300 font-bold drop-shadow-[0_0_8px_rgba(212,212,216,0.3)]";
    if (!isCurrentUser) rowBg = "bg-zinc-300/5 hover:bg-zinc-300/10";
  } else if (position === 3) {
    positionColor = "text-amber-600 font-bold drop-shadow-[0_0_8px_rgba(217,119,6,0.5)]";
    nameColor = "text-amber-600 font-bold drop-shadow-[0_0_8px_rgba(217,119,6,0.3)]";
    if (!isCurrentUser) rowBg = "bg-amber-600/5 hover:bg-amber-600/10";
  }

  return (
    <div
      className={`flex items-center px-4 sm:px-6 py-3 sm:py-4 border-b border-white/5 transition-colors ${rowBg} ${rowBorder}`}
    >
      <div className={`w-10 sm:w-16 text-center text-base sm:text-lg ${positionColor}`}>
        #{position}
      </div>

      <div className="flex-1 flex items-center gap-3 sm:gap-4 ml-2 sm:ml-0 min-w-0">
        <div className="relative shrink-0 group">
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/10 flex items-center justify-center bg-[#0f172a]">
            <SafeImage
              src={getImageUrl(player.iconPath)}
              alt={player.username}
              className="w-full h-full object-cover scale-[1.15]"
              width={300} height={300} fallbackSrc="/img/Red.png" />
          </div>
          <div className="absolute -bottom-2 -right-2 bg-[#0f172a] rounded-full p-0.5">
            <RankIcon rank={player.rank} size={20} />
          </div>
        </div>
        <div className="flex flex-col min-w-0">
          <span className={`text-base sm:text-lg tracking-wide truncate ${nameColor}`}>
            {player.username}
          </span>
          <span className="text-xs text-zinc-500 font-medium">
            {player.rank}
          </span>
        </div>
      </div>

      <div className="w-24 flex justify-center hidden sm:flex">
        {player.streak > 0 ? (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/15 border border-orange-500/25">
            <span className="animate-pulse">🔥</span>
            <span className="text-orange-400 font-bold text-sm">{player.streak}</span>
          </div>
        ) : (
          <span className="text-zinc-600">-</span>
        )}
      </div>

      <div className="w-16 sm:w-24 text-right shrink-0">
        <span className="text-lg sm:text-xl font-bold text-white tracking-widest">{player.score}</span>
        <span className="text-[10px] sm:text-xs text-zinc-500 ml-1">pts</span>
      </div>
    </div>
  );
}



/** Full overlay shown to guests covering the leaderboard */
function GuestOverlay() {
  return (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 bg-[#0f172a]/80">
      <div className="bg-gradient-to-br from-[#1e293b] to-[#0f172a] border border-blue-500/30 rounded-3xl p-8 sm:p-10 flex flex-col items-center gap-6 shadow-2xl w-full max-w-md text-center transform hover:scale-[1.02] transition-transform duration-300">
        <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20 mb-2 shadow-inner">
          <span className="text-4xl">🏆</span>
        </div>
        <div>
          <h3 className="text-white font-black text-2xl tracking-wide mb-3 drop-shadow-sm">Join the Global Ranks</h3>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
            Sign in to track your progress, save your daily streak, and compete with players worldwide on the top 500 leaderboard.
          </p>
        </div>
        <a
          href="/auth/google"
          className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white text-zinc-900 rounded-xl font-bold text-base hover:bg-zinc-100 transition-all shadow-lg hover:shadow-xl active:scale-95 mt-2"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Sign in with Google
        </a>
      </div>
    </div>
  );
}

export default function LeaderboardList({ leaderboard }: { leaderboard: LeaderboardUserResponse[] }) {
  const { user } = useGameStore();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  const currentUserId = mounted ? user?.id : null;
  const isGuest = mounted ? (user?.isGuest ?? true) : true;
  
  const parentRef = useRef<HTMLDivElement>(null);

  if (leaderboard.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-zinc-500">
        No players found.
      </div>
    );
  }

  // Only show players that have actually played (score > 0), plus always show current user
  const visibleLeaderboard = leaderboard
    .map((player, index) => ({ player, originalIndex: index }))
    .filter(({ player }) => player.score > 0 || player.id === currentUserId);

  const virtualizer = useVirtualizer({
    count: visibleLeaderboard.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 74,
    overscan: 10,
  });

  return (
    <div className="relative flex flex-col h-full">
      {/* Scrollable list area */}
      <div 
        ref={parentRef}
        className={`flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar ${isGuest ? 'opacity-30 select-none pointer-events-none' : ''}`}
      >
        <div
          style={{
            height: `${virtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          {virtualizer.getVirtualItems().map((virtualItem: any) => {
            const { player, originalIndex } = visibleLeaderboard[virtualItem.index];
            const isCurrentUser = currentUserId === player.id;
            const position = originalIndex + 1;

            return (
              <div
                key={virtualItem.key}
                data-index={virtualItem.index}
                ref={virtualizer.measureElement}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  transform: `translateY(${virtualItem.start}px)`,
                }}
              >
                <PlayerRow
                  player={player}
                  position={position}
                  isCurrentUser={isCurrentUser}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Overlay for guests */}
      {isGuest && <GuestOverlay />}
    </div>
  );
}
