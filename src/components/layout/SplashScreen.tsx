"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navigation } from "lucide-react";

export default function SplashScreen() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    // Only show once per session
    const hasSeenIntro = sessionStorage.getItem("smartnav_intro");
    if (hasSeenIntro) {
      setShow(false);
    } else {
      sessionStorage.setItem("smartnav_intro", "true");
      // Hide after 3 seconds
      const timer = setTimeout(() => setShow(false), 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/60"
        >
          {/* Logo Animation */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex items-center gap-4 mb-4"
          >
            <div className="w-16 h-16 rounded-full bg-[#0d1117] text-[#00e5a0] flex items-center justify-center shadow-[0_0_40px_rgba(0,229,160,0.4)] border border-[#00e5a0]/50">
              <Navigation className="w-8 h-8 ml-[-2px] mt-[-2px] rotate-45" strokeWidth={2.5} />
            </div>
            <div className="text-left">
              <h1 className="font-['Syne'] font-bold text-4xl text-[#202124] tracking-tight">
                SmartNav
              </h1>
              <p className="text-[#1A73E8] text-sm tracking-widest uppercase font-medium">
                Dhaka
              </p>
            </div>
          </motion.div>

          {/* Subtext Animation */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-[#5F6368] font-medium tracking-wide flex items-center gap-2"
          >
            Powered by <span className="text-[#202124] font-bold">HASHARC Studio</span>
          </motion.div>
          
          {/* Progress Bar */}
          <motion.div 
            className="absolute bottom-16 w-48 h-1 bg-[#30363d]/40 rounded-full overflow-hidden"
          >
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 2.5, ease: "linear" }}
              className="h-full bg-gradient-to-r from-[#1A73E8] to-[#188038]"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
