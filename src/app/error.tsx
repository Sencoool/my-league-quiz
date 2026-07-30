"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to your monitoring service (e.g., Sentry) here
    console.error("Global error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#060b14] text-white px-4">
      <div className="flex flex-col items-center gap-6 max-w-md text-center bg-[#1E293B]/80 border border-white/10 rounded-3xl p-10 shadow-2xl">
        <div className="text-6xl">🐾</div>
        <h1 className="text-2xl font-bold text-white">Poro got confused!</h1>
        <p className="text-zinc-400 text-sm leading-relaxed">
          Something unexpected happened. Don&apos;t worry, our Poro scouts are
          on it. Try refreshing the page.
        </p>
        {error.digest && (
          <p className="text-xs text-zinc-600 font-mono">
            Error ID: {error.digest}
          </p>
        )}
        <div className="flex gap-3 w-full">
          <button
            onClick={reset}
            className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 font-semibold text-sm transition-colors cursor-pointer"
          >
            Try Again
          </button>
          <a
            href="/"
            className="flex-1 py-3 rounded-xl bg-zinc-700/60 hover:bg-zinc-600/60 font-semibold text-sm transition-colors text-center"
          >
            Go Home
          </a>
        </div>
      </div>
    </div>
  );
}
