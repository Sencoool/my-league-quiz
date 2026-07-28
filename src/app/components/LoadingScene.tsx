export type LoadingSceneType = 'classic' | 'traits' | 'jigsaw' | 'matcher' | 'leaderboard' | 'default';

export default function LoadingScene({ type = 'default', text = "Loading..." }: { type?: LoadingSceneType, text?: string }) {
  
  if (type === 'classic') {
    return (
      <div className="w-full flex flex-col items-center flex-grow py-2 container mx-auto xl:pt-[100px] pt-[50px]">
        {/* search box container */}
        <div className="flex flex-col items-center container mx-auto bg-[#1E293B]/60 border border-white/5 p-8 rounded-3xl max-w-1/4 min-h-[300px] min-w-3/4 md:min-w-[500px]">
          
          <div className="w-full relative flex flex-col items-center justify-center mb-6 mt-2 gap-1">
             <div className="h-9 w-56 bg-zinc-800/80 rounded-xl animate-pulse" />
             <div className="h-9 w-36 bg-zinc-800/80 rounded-xl animate-pulse" />
             <div className="absolute right-0 md:right-4 w-8 h-8 rounded-full bg-zinc-800/80 border border-white/10 animate-pulse" />
          </div>

          <div className="w-[85%] md:w-full flex flex-col items-center justify-center">
             <div className="w-full h-[58px] bg-[#111620]/60 rounded-xl animate-pulse border border-white/5" />
          </div>

          <div className="flex flex-col items-center mt-auto pt-6 w-full">
            <div className="h-5 w-24 bg-zinc-800/80 rounded mb-4 animate-pulse" />
            <div className="flex items-center justify-center gap-8 md:gap-12">
               <div className="flex flex-col items-center gap-2">
                 <div className="w-4 h-4 rounded-full bg-zinc-800 animate-pulse" />
                 <div className="h-4 w-12 bg-zinc-800/80 rounded animate-pulse" />
               </div>
               <div className="flex flex-col items-center gap-2">
                 <div className="w-4 h-4 rounded-full bg-zinc-800 animate-pulse" />
                 <div className="h-4 w-12 bg-zinc-800/80 rounded animate-pulse" />
               </div>
               <div className="flex flex-col items-center gap-2">
                 <div className="w-4 h-4 rounded-full bg-zinc-800 animate-pulse" />
                 <div className="h-4 w-12 bg-zinc-800/80 rounded animate-pulse" />
               </div>
            </div>
          </div>

          <div className="flex justify-center gap-6 mt-8 mb-2">
             <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 rounded-full bg-zinc-800/60 animate-pulse" />
                <div className="flex flex-col items-center">
                  <div className="h-5 w-24 bg-zinc-800/60 rounded animate-pulse mb-1" />
                  <div className="h-4 w-16 bg-zinc-800/60 rounded animate-pulse" />
                </div>
             </div>
          </div>
        </div>
        
        <div className="mt-4 px-5 w-full overflow-x-auto scrollbar-hidden">
          <div className="w-max mx-auto flex flex-col items-center">
            {/* Table Header */}
            <div className="w-[1256px] grid grid-cols-8 gap-2 bg-zinc-800/60 rounded-xl mb-4 border border-white/5 shadow-lg">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                <div key={i} className="flex justify-center items-center h-[56px] w-[150px]">
                  <div className="w-16 h-4 bg-zinc-700/50 rounded animate-pulse" />
                </div>
              ))}
            </div>

            {/* Empty state guess */}
            <div className="w-[1256px] mb-20 flex flex-col gap-3">
              <div className="flex justify-center items-center bg-[#1E293B]/40 border border-white/5 rounded-xl p-8 w-full h-[88px] animate-pulse">
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'traits') {
    return (
      <div className="w-full flex flex-col items-center flex-grow py-2 container mx-auto pt-8">
        <div className="flex flex-col items-center w-full bg-[#1c2331]/60 border border-white/5 p-6 md:p-10 rounded-3xl max-w-[95%] md:w-[600px]">
          <div className="w-full h-14 bg-zinc-800/80 rounded-xl mb-8 animate-pulse" />
          <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-12 bg-zinc-800/60 rounded-xl animate-pulse" />
            ))}
          </div>
          <div className="w-full grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-12 bg-zinc-800/60 rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (type === 'jigsaw') {
    return (
      <div className="w-full flex flex-col items-center flex-grow py-2 container mx-auto pt-8">
        <div className="flex flex-col items-center w-full bg-[#1E293B]/60 border border-white/5 p-4 sm:p-8 rounded-3xl max-w-[95%] md:w-[600px] lg:w-[800px]">
          {/* Main Jigsaw Board Skeleton */}
          <div className="w-[300px] h-[300px] sm:w-[450px] sm:h-[450px] lg:w-[600px] lg:h-[600px] bg-zinc-800/80 rounded-xl mb-6 animate-pulse" />
          <div className="w-[85%] md:w-3/4 h-14 bg-zinc-800/80 rounded-xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (type === 'matcher') {
    return (
      <div className="w-full flex flex-col items-center flex-grow py-2 container mx-auto pt-8">
        <div className="flex flex-col items-center w-full bg-[#1E293B]/60 border border-white/5 p-6 rounded-3xl max-w-5xl">
          <div className="w-full max-w-[800px] grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 sm:gap-3 lg:gap-4 mt-4">
            {Array.from({ length: 24 }).map((_, i) => (
              <div key={i} className="aspect-square bg-zinc-800/80 rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (type === 'leaderboard') {
    return (
      <div className="w-full flex flex-col items-center flex-grow py-8 container mx-auto pt-8">
        <div className="flex justify-center gap-2 md:gap-4 w-full mb-8">
           {[1, 2, 3, 4, 5].map(i => (
             <div key={i} className="h-12 w-24 md:w-32 bg-zinc-800/80 rounded-xl animate-pulse" />
           ))}
        </div>
        <div className="w-full max-w-3xl flex flex-col gap-3">
          {[1, 2, 3, 4, 5, 6, 7].map(i => (
             <div key={i} className="w-full h-16 bg-[#1E293B]/60 border border-white/5 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  // Default fallback (bouncing logo)
  return (
    <div className="w-full flex-grow flex flex-col items-center justify-center min-h-[50vh]">
      <div className="relative flex flex-col items-center justify-center p-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-blue-500/20 blur-[50px] rounded-full animate-pulse pointer-events-none" />
        <div className="relative w-24 h-24">
          <img 
            src="/img/logo.png" 
            alt="Poro Guess Logo" 
            className="w-full h-full object-contain rounded-full border-2 border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.5)] animate-bounce"
          />
        </div>
        {text && <div className="mt-4 text-zinc-400 font-medium tracking-wide animate-pulse">{text}</div>}
      </div>
    </div>
  );
}
