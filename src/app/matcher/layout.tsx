import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Icon Matcher",
  description:
    "Match all 16 pairs of League of Legends champion icons as fast as you can. A daily speed memory challenge!",
  openGraph: {
    title: "Icon Matcher | PoroGuess – Daily LoL Challenge",
    description:
      "How fast can you match all the champion icons? Beat the clock in this daily memory game!",
    type: "website",
  },
};

export default function MatcherLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
