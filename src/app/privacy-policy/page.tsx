import Link from 'next/link';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#0a0f18] text-zinc-300 py-12 px-6 sm:px-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10">
          <Link href="/" className="text-emerald-500 hover:text-emerald-400 font-medium flex items-center gap-2 w-fit mb-6">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6"/>
            </svg>
            Back to Game
          </Link>
          <h1 className="text-4xl font-black text-white mb-4">Privacy Policy</h1>
          <p className="text-zinc-400">Last updated: July 30, 2026</p>
        </div>

        <div className="space-y-8 text-lg leading-relaxed bg-[#111827] border border-white/5 p-8 rounded-3xl shadow-xl">
          
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="text-emerald-500">1.</span> Introduction
            </h2>
            <p>
              Welcome to <strong>PoroGuess</strong>. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our game. We are committed to protecting your personal information and your right to privacy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="text-emerald-500">2.</span> Information We Collect
            </h2>
            <p className="mb-3">
              When you choose to sign in to PoroGuess using your Google account (Google OAuth), we collect the following information provided by Google:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-zinc-400">
              <li><strong className="text-zinc-300">Email Address:</strong> Used as a unique identifier for your account.</li>
              <li><strong className="text-zinc-300">Basic Profile Information:</strong> Including your name and profile picture (if available), which are used to generate your initial in-game username and avatar.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="text-emerald-500">3.</span> How We Use Your Information
            </h2>
            <p className="mb-3">We use the information we collect or receive to:</p>
            <ul className="list-disc pl-6 space-y-2 text-zinc-400">
              <li><strong>Create and Manage Your Account:</strong> To allow you to log in, save your game progress, and maintain your streak.</li>
              <li><strong>Global Leaderboard:</strong> To display your username and score on our competitive leaderboard.</li>
              <li><strong>Improve the Game:</strong> To understand how players use our platform so we can improve the user experience.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="text-emerald-500">4.</span> Sharing Your Information
            </h2>
            <p>
              We <strong>do not</strong> sell, rent, or trade your personal information to third parties. Your data is strictly used for the internal functionality of the PoroGuess game. Your username and in-game statistics (Rank, Score, Streak) will be publicly visible on the Leaderboard to other players.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="text-emerald-500">5.</span> Data Retention and Deletion
            </h2>
            <p>
              We will keep your personal information only for as long as it is necessary for the purposes set out in this privacy policy. If you wish to have your account and all associated data permanently deleted from our servers, please contact us.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="text-emerald-500">6.</span> Contact Us
            </h2>
            <p>
              If you have questions or comments about this Privacy Policy, please contact the developer via GitHub or email at the contact information provided on our main project repository.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
