import Header from "../components/header";
import Footer from "../components/footer";

// Shown by Next.js App Router while the Server Component fetches leaderboard data
export default function LeaderboardLoading() {
  return (
    <div className="flex flex-col flex-1 selection:bg-blue-500/30">
      <Header />

      <main className="flex-1 flex flex-col items-center max-w-4xl mx-auto w-full px-4 py-12">
        {/* Header Block Skeleton */}
        <div className="text-center mb-12">
          <div className="inline-block px-6 sm:px-14 py-6 sm:py-8 rounded-3xl bg-gradient-to-b from-[#1e293b] to-[#0f172a] border border-blue-500/20 shadow-[0_0_50px_rgba(59,130,246,0.15)] relative overflow-hidden">
            <div className="relative z-10 flex flex-col items-center gap-4">
              <div className="h-12 sm:h-16 md:h-20 w-64 sm:w-80 md:w-96 bg-zinc-800/80 rounded-2xl animate-pulse" />
              <div className="h-7 w-48 bg-zinc-800/60 rounded-full animate-pulse" />
            </div>
          </div>
        </div>

        {/* Table Skeleton */}
        <div className="w-full bg-[#1e293b]/95 border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
          {/* Header Row */}
          <div className="flex items-center px-4 sm:px-6 py-3 sm:py-4 border-b border-white/10 bg-white/5 text-[10px] sm:text-xs font-bold text-zinc-400 uppercase tracking-wider">
            <div className="w-10 sm:w-16 text-center">Rank</div>
            <div className="flex-1 ml-2 sm:ml-0">Player</div>
            <div className="w-24 text-center hidden sm:block">Streak</div>
            <div className="w-16 sm:w-24 text-right">Score</div>
          </div>

          {/* Skeleton Rows */}
          <div className="w-full h-[600px] overflow-hidden">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center px-4 sm:px-6 py-3 sm:py-4 border-b border-white/5"
                style={{ opacity: 1 - i * 0.06 }}
              >
                {/* Position */}
                <div className="w-10 sm:w-16 flex justify-center">
                  <div className="h-5 w-8 bg-zinc-800/80 rounded animate-pulse" />
                </div>

                {/* Player Info */}
                <div className="flex-1 flex items-center gap-3 sm:gap-4 ml-2 sm:ml-0">
                  <div className="relative shrink-0">
                    <div className="w-12 h-12 rounded-full bg-zinc-800/80 animate-pulse" />
                    <div className="absolute -bottom-2 -right-2 w-5 h-5 rounded-full bg-zinc-700/80 animate-pulse" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <div className="h-4 w-24 sm:w-36 bg-zinc-800/80 rounded animate-pulse" />
                    <div className="h-3 w-16 bg-zinc-700/60 rounded animate-pulse" />
                  </div>
                </div>

                {/* Streak */}
                <div className="w-24 flex justify-center hidden sm:flex">
                  <div className="h-6 w-14 bg-zinc-800/60 rounded-full animate-pulse" />
                </div>

                {/* Score */}
                <div className="w-16 sm:w-24 flex justify-end">
                  <div className="h-5 w-12 bg-zinc-800/80 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
