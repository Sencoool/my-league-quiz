export type LoadingSceneType = 'classic' | 'traits' | 'jigsaw' | 'matcher' | 'leaderboard' | 'default';

export default function LoadingScene({ type = 'default', text = "Loading..." }: { type?: LoadingSceneType, text?: string }) {
  
  if (type === 'classic') {
    return (
      <div className="w-full flex flex-col items-center flex-grow py-2 container mx-auto xl:pt-[100px] pt-[50px]">
        {/* search box container */}
        <div className="flex flex-col items-center container mx-auto bg-[#1E293B]/60 border border-white/5 p-8 rounded-3xl max-w-1/4 min-h-[300px] min-w-3/4 md:min-w-[500px]">
          
          <div className="w-full relative flex items-center justify-center mb-6 mt-2">
            <h1 className="text-3xl md:text-4xl font-bold text-center tracking-wide px-12 flex flex-col md:flex-row flex-wrap justify-center items-center gap-2">
              <span className="block h-8 md:h-10 bg-zinc-800/80 rounded-xl animate-pulse w-20 md:w-40"></span>
              <span className="block h-8 md:h-10 bg-zinc-800/80 rounded-xl animate-pulse w-28 md:w-36"></span>
              <span className="block h-8 md:h-10 bg-zinc-800/80 rounded-xl animate-pulse w-24 md:hidden"></span>
            </h1>
            <div className="absolute right-0 md:right-4 w-8 h-8 rounded-full bg-zinc-800/80 border border-white/10 animate-pulse" />
          </div>

          <div className="w-[85%] md:w-full flex flex-col items-center justify-center">
             <div className="w-full h-[58px] bg-[#111620]/60 rounded-xl animate-pulse border border-white/5" />
          </div>

          <div className="flex flex-col items-center mt-auto pt-6 w-full">
            <div className="h-5 w-24 bg-zinc-800/80 rounded mb-4 animate-pulse" />
            <div className="flex items-center justify-center gap-6 sm:gap-12 w-full px-2 sm:px-0">
               <div className="flex flex-col items-center gap-2">
                 <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-zinc-800 animate-pulse" />
                 <div className="h-4 w-12 bg-zinc-800/80 rounded animate-pulse" />
               </div>
               <div className="flex flex-col items-center gap-2">
                 <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-zinc-800 animate-pulse" />
                 <div className="h-4 w-12 bg-zinc-800/80 rounded animate-pulse" />
               </div>
               <div className="flex flex-col items-center gap-2">
                 <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-zinc-800 animate-pulse" />
                 <div className="h-4 w-12 bg-zinc-800/80 rounded animate-pulse" />
               </div>
            </div>
          </div>

          <div className="flex justify-center mt-6 sm:mt-8 w-full mb-2">
             <div className="flex flex-col items-center gap-2">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-zinc-800/60 animate-pulse" />
                <div className="flex flex-col items-center">
                  <div className="h-5 w-24 bg-zinc-800/60 rounded animate-pulse mb-1" />
                  <div className="h-4 w-16 bg-zinc-800/60 rounded animate-pulse" />
                </div>
             </div>
          </div>
        </div>
        
        <div className="w-full flex items-center justify-center mb-2 mt-4 lg:hidden">
          <div className="w-32 h-4 bg-zinc-800/80 rounded animate-pulse" />
        </div>
        
        <div className="mt-4 px-2 sm:px-5 w-full overflow-x-auto scrollbar-hidden">
          <div className="w-max mx-auto flex flex-col items-center">
            {/* Table Header */}
            <div className="w-[1256px] grid grid-cols-8 gap-2 bg-zinc-800/60 rounded-xl mb-4 border border-white/5 shadow-lg py-4 px-2 sm:px-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                <div key={i} className="flex justify-center items-center h-[24px] w-[150px]">
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
      <div className="w-full flex flex-col items-center flex-grow py-2 container mx-auto xl:pt-[80px] pt-[30px]">
        {/* Main Card */}
        <div className="flex flex-col items-center w-full bg-[#1c2331]/60 border border-white/5 p-6 md:p-10 rounded-3xl max-w-[95%] md:w-[600px]">
          
          <div className="w-full relative flex items-center justify-center mb-6 mt-2">
             <div className="h-10 w-[350px] bg-zinc-800/80 rounded-xl animate-pulse" />
             <div className="absolute right-0 md:right-4 w-8 h-8 rounded-full bg-zinc-800/80 border border-white/10 animate-pulse" />
          </div>
          
          <div className="flex justify-between w-full mb-6 px-2">
            <div className="h-5 w-24 bg-zinc-800/80 rounded animate-pulse" />
            <div className="h-5 w-40 bg-zinc-800/80 rounded animate-pulse" />
          </div>

          {/* Traits Blocks */}
          <div className="w-full flex flex-col gap-4 mb-8">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="relative w-full h-[55px] bg-[#2a364a]/40 border border-yellow-500/20 rounded-md animate-pulse" />
            ))}
          </div>

          {/* Input Area */}
          <div className="flex flex-col items-center w-full relative mb-2">
            <div className="flex items-center w-full gap-4 px-2">
              <div className="w-5 h-5 rounded-full bg-yellow-500/30 animate-pulse" />
              <div className="w-full h-[50px] bg-[#111620]/60 rounded-lg animate-pulse border border-yellow-600/20" />
              <div className="w-12 h-12 rounded-full bg-[#111620]/80 animate-pulse border border-yellow-600/30 shrink-0" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'jigsaw') {
    return (
      <div className="w-full flex flex-col items-center flex-grow py-2 container mx-auto xl:pt-[100px] pt-[50px]">
        {/* Main Card */}
        <div className="flex flex-col items-center w-full bg-[#1E293B]/60 border border-white/5 p-4 sm:p-8 rounded-3xl max-w-[95%] md:w-[600px] lg:w-[800px]">
          
          <div className="w-full relative flex items-center justify-center mb-6 mt-2">
             <div className="h-10 w-[420px] bg-zinc-800/80 rounded-xl animate-pulse" />
             <div className="absolute right-0 md:right-4 w-8 h-8 rounded-full bg-zinc-800/80 border border-white/10 animate-pulse" />
          </div>
          
          <div className="flex justify-between w-full mb-6 px-2">
            <div className="h-5 w-24 bg-zinc-800/80 rounded animate-pulse" />
            <div className="h-5 w-40 bg-zinc-800/80 rounded animate-pulse" />
          </div>

          {/* Jigsaw Board */}
          <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-lg border-2 border-white/10 mb-8 bg-zinc-900/40">
            <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 w-full h-full">
              {Array.from({ length: 16 }).map((_, idx) => (
                <div key={idx} className="border border-white/5 bg-[#0f172a]/60 animate-pulse" />
              ))}
            </div>
          </div>

          <div className="flex flex-col items-center w-full relative mb-4">
            <div className="w-full md:w-3/4 h-[62px] bg-[#0B1121]/60 rounded-xl animate-pulse border border-white/20" />
          </div>

          <div className="mt-6 flex flex-col items-center w-full max-w-[90%] min-h-[90px]">
            <div className="h-4 w-32 bg-zinc-800/80 rounded animate-pulse mb-3" />
            <div className="flex items-center justify-center min-h-[32px]">
              <div className="h-4 w-40 bg-zinc-800/80 rounded animate-pulse opacity-50" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'matcher') {
    return (
      <div className="w-full flex flex-col items-center flex-grow py-4 container mx-auto xl:pt-[90px] pt-[40px] px-4">
        
        {/* Stats Card Skeleton */}
        <div className="flex flex-col items-center w-full bg-[#1E293B]/60 border border-white/5 p-6 rounded-3xl shadow-2xl max-w-5xl mb-5 relative">
          
          <div className="w-full relative flex items-center justify-center mb-1 mt-2">
            <h1 className="text-3xl md:text-4xl font-bold text-center tracking-wide px-4 flex flex-col md:flex-row flex-wrap justify-center items-center gap-2">
              <span className="block h-8 md:h-10 bg-zinc-800/80 rounded-xl animate-pulse w-32 md:w-56 mb-1 md:mb-0"></span>
              <span className="block h-8 md:h-10 bg-zinc-800/80 rounded-xl animate-pulse w-40 md:w-64"></span>
            </h1>
            <div className="absolute right-0 top-0 md:right-4 w-8 h-8 rounded-full bg-zinc-800/80 border border-white/10 animate-pulse" />
          </div>
          <div className="h-4 w-64 md:w-96 bg-zinc-800/80 rounded-xl animate-pulse mb-4 mt-2" />

          <div className="flex items-center justify-center gap-6 md:gap-12 w-full flex-wrap">
            <div className="flex flex-col items-center gap-1">
              <div className="h-3 w-10 bg-zinc-800/80 rounded animate-pulse" />
              <div className="h-8 w-16 md:w-20 bg-zinc-800/80 rounded animate-pulse" />
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="h-3 w-10 bg-zinc-800/80 rounded animate-pulse" />
              <div className="h-8 w-16 md:w-20 bg-zinc-800/80 rounded animate-pulse" />
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="h-3 w-10 bg-zinc-800/80 rounded animate-pulse" />
              <div className="h-8 w-16 md:w-20 bg-zinc-800/80 rounded animate-pulse" />
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="h-3 w-10 bg-zinc-800/80 rounded animate-pulse" />
              <div className="h-8 w-20 md:w-28 bg-zinc-800/80 rounded animate-pulse" />
            </div>
          </div>

          <div className="w-full mt-4 bg-zinc-800/60 rounded-full h-2 animate-pulse" />
          <div className="flex gap-4 mt-3 flex-wrap justify-center">
            <div className="h-3 w-20 bg-zinc-800/80 rounded animate-pulse" />
            <div className="h-3 w-20 bg-zinc-800/80 rounded animate-pulse" />
            <div className="h-3 w-20 bg-zinc-800/80 rounded animate-pulse" />
            <div className="h-3 w-20 bg-zinc-800/80 rounded animate-pulse" />
          </div>
        </div>

        {/* Board Skeleton */}
        <div className="w-full max-w-5xl bg-[#1E293B]/60 border border-white/5 p-4 md:p-5 rounded-3xl shadow-2xl">
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 md:gap-3">
            {Array.from({ length: 32 }).map((_, i) => (
              <div key={i} className="aspect-square bg-zinc-800/80 rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (type === 'leaderboard') {
    return (
      <div className="w-full flex flex-col">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex items-center px-4 sm:px-6 py-3 sm:py-4 border-b border-white/5">
            <div className="w-10 sm:w-16 flex justify-center">
              <div className="w-6 h-6 bg-zinc-800/80 rounded animate-pulse" />
            </div>
            
            <div className="flex-1 flex items-center gap-3 sm:gap-4 ml-2 sm:ml-0 min-w-0">
              <div className="w-12 h-12 rounded-full bg-zinc-800/80 animate-pulse shrink-0" />
              <div className="flex flex-col gap-2 w-full max-w-[200px]">
                <div className="h-5 w-24 sm:w-32 bg-zinc-800/80 rounded animate-pulse" />
                <div className="h-3 w-16 sm:w-20 bg-zinc-800/80 rounded animate-pulse" />
              </div>
            </div>

            <div className="w-24 flex justify-center hidden sm:flex">
              <div className="h-7 w-14 bg-zinc-800/80 rounded-full animate-pulse" />
            </div>

            <div className="w-16 sm:w-24 flex justify-end">
              <div className="h-6 w-12 sm:w-16 bg-zinc-800/80 rounded animate-pulse" />
            </div>
          </div>
        ))}
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
