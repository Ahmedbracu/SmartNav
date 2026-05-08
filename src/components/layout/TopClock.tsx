"use client";

import { useEffect, useState } from "react";

export default function TopClock() {
  const [time, setTime] = useState<string>("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const updateClock = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }));
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) return <div className="fixed top-4 right-6 z-40 text-sm font-medium text-[#5F6368] w-16 h-6" />;

  return (
    <div className="hidden md:flex fixed top-4 right-6 z-40 items-center glass px-4 py-1.5 rounded-full border border-white/40 shadow-sm backdrop-blur-md">
      <span className="text-sm font-semibold text-[#202124] tracking-wide">
        {time}
      </span>
    </div>
  );
}
