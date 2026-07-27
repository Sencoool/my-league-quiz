"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthService, UserService } from "../../utils/api";
import { useGameStore } from "../../store/useGameStore";

import { Suspense } from "react";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");
    const errorParam = searchParams.get("error");

    if (errorParam) {
      setStatus("error");
      setErrorMsg(decodeURIComponent(errorParam));
      return;
    }

    if (!token) {
      setStatus("error");
      setErrorMsg("No token received from Google.");
      return;
    }

    const handleCallback = async () => {
      try {
        // 1. Save token to localStorage
        AuthService.saveToken(token);

        // 2. Fetch user profile using the new token
        const me = await UserService.getMe();

        // 3. Update Zustand store
        useGameStore.setState({ user: me });

        setStatus("success");

        // 4. Redirect to homepage after a short delay
        setTimeout(() => router.replace("/"), 1200);
      } catch (e) {
        console.error("Auth callback error:", e);
        AuthService.clearToken();
        setStatus("error");
        setErrorMsg("Failed to sign in. Please try again.");
      }
    };

    handleCallback();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col items-center gap-6 p-10 rounded-3xl bg-[#1E293B] border border-white/10 shadow-2xl max-w-sm w-full mx-4">
      {status === "loading" && (
        <>
          <div className="w-14 h-14 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
          <div className="text-center">
            <p className="text-white font-bold text-lg tracking-wide">Signing you in…</p>
            <p className="text-zinc-400 text-sm mt-1">Please wait a moment</p>
          </div>
        </>
      )}

      {status === "success" && (
        <>
          <div className="w-14 h-14 rounded-full bg-emerald-500/20 border-2 border-emerald-500/50 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <div className="text-center">
            <p className="text-emerald-400 font-bold text-lg tracking-wide">Signed in!</p>
            <p className="text-zinc-400 text-sm mt-1">Redirecting you to the game…</p>
          </div>
        </>
      )}

      {status === "error" && (
        <>
          <div className="w-14 h-14 rounded-full bg-rose-500/20 border-2 border-rose-500/50 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#f43f5e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </div>
          <div className="text-center">
            <p className="text-rose-400 font-bold text-lg tracking-wide">Sign-in Failed</p>
            <p className="text-zinc-400 text-sm mt-1">{errorMsg}</p>
          </div>
          <button
            onClick={() => router.replace("/")}
            className="px-6 py-2.5 bg-zinc-700 hover:bg-zinc-600 text-white rounded-xl transition-colors text-sm font-medium"
          >
            Back to Home
          </button>
        </>
      )}
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <div className="min-h-screen bg-[#0B1121] flex items-center justify-center">
      <Suspense fallback={<div className="w-14 h-14 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />}>
        <AuthCallbackContent />
      </Suspense>
    </div>
  );
}
