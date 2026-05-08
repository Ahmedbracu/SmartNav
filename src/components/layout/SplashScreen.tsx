"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navigation } from "lucide-react";
import Image from "next/image";

export default function SplashScreen() {
  const [show, setShow] = useState(true);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const hasSeenIntro = sessionStorage.getItem("smartnav_intro");
    if (hasSeenIntro) {
      setShow(false);
    } else {
      setReady(true);
      sessionStorage.setItem("smartnav_intro", "true");
      const timer = setTimeout(() => setShow(false), 4000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = useCallback(() => {
    setShow(false);
  }, []);

  if (!ready && !show) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          onClick={handleDismiss}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center cursor-pointer bg-gradient-to-br from-white/80 via-white/60 to-white/80 backdrop-blur-3xl overflow-hidden"
        >
          {/* Liquid Background elements */}
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#1A73E8]/10 blur-[80px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-[#188038]/10 blur-[100px]" />
          
          {/* Logo Animation */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex items-center gap-6 mb-4"
          >
            <div className="relative w-20 h-20 flex items-center justify-center">
              <div className="absolute inset-0 border-4 border-[#00e5a0]/20 rounded-full animate-ping" style={{ animationDuration: '2s' }}></div>
              <div className="absolute inset-2 border-4 border-[#00e5a0]/40 rounded-full animate-pulse" style={{ animationDuration: '3s' }}></div>
              <div className="w-16 h-16 rounded-full bg-[#0d1117] text-[#00e5a0] flex items-center justify-center shadow-[0_0_40px_rgba(0,229,160,0.4)] border border-[#00e5a0]/50 z-10">
                <Navigation className="w-8 h-8 ml-[-2px] mt-[-2px] rotate-45 animate-pulse" strokeWidth={2.5} />
              </div>
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

          {/* HASHARC Studio with Logo */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-[#5F6368] font-medium tracking-wide flex items-center gap-3"
          >
            Powered by
            <span className="flex items-center gap-2">
              <Image
                src="/HASHARC Studio.jpg"
                alt="HASHARC Studio"
                width={28}
                height={28}
                className="rounded-full object-cover border border-[#DADCE0] shadow-sm"
              />
              <span className="text-[#202124] font-bold">HASHARC Studio</span>
            </span>
          </motion.div>
          
          {/* Progress Bar */}
          <motion.div 
            className="absolute bottom-24 w-48 h-1 bg-[#DADCE0]/60 rounded-full overflow-hidden"
          >
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 3.5, ease: "linear" }}
              className="h-full bg-gradient-to-r from-[#1A73E8] to-[#188038]"
            />
          </motion.div>

          {/* Tap indicator */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: [0, 1, 0.5, 1], y: 0 }}
            transition={{ delay: 2, duration: 2, repeat: Infinity }}
            className="absolute bottom-12 text-[#5F6368] text-xs uppercase tracking-[0.2em] font-bold"
          >
            Tap to continue
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
