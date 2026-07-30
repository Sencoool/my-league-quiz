"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

interface PatchEntry {
  version: string;
  date: string;
  isLatest?: boolean;
  highlights?: string;
  changes: {
    type: "new" | "improved" | "fixed" | "removed";
    text: string;
  }[];
}

const PATCH_NOTES: PatchEntry[] = [
  {
    version: "1.0.0",
    date: "30 Jul 2026",
    isLatest: true,
    highlights: "Initial Launch 🎉",
    changes: [
      { type: "new", text: "Classic Mode — guess the daily champion from their stats and attributes" },
      { type: "new", text: "Splash Jigsaw Mode — reveal puzzle tiles of a champion's splash art" },
      { type: "new", text: "Traits Mode — identify the champion from their unique traits" },
      { type: "new", text: "Icon Matcher Mode — match all 16 pairs of champion icons as fast as possible" },
      { type: "new", text: "Global Leaderboard — compete with top 500 players worldwide" },
      { type: "new", text: "Rank system (Iron to Challenger) and Daily Streak tracking" },
      { type: "new", text: "Google OAuth login with guest account support" },
    ],
  }
];

const TYPE_CONFIG = {
  new: { label: "NEW", className: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30" },
  improved: { label: "IMPROVED", className: "bg-blue-500/15 text-blue-400 border border-blue-500/30" },
  fixed: { label: "FIXED", className: "bg-amber-500/15 text-amber-400 border border-amber-500/30" },
  removed: { label: "REMOVED", className: "bg-rose-500/15 text-rose-400 border border-rose-500/30" },
};

export default function PatchNotesModal() {
  const [open, setOpen] = useState(false);
  // Portal requires document — ensure we're on the client before rendering
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  // Close on Escape key
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      {/* Trigger Button */}
      <button
        id="patch-notes-btn"
        onClick={() => setOpen(true)}
        className="relative group w-full flex items-center justify-between p-5 rounded-3xl border border-zinc-800 hover:border-purple-500/30 transition duration-300 hover:-translate-y-1 bg-[#0d1524]/80 cursor-pointer text-left"
      >
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        <div className="flex items-center gap-4 relative z-10">
          <div className="w-12 h-12 rounded-full bg-black/40 border border-white/10 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300 group-hover:border-purple-500/30 shrink-0">
            📋
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold tracking-wide text-zinc-100 group-hover:text-purple-400 transition-colors">
                Patch Notes
              </h3>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 tracking-wider">
                v{PATCH_NOTES[0].version}
              </span>
            </div>
            <p className="text-zinc-500 text-xs font-medium tracking-wider uppercase">
              {PATCH_NOTES[0].highlights}
            </p>
          </div>
        </div>

        <div className="relative z-10 w-10 h-10 rounded-full bg-black/40 border border-white/10 flex items-center justify-center text-zinc-500 group-hover:text-white group-hover:bg-purple-600/20 group-hover:border-purple-500/30 transition-all duration-300 shrink-0">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </div>
      </button>

      {/* Modal — rendered via Portal directly at document.body to escape parent stacking contexts */}
      {mounted && open && createPortal(
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onClick={() => setOpen(false)}
        >
          {/* Background overlay (Removed backdrop-blur for performance) */}
          <div className="absolute inset-0 bg-black/80" />

          {/* Modal Panel */}
          <div
            className="relative z-10 w-full max-w-2xl max-h-[85vh] flex flex-col bg-[#0f172a] border border-white/10 rounded-3xl shadow-2xl overflow-hidden"
            onClick={e => e.stopPropagation()}
            style={{ 
              animation: "slideDown 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards"
            }}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 bg-gradient-to-r from-purple-900/20 to-transparent shrink-0">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📋</span>
                <div>
                  <h2 className="text-xl font-black tracking-wide text-white">PoroGuess Patch Notes</h2>
                  <p className="text-xs text-purple-400 font-medium tracking-widest uppercase">Update History</p>
                </div>
              </div>
              <button
                id="patch-notes-close-btn"
                onClick={() => setOpen(false)}
                className="w-9 h-9 rounded-full bg-zinc-800/60 hover:bg-zinc-700 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="overflow-y-auto custom-scrollbar flex-1 px-6 py-5 space-y-8">
              {PATCH_NOTES.map((patch) => (
                <div key={patch.version}>
                  {/* Version Header */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-black text-white font-mono">v{patch.version}</span>
                      {patch.isLatest && (
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 tracking-wider">
                          LATEST
                        </span>
                      )}
                    </div>
                    <div className="flex-1 h-px bg-white/10" />
                    <span className="text-xs text-zinc-500 font-medium shrink-0">{patch.date}</span>
                  </div>

                  {patch.highlights && (
                    <p className="text-sm font-semibold text-zinc-300 mb-3 pl-1">✨ {patch.highlights}</p>
                  )}

                  {/* Change List */}
                  <ul className="space-y-2">
                    {patch.changes.map((change, i) => {
                      const cfg = TYPE_CONFIG[change.type];
                      return (
                        <li key={i} className="flex items-start gap-3">
                          <span className={`shrink-0 mt-0.5 px-1.5 py-0.5 text-[9px] font-black rounded tracking-widest ${cfg.className}`}>
                            {cfg.label}
                          </span>
                          <span className="text-sm text-zinc-400 leading-relaxed">{change.text}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}

              {/* Footer note */}
              <p className="text-center text-xs text-zinc-600 pb-2">
                🐾 More updates coming soon — stay tuned, Summoner!
              </p>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
