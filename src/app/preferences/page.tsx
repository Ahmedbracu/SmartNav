"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Settings, Save, Clock, DollarSign, AlertTriangle, Star } from "lucide-react";
import { updatePreferences, getAccountSummary } from "@/app/actions/preferences";

export default function PreferencesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [msg, setMsg] = useState("");
  const [isError, setIsError] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [summary, setSummary] = useState({ trips: 0, incidents: 0, reviews: 0, totalSpent: 0 });

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (session?.user?.id) {
      getAccountSummary(session.user.id).then(setSummary);
    }
  }, [session]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!session?.user?.id) return;
    setIsPending(true);
    const formData = new FormData(e.currentTarget);
    const res = await updatePreferences(session.user.id, formData);
    if (res.error) {
      setMsg(res.error);
      setIsError(true);
    } else {
      setMsg(res.success || "Saved!");
      setIsError(false);
    }
    setIsPending(false);
  };

  if (status === "loading") return <div className="text-[#5F6368]">Loading...</div>;
  if (!session) return null;

  return (
    <div className="animate-in fade-in duration-500 max-w-xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#202124] mb-2 font-['Syne'] flex items-center gap-3">
          <Settings className="w-8 h-8 text-[#188038]" />
          My Preferences
        </h1>
        <p className="text-[#5F6368]">Update your profile and account settings.</p>
      </div>

      <div className="glass-card mb-6">
        {msg && (
          <div className={`p-3 rounded-lg text-sm mb-4 ${isError ? "bg-[#D93025]/10 border border-[#D93025]/20 text-[#D93025]" : "bg-[#1A73E8]/10 border border-[#1A73E8]/20 text-[#1A73E8]"}`}>
            {msg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#5F6368] uppercase tracking-wider">Full Name</label>
            <input type="text" name="name" defaultValue={session.user?.name || ""} required
              className="w-full bg-white/60 border border-[#DADCE0] rounded-lg py-3 px-4 text-[#202124] focus:outline-none focus:border-[#1A73E8]" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#5F6368] uppercase tracking-wider">Email</label>
            <input type="email" name="email" defaultValue={session.user?.email || ""} required
              className="w-full bg-white/60 border border-[#DADCE0] rounded-lg py-3 px-4 text-[#202124] focus:outline-none focus:border-[#1A73E8]" />
          </div>

          <div className="pt-4 border-t border-[#DADCE0]/60">
            <div className="text-xs font-semibold text-[#5F6368] uppercase tracking-wider mb-4">Change Password</div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs text-[#5F6368]">New Password</label>
                <input type="password" name="new_password" placeholder="Leave blank to keep"
                  className="w-full bg-white/60 border border-[#DADCE0] rounded-lg py-3 px-4 text-[#202124] focus:outline-none focus:border-[#1A73E8]" />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-[#5F6368]">Confirm Password</label>
                <input type="password" name="confirm_password" placeholder="Repeat"
                  className="w-full bg-white/60 border border-[#DADCE0] rounded-lg py-3 px-4 text-[#202124] focus:outline-none focus:border-[#1A73E8]" />
              </div>
            </div>
          </div>

          <button type="submit" disabled={isPending}
            className="w-full bg-[#1A73E8] text-white font-bold py-3 rounded-lg hover:bg-[#1557B0] transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
            {isPending ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><Save className="w-5 h-5" /> Save Preferences</>}
          </button>
        </form>
      </div>

      {/* Account Summary */}
      <div className="glass-card">
        <h2 className="text-lg font-bold text-[#202124] mb-4">Account Summary</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/60 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-[#1A73E8] font-['Syne']">{summary.trips}</div>
            <div className="text-xs text-[#5F6368] flex items-center justify-center gap-1 mt-1"><Clock className="w-3 h-3" /> Total Trips</div>
          </div>
          <div className="bg-white/60 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-[#188038] font-['Syne']">৳{summary.totalSpent.toLocaleString()}</div>
            <div className="text-xs text-[#5F6368] flex items-center justify-center gap-1 mt-1"><DollarSign className="w-3 h-3" /> Total Spent</div>
          </div>
          <div className="bg-white/60 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-[#F4B400] font-['Syne']">{summary.incidents}</div>
            <div className="text-xs text-[#5F6368] flex items-center justify-center gap-1 mt-1"><AlertTriangle className="w-3 h-3" /> Reports Filed</div>
          </div>
          <div className="bg-white/60 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-[#D93025] font-['Syne']">{summary.reviews}</div>
            <div className="text-xs text-[#5F6368] flex items-center justify-center gap-1 mt-1"><Star className="w-3 h-3" /> Reviews</div>
          </div>
        </div>
      </div>
    </div>
  );
}
