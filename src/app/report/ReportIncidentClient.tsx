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
        <h1 className="text-3xl font-bold text-[#202124] mb-2 font-['Syne'] flex items-center gap-3">
          <Flag className="w-8 h-8 text-[#D93025]" />
          Report a Road Incident
        </h1>
        <p className="text-[#5F6368]">Your report goes live on the Chaos Map immediately and helps other users avoid dangerous areas.</p>
      </div>

      <div className="glass-card mb-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-[#D93025]" />
        
        {msg && (
          <div className={`p-4 rounded-lg text-sm mb-6 flex items-center gap-2 ${isError ? "bg-[#D93025]/10 text-[#D93025] border border-[#D93025]/20" : "bg-[#1A73E8]/10 text-[#1A73E8] border border-[#1A73E8]/20"}`}>
            {isError ? <AlertCircle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
            {msg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#5F6368] uppercase tracking-wider ml-1">Location</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#5F6368]" />
              <select name="location_id" required className="w-full bg-white/60 border border-[#DADCE0]/60 rounded-lg py-3 pl-10 pr-4 text-[#202124] appearance-none focus:outline-none focus:border-[#D93025]">
                <option value="">— Select location —</option>
                {locations.map((l: any) => (
                  <option key={l._id} value={l._id}>{l.name} ({l.area_zone})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#5F6368] uppercase tracking-wider ml-1">Incident Type</label>
            <div className="relative">
              <Activity className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#5F6368]" />
              <select name="incident_type" required className="w-full bg-white/60 border border-[#DADCE0]/60 rounded-lg py-3 pl-10 pr-4 text-[#202124] appearance-none focus:outline-none focus:border-[#D93025]">
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
            <label className="text-xs font-semibold text-[#5F6368] uppercase tracking-wider ml-1">Severity</label>
            <input type="hidden" name="severity" value={severity} />
            <div className="grid grid-cols-3 gap-3">
              <button type="button" onClick={() => setSeverity("Low")}
                className={`py-3 rounded-lg text-sm font-bold border transition-colors ${severity === 'Low' ? 'bg-[#1A73E8]/10 border-[#1A73E8] text-[#1A73E8]' : 'bg-white/60 border-[#DADCE0] text-[#5F6368]'}`}>
                Low
              </button>
              <button type="button" onClick={() => setSeverity("Medium")}
                className={`py-3 rounded-lg text-sm font-bold border transition-colors ${severity === 'Medium' ? 'bg-[#F4B400]/10 border-[#F4B400] text-[#F4B400]' : 'bg-white/60 border-[#DADCE0] text-[#5F6368]'}`}>
                Medium
              </button>
              <button type="button" onClick={() => setSeverity("High")}
                className={`py-3 rounded-lg text-sm font-bold border transition-colors ${severity === 'High' ? 'bg-[#D93025]/10 border-[#D93025] text-[#D93025]' : 'bg-white/60 border-[#DADCE0] text-[#5F6368]'}`}>
                High
              </button>
            </div>
          </div>
          
          <div className="space-y-1">
             <label className="text-xs font-semibold text-[#5F6368] uppercase tracking-wider ml-1">Description (Optional)</label>
             <textarea name="description" rows={3} placeholder="Provide more details..." className="w-full bg-white/60 border border-[#DADCE0]/60 rounded-lg py-3 px-4 text-[#202124] focus:outline-none focus:border-[#D93025] resize-none" />
          </div>

          <button type="submit" disabled={isPending}
            className="w-full bg-gradient-to-r from-[#D93025] to-[#C5221F] text-white font-bold py-3 rounded-lg hover:shadow-[0_4px_12px_rgba(217,48,37,0.3)] transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-50">
            {isPending ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><Flag className="w-5 h-5" /> Submit Report</>}
          </button>
        </form>
      </div>

      <div className="glass-card p-0 overflow-hidden">
        <div className="p-4 border-b border-[#DADCE0] bg-[#F8F9FA]/80">
          <h2 className="text-lg font-bold text-[#202124]">My Recent Reports</h2>
        </div>
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-white/60 text-[#5F6368] border-b border-[#DADCE0]">
              <th className="p-4 text-xs uppercase tracking-wider font-semibold">Type</th>
              <th className="p-4 text-xs uppercase tracking-wider font-semibold">Location</th>
              <th className="p-4 text-xs uppercase tracking-wider font-semibold">Status</th>
              <th className="p-4 text-xs uppercase tracking-wider font-semibold">Time</th>
            </tr>
          </thead>
          <tbody>
            {recentReports.length === 0 ? (
              <tr><td colSpan={4} className="p-6 text-center text-[#5F6368] italic">You haven't reported any incidents recently.</td></tr>
            ) : (
              recentReports.map((r: any) => (
                <tr key={r._id} className="border-b border-[#DADCE0]/60 hover:bg-[#F8F9FA] transition-colors">
                  <td className="p-4 font-bold text-[#202124]">
                    <div className="flex items-center gap-2">
                      {r.type}
                      <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${
                        r.severity === 'High' ? 'bg-[#D93025] text-white' : 
                        r.severity === 'Medium' ? 'bg-[#F4B400] text-white' : 
                        'bg-[#1A73E8] text-white'
                      }`}>
                        {r.severity}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-[#5F6368] text-xs">{r.location_name}</td>
                  <td className="p-4">
                    <span className={`text-xs px-2 py-1 rounded font-bold ${
                      r.status === 'Active' ? 'bg-[#D93025]/10 text-[#D93025]' : 
                      r.status === 'Resolved' ? 'bg-[#1A73E8]/10 text-[#1A73E8]' : 
                      'bg-[#188038]/10 text-[#188038]'
                    }`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="p-4 text-[#5F6368] text-xs">{new Date(r.reported_at).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
