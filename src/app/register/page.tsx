"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Map, Lock, Mail, User } from "lucide-react";
import Link from "next/link";
import { registerUser } from "@/app/actions/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    setError("");
    
    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;
    const confirm = formData.get("confirm_password") as string;

    if (password !== confirm) {
      setError("Passwords do not match");
      setIsPending(false);
      return;
    }

    const res = await registerUser(formData);

    if (res?.error) {
      setError(res.error);
      setIsPending(false);
    } else {
      router.push("/login");
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center animate-in fade-in zoom-in duration-500">
      <div className="glass-card w-full max-w-md p-8 relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#00e5a0] opacity-20 rounded-full blur-[50px] pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-[#38bdf8] opacity-20 rounded-full blur-[50px] pointer-events-none" />
        
        <div className="flex flex-col items-center mb-8 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-[#00e5a0]/10 text-[#00e5a0] flex items-center justify-center mb-4 border border-[#00e5a0]/20 shadow-[0_0_20px_rgba(0,229,160,0.1)]">
            <Map className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-white font-['Syne']">Create Account</h1>
          <p className="text-[#8b949e] text-sm mt-1">Join the SmartNav community</p>
        </div>

        {error && (
          <div className="bg-[#ff6b8a]/10 border border-[#ff6b8a]/20 text-[#ff6b8a] p-3 rounded-lg text-sm mb-6 flex items-center justify-center relative z-10">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#8b949e] uppercase tracking-wider ml-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8b949e]" />
              <input 
                type="text" 
                name="name"
                placeholder="John Doe" 
                required
                className="w-full bg-[#0d1117] border border-[#30363d]/60 rounded-lg py-3 pl-10 pr-4 text-white placeholder-[#8b949e]/50 focus:outline-none focus:border-[#00e5a0] focus:ring-1 focus:ring-[#00e5a0] transition-all"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#8b949e] uppercase tracking-wider ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8b949e]" />
              <input 
                type="email" 
                name="email"
                placeholder="you@example.com" 
                required
                className="w-full bg-[#0d1117] border border-[#30363d]/60 rounded-lg py-3 pl-10 pr-4 text-white placeholder-[#8b949e]/50 focus:outline-none focus:border-[#00e5a0] focus:ring-1 focus:ring-[#00e5a0] transition-all"
              />
            </div>
          </div>
          
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#8b949e] uppercase tracking-wider ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8b949e]" />
              <input 
                type="password" 
                name="password"
                placeholder="••••••••" 
                required
                className="w-full bg-[#0d1117] border border-[#30363d]/60 rounded-lg py-3 pl-10 pr-4 text-white placeholder-[#8b949e]/50 focus:outline-none focus:border-[#00e5a0] focus:ring-1 focus:ring-[#00e5a0] transition-all"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#8b949e] uppercase tracking-wider ml-1">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8b949e]" />
              <input 
                type="password" 
                name="confirm_password"
                placeholder="••••••••" 
                required
                className="w-full bg-[#0d1117] border border-[#30363d]/60 rounded-lg py-3 pl-10 pr-4 text-white placeholder-[#8b949e]/50 focus:outline-none focus:border-[#00e5a0] focus:ring-1 focus:ring-[#00e5a0] transition-all"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isPending}
            className="w-full bg-gradient-to-r from-[#00e5a0] to-[#00c489] text-black font-bold py-3 rounded-lg hover:shadow-[0_0_20px_rgba(0,229,160,0.4)] transition-all flex items-center justify-center mt-4 disabled:opacity-50"
          >
            {isPending ? (
              <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : (
              "Sign Up"
            )}
          </button>
        </form>
        
        <div className="mt-6 text-center text-sm text-[#8b949e] relative z-10">
          Already have an account? <Link href="/login" className="text-[#38bdf8] hover:text-white transition-colors font-medium">Log in</Link>
        </div>
      </div>
    </div>
  );
}
