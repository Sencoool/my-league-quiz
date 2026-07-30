import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Classic Mode",
  description:
    "Guess today's mystery League of Legends champion by their stats and attributes. A new challenge every day!",
  openGraph: {
    title: "Classic Mode | PoroGuess – Daily LoL Challenge",
    description:
      "Can you guess the mystery champion from their stats? A new LoL champion guessing challenge every day.",
    type: "website",
  },
};

export default function ClassicLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
