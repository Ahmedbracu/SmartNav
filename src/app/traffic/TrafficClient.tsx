"use client";

import { useState } from "react";
import { Activity, TrafficCone, PlusCircle, CheckCircle2, AlertCircle } from "lucide-react";
import { submitTrafficData } from "@/app/actions/traffic";
import Link from "next/link";

export default function TrafficClient({ isLoggedIn, userId, locations, recentTraffic, worstRoads }: any) {
  const [isPending, setIsPending] = useState(false);
  const [msg, setMsg] = useState("");
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    const formData = new FormData(e.currentTarget);
    const res = await submitTrafficData(userId, formData);
    
    if (res.error) {
      setMsg(res.error);
      setIsError(true);
    } else {
      setMsg(res.success || "Submitted");
      setIsError(false);
      (e.target as HTMLFormElement).reset();
    }
    setIsPending(false);
  };

  const getCongestionColor = (level: string) => {
    switch(level) {
      case 'Gridlock': return 'text-[#ff6b8a] bg-[#ff6b8a]/10';
      case 'Heavy': return 'text-[#fbbf24] bg-[#fbbf24]/10';
      case 'Moderate': return 'text-[#38bdf8] bg-[#38bdf8]/10';
      default: return 'text-[#00e5a0] bg-[#00e5a0]/10';
    }
  };

  return (
    <div className="animate-in fade-in duration-500 max-w-6xl mx-auto pb-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 font-['Syne'] flex items-center gap-3">
          <Activity className="w-8 h-8 text-[#38bdf8]" />
          Traffic Analytics
        </h1>
        <p className="text-[#8b949e]">Live congestion data and crowdsourced updates.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 items-start">
        {/* Worst Roads */}
        <div className="glass-card lg:col-span-2">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <TrafficCone className="w-5 h-5 text-[#ff6b8a]" /> Worst Roads Today
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-[#0d1117] text-[#8b949e] border-b border-[#30363d]">
                  <th className="p-3 text-xs uppercase tracking-wider font-semibold">Location</th>
                  <th className="p-3 text-xs uppercase tracking-wider font-semibold">Avg Speed</th>
                  <th className="p-3 text-xs uppercase tracking-wider font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {worstRoads.length === 0 ? (
                  <tr><td colSpan={3} className="p-4 text-center text-[#8b949e] italic">No data available.</td></tr>
                ) : (
                  worstRoads.map((w: any, i: number) => (
                    <tr key={i} className="border-b border-[#30363d]/50 hover:bg-[#161b22] transition-colors">
                      <td className="p-3 font-bold text-white">{w.location_name}</td>
                      <td className="p-3 text-[#8b949e]">{Math.round(w.avg_spd * 10) / 10} km/h</td>
                      <td className="p-3">
                        <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded ${getCongestionColor(w.congestion_level)}`}>
                          {w.congestion_level}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Submit Form */}
        <div className="glass-card">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-[#00e5a0]" /> Report Traffic
          </h2>
          {!isLoggedIn ? (
            <div className="text-sm text-[#8b949e] text-center p-4 bg-[#0d1117] rounded-lg border border-[#30363d]">
              Please <Link href="/login" className="text-[#00e5a0] hover:underline">log in</Link> to submit reports.
            </div>
          ) : (
            <>
              {msg && (
                <div className={`p-3 rounded-lg text-xs mb-4 flex items-center gap-2 ${isError ? "bg-[#ff6b8a]/10 text-[#ff6b8a]" : "bg-[#00e5a0]/10 text-[#00e5a0]"}`}>
                  {isError ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />} {msg}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className="text-xs text-[#8b949e] uppercase mb-1 block">Location</label>
                  <select name="location_id" required className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg p-2 text-white text-sm">
                    {locations.map((l:any) => <option key={l._id} value={l._id}>{l.name}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-[#8b949e] uppercase mb-1 block">Congestion</label>
                    <select name="congestion_level" className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg p-2 text-white text-sm">
                      <option value="Clear">Clear</option>
                      <option value="Moderate">Moderate</option>
                      <option value="Heavy">Heavy</option>
                      <option value="Gridlock">Gridlock</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-[#8b949e] uppercase mb-1 block">Speed (km/h)</label>
                    <input type="number" step="0.1" name="avg_speed" required className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg p-2 text-white text-sm" placeholder="e.g. 15" />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-[#8b949e] uppercase mb-1 block">Description</label>
                  <input type="text" name="description" className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg p-2 text-white text-sm" placeholder="Optional notes" />
                </div>
                <button type="submit" disabled={isPending} className="w-full bg-[#38bdf8] text-black font-bold py-2 rounded-lg hover:bg-[#0284c7] transition-colors mt-2 text-sm disabled:opacity-50">
                  {isPending ? "Submitting..." : "Submit Report"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>

      {/* All Records Table */}
      <div className="glass-card p-0 overflow-hidden">
        <div className="p-4 border-b border-[#30363d] bg-[#161b22]/50">
          <h2 className="text-lg font-bold text-white">Recent Traffic Records</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-[#0d1117] text-[#8b949e] border-b border-[#30363d]">
                <th className="p-4 text-xs uppercase tracking-wider font-semibold">Location</th>
                <th className="p-4 text-xs uppercase tracking-wider font-semibold">Speed</th>
                <th className="p-4 text-xs uppercase tracking-wider font-semibold">Congestion</th>
                <th className="p-4 text-xs uppercase tracking-wider font-semibold">Time</th>
                <th className="p-4 text-xs uppercase tracking-wider font-semibold">Notes</th>
              </tr>
            </thead>
            <tbody>
              {recentTraffic.length === 0 ? (
                <tr><td colSpan={5} className="p-6 text-center text-[#8b949e] italic">No traffic records found.</td></tr>
              ) : (
                recentTraffic.map((t: any) => (
                  <tr key={t._id} className="border-b border-[#30363d]/50 hover:bg-[#161b22] transition-colors">
                    <td className="p-4 font-bold text-white">{t.location_name}</td>
                    <td className="p-4 text-[#8b949e]">{t.avg_speed} km/h</td>
                    <td className="p-4">
                      <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded ${getCongestionColor(t.congestion_level)}`}>
                        {t.congestion_level}
                      </span>
                    </td>
                    <td className="p-4 text-[#8b949e] text-xs">{new Date(t.recorded_at).toLocaleString()}</td>
                    <td className="p-4 text-[#8b949e] text-xs truncate max-w-xs">{t.description || "—"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
