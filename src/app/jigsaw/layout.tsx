import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Splash Jigsaw",
  description:
    "Reveal puzzle pieces of a champion's splash art and guess who it is. A new image puzzle every day!",
  openGraph: {
    title: "Splash Jigsaw | PoroGuess – Daily LoL Challenge",
    description:
      "Can you recognize the champion from their blurred splash art? Reveal tiles and guess before it's too late!",
    type: "website",
  },
};

export default function JigsawLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
