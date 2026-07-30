import Header from "../components/header";
import Footer from "../components/footer";
import LeaderboardList from "./LeaderboardList";
import { getServerLeaderboard } from "../utils/serverApi";
import type { Metadata } from "next";

export const revalidate = 300; // 5 minutes — matches getServerLeaderboard

export const metadata: Metadata = {
  title: "Leaderboard",
  description: "See the top 500 PoroGuess players worldwide. Compete daily across Classic, Jigsaw, Traits, and Icon Matcher modes to climb the ranks!",
  openGraph: {
    title: "Top 500 Players | PoroGuess Leaderboard",
    description: "Can you make it to the top? Play daily LoL challenges and climb the global PoroGuess leaderboard!",
    type: "website",
  },
};

export default async function Leaderboard() {
  const leaderboard = await getServerLeaderboard();

  return (
    <div className="flex flex-col flex-1 selection:bg-blue-500/30">
      <Header />

      <main className="flex-1 flex flex-col items-center max-w-4xl mx-auto w-full px-4 py-12">
        <div className="w-full bg-[#1e293b]/95 border border-white/10 p-6 sm:p-8 rounded-3xl shadow-2xl mb-8 flex flex-col items-center justify-center relative">
          <h1 className="text-3xl md:text-4xl font-bold text-center tracking-wide text-white drop-shadow-md px-12 mb-4">
            Poro Guess <span className="text-blue-400 font-light">Leaderboard</span>
          </h1>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-950/30 border border-blue-500/20 shadow-inner">
            <span className="text-blue-300/80 font-semibold tracking-[0.15em] text-[10px] sm:text-xs uppercase">🏆 TOP 500 PLAYERS 🏆</span>
          </div>
        </div>

        <div className="w-full bg-[#1e293b]/95 border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
          {/* Header Row */}
          <div className="flex items-center px-4 sm:px-6 py-3 sm:py-4 border-b border-white/10 bg-white/5 text-[10px] sm:text-xs font-bold text-zinc-400 uppercase tracking-wider">
            <div className="w-10 sm:w-16 text-center">Rank</div>
            <div className="flex-1 ml-2 sm:ml-0">Player</div>
            <div className="w-24 text-center hidden sm:block">Streak</div>
            <div className="w-16 sm:w-24 text-right">Score</div>
          </div>

          {/* List — Client Component for user highlighting */}
          <div className="w-full h-[600px] flex flex-col overflow-hidden">
            <LeaderboardList leaderboard={leaderboard} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
