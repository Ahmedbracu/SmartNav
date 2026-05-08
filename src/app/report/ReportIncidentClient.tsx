"use client";

import { useState } from "react";
import { Flag, AlertCircle, MapPin, Activity, CheckCircle2 } from "lucide-react";
import { reportIncident } from "@/app/actions/incident";

export default function ReportIncidentClient({ userId, locations, recentReports }: any) {
  const [isPending, setIsPending] = useState(false);
  const [msg, setMsg] = useState("");
  const [isError, setIsError] = useState(false);
  const [severity, setSeverity] = useState("Low");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    const formData = new FormData(e.currentTarget);
    const res = await reportIncident(userId, formData);
    
    if (res.error) {
      setMsg(res.error);
      setIsError(true);
    } else {
      setMsg(res.success || "Reported");
      setIsError(false);
      (e.target as HTMLFormElement).reset();
      setSeverity("Low");
    }
    setIsPending(false);
  };

  return (
    <div className="animate-in fade-in duration-500 max-w-xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 font-['Syne'] flex items-center gap-3">
          <Flag className="w-8 h-8 text-[#ff6b8a]" />
          Report a Road Incident
        </h1>
        <p className="text-[#8b949e]">Your report goes live on the Chaos Map immediately and helps other users avoid dangerous areas.</p>
      </div>

      <div className="glass-card mb-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-[#ff6b8a]" />
        
        {msg && (
          <div className={`p-4 rounded-lg text-sm mb-6 flex items-center gap-2 ${isError ? "bg-[#ff6b8a]/10 text-[#ff6b8a] border border-[#ff6b8a]/20" : "bg-[#00e5a0]/10 text-[#00e5a0] border border-[#00e5a0]/20"}`}>
            {isError ? <AlertCircle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
            {msg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#8b949e] uppercase tracking-wider ml-1">Location</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8b949e]" />
              <select name="location_id" required className="w-full bg-[#0d1117] border border-[#30363d]/60 rounded-lg py-3 pl-10 pr-4 text-white appearance-none focus:outline-none focus:border-[#ff6b8a]">
                <option value="">— Select location —</option>
                {locations.map((l: any) => (
                  <option key={l._id} value={l._id}>{l.name} ({l.area_zone})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#8b949e] uppercase tracking-wider ml-1">Incident Type</label>
            <div className="relative">
              <Activity className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8b949e]" />
              <select name="incident_type" required className="w-full bg-[#0d1117] border border-[#30363d]/60 rounded-lg py-3 pl-10 pr-4 text-white appearance-none focus:outline-none focus:border-[#ff6b8a]">
                <option value="">— Select type —</option>
                <option value="Accident">Accident</option>
                <option value="Flood">Flood</option>
                <option value="Protest">Protest / Blockade</option>
                <option value="Traffic Jam">Traffic Jam</option>
                <option value="Road Work">Road Work</option>
                <option value="VIP Movement">VIP Movement</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#8b949e] uppercase tracking-wider ml-1">Severity</label>
            <input type="hidden" name="severity" value={severity} />
            <div className="grid grid-cols-3 gap-3">
              <button type="button" onClick={() => setSeverity("Low")}
                className={`py-3 rounded-lg text-sm font-bold border transition-colors ${severity === 'Low' ? 'bg-[#00e5a0]/10 border-[#00e5a0] text-[#00e5a0]' : 'bg-[#0d1117] border-[#30363d] text-[#8b949e]'}`}>
                Low
              </button>
              <button type="button" onClick={() => setSeverity("Medium")}
                className={`py-3 rounded-lg text-sm font-bold border transition-colors ${severity === 'Medium' ? 'bg-[#fbbf24]/10 border-[#fbbf24] text-[#fbbf24]' : 'bg-[#0d1117] border-[#30363d] text-[#8b949e]'}`}>
                Medium
              </button>
              <button type="button" onClick={() => setSeverity("High")}
                className={`py-3 rounded-lg text-sm font-bold border transition-colors ${severity === 'High' ? 'bg-[#ff6b8a]/10 border-[#ff6b8a] text-[#ff6b8a]' : 'bg-[#0d1117] border-[#30363d] text-[#8b949e]'}`}>
                High
              </button>
            </div>
          </div>
          
          <div className="space-y-1">
             <label className="text-xs font-semibold text-[#8b949e] uppercase tracking-wider ml-1">Description (Optional)</label>
             <textarea name="description" rows={3} placeholder="Provide more details..." className="w-full bg-[#0d1117] border border-[#30363d]/60 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-[#ff6b8a] resize-none" />
          </div>

          <button type="submit" disabled={isPending}
            className="w-full bg-gradient-to-r from-[#ff6b8a] to-[#d6405f] text-white font-bold py-3 rounded-lg hover:shadow-[0_0_20px_rgba(255,107,138,0.4)] transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-50">
            {isPending ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><Flag className="w-5 h-5" /> Submit Report</>}
          </button>
        </form>
      </div>

      <div className="glass-card p-0 overflow-hidden">
        <div className="p-4 border-b border-[#30363d] bg-[#161b22]/50">
          <h2 className="text-lg font-bold text-white">My Recent Reports</h2>
        </div>
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-[#0d1117] text-[#8b949e] border-b border-[#30363d]">
              <th className="p-4 text-xs uppercase tracking-wider font-semibold">Type</th>
              <th className="p-4 text-xs uppercase tracking-wider font-semibold">Location</th>
              <th className="p-4 text-xs uppercase tracking-wider font-semibold">Status</th>
              <th className="p-4 text-xs uppercase tracking-wider font-semibold">Time</th>
            </tr>
          </thead>
          <tbody>
            {recentReports.length === 0 ? (
              <tr><td colSpan={4} className="p-6 text-center text-[#8b949e] italic">You haven't reported any incidents recently.</td></tr>
            ) : (
              recentReports.map((r: any) => (
                <tr key={r._id} className="border-b border-[#30363d]/50 hover:bg-[#161b22] transition-colors">
                  <td className="p-4 font-bold text-white">
                    <div className="flex items-center gap-2">
                      {r.type}
                      <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${
                        r.severity === 'High' ? 'bg-[#ff6b8a] text-black' : 
                        r.severity === 'Medium' ? 'bg-[#fbbf24] text-black' : 
                        'bg-[#00e5a0] text-black'
                      }`}>
                        {r.severity}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-[#8b949e] text-xs">{r.location_name}</td>
                  <td className="p-4">
                    <span className={`text-xs px-2 py-1 rounded font-bold ${
                      r.status === 'Active' ? 'bg-[#ff6b8a]/10 text-[#ff6b8a]' : 
                      r.status === 'Resolved' ? 'bg-[#00e5a0]/10 text-[#00e5a0]' : 
                      'bg-[#38bdf8]/10 text-[#38bdf8]'
                    }`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="p-4 text-[#8b949e] text-xs">{new Date(r.reported_at).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
