"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Navigation, Lock, Mail } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    setError("");
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("Invalid credentials. Please try again.");
      setIsPending(false);
    } else {
      router.push("/");
      router.refresh();
    }
  };

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/" });
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center animate-in fade-in zoom-in duration-500">
      <div className="glass-card w-full max-w-md p-8 relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#1A73E8] opacity-20 rounded-full blur-[50px] pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-[#188038] opacity-20 rounded-full blur-[50px] pointer-events-none" />
        
        <div className="flex flex-col items-center mb-8 relative z-10">
          <div className="w-16 h-16 rounded-full bg-[#0d1117] text-[#00e5a0] flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(0,229,160,0.2)] border border-[#00e5a0]/50">
            <Navigation className="w-8 h-8 ml-[-2px] mt-[-2px] rotate-45" strokeWidth={2.5} />
          </div>
          <h1 className="text-2xl font-bold text-[#202124] font-['Syne']">Welcome Back</h1>
          <p className="text-[#5F6368] text-sm mt-1">Log in to navigate the chaos of Dhaka</p>
        </div>

        {error && (
          <div className="bg-[#D93025]/10 border border-[#D93025]/20 text-[#D93025] p-3 rounded-lg text-sm mb-6 flex items-center justify-center relative z-10">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#5F6368] uppercase tracking-wider ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#5F6368]" />
              <input 
                type="email" 
                name="email"
                placeholder="you@example.com" 
                required
                className="w-full bg-white/60 border border-[#DADCE0]/60 rounded-lg py-3 pl-10 pr-4 text-[#202124] placeholder-[#8b949e]/50 focus:outline-none focus:border-[#1A73E8] focus:ring-1 focus:ring-[#1A73E8] transition-all"
              />
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="flex justify-between items-center ml-1">
              <label className="text-xs font-semibold text-[#5F6368] uppercase tracking-wider">Password</label>
              <a href="#" className="text-xs text-[#188038] hover:text-[#202124] transition-colors">Forgot?</a>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#5F6368]" />
              <input 
                type="password" 
                name="password"
                placeholder="••••••••" 
                required
                className="w-full bg-white/60 border border-[#DADCE0]/60 rounded-lg py-3 pl-10 pr-4 text-[#202124] placeholder-[#8b949e]/50 focus:outline-none focus:border-[#1A73E8] focus:ring-1 focus:ring-[#1A73E8] transition-all"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isPending}
            className="w-full bg-gradient-to-r from-[#1A73E8] to-[#1557B0] text-white font-bold py-3 rounded-lg hover:shadow-[0_4px_12px_rgba(26,115,232,0.3)] transition-all flex items-center justify-center mt-2 disabled:opacity-50"
          >
            {isPending ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              "Login to SmartNav"
            )}
          </button>
        </form>

        <div className="relative z-10 mt-6">
          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-[#DADCE0]/60"></div>
            <span className="flex-shrink-0 mx-4 text-[#5F6368] text-xs uppercase tracking-wider font-semibold">Or continue with</span>
            <div className="flex-grow border-t border-[#DADCE0]/60"></div>
          </div>
          
          <button 
            onClick={handleGoogleSignIn}
            className="w-full mt-4 bg-white text-[#202124] font-bold py-3 rounded-lg hover:bg-gray-100 transition-all flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Google
          </button>
        </div>
        
        <div className="mt-6 text-center text-sm text-[#5F6368] relative z-10">
          Don&apos;t have an account? <Link href="/register" className="text-[#1A73E8] hover:text-[#202124] transition-colors font-medium">Create one</Link>
        </div>
      </div>
    </div>
  );
}
