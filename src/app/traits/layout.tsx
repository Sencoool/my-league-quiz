import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Traits Mode",
  description:
    "Identify the mystery League of Legends champion from their unique traits and abilities. Daily challenge!",
  openGraph: {
    title: "Traits Mode | PoroGuess – Daily LoL Challenge",
    description:
      "Can you name the champion from their traits? A fresh traits challenge every single day.",
    type: "website",
  },
};

export default function TraitsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
