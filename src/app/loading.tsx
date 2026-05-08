import { Navigation } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in duration-500">
      <div className="relative w-20 h-20 flex items-center justify-center mb-6">
        <div className="absolute inset-0 border-4 border-[#1A73E8]/20 rounded-full animate-ping" style={{ animationDuration: '1.5s' }}></div>
        <div className="absolute inset-2 border-4 border-[#1A73E8]/40 rounded-full animate-pulse" style={{ animationDuration: '2s' }}></div>
        <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#1A73E8] to-[#4285F4] text-white flex items-center justify-center shadow-[0_0_24px_rgba(26,115,232,0.5)] z-10">
          <Navigation className="w-6 h-6 animate-pulse" />
        </div>
      </div>
      <div className="text-xl font-bold text-[#202124] font-['Syne'] tracking-wide">
        Loading...
      </div>
      <div className="text-sm text-[#5F6368] mt-2 font-medium">
        Fetching real-time data
      </div>
    </div>
  );
}
