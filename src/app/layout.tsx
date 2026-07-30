import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "PoroGuess – Daily LoL Champion Challenge",
    template: "%s | PoroGuess",
  },
  description:
    "PoroGuess is a daily League of Legends guessing game. Play Classic, Jigsaw, Traits, and Icon Matcher modes to test your LoL champion knowledge!",
  icons: {
    icon: "/img/logo.png",
  },
  openGraph: {
    title: "PoroGuess – Daily LoL Champion Challenge",
    description:
      "Play daily League of Legends champion guessing games. Classic, Jigsaw, Traits, and Icon Matcher modes await!",
    type: "website",
    siteName: "PoroGuess",
  },
  twitter: {
    card: "summary",
    title: "PoroGuess – Daily LoL Champion Challenge",
    description: "Can you guess today's mystery LoL champion? Play daily challenges across 4 game modes!",
  },
};

import { getServerChampions, getServerChallenges } from "./utils/serverApi";
import StoreInitializer from "./components/StoreInitializer";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch data on the server with Next.js caching
  const champions = await getServerChampions();
  const challenges = await getServerChallenges();

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <StoreInitializer champions={champions} challenges={challenges} />
        
        <div className="relative min-h-screen bg-[#060b14] text-white selection:bg-blue-900">
          {/* Global Background Image */}
          <div 
            className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
            style={{ 
              backgroundImage: "url('/PoroGuessBG.jpg')",
              opacity: 0.8,
            }}
          />
          
          {/* Main Content Area */}
          <div className="relative z-10 flex flex-col min-h-screen">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
