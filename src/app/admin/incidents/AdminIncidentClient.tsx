"use client";

import { useState } from "react";
import { Activity, Trash2, CheckCircle, AlertTriangle } from "lucide-react";
import { updateIncidentStatus, deleteIncident } from "@/app/actions/adminIncident";

export default function AdminIncidentClient({ incidents }: any) {
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleStatusUpdate = async (id: string, status: string) => {
    setUpdatingId(id);
    await updateIncidentStatus(id, status);
    setUpdatingId(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this incident report?")) return;
    setUpdatingId(id);
    await deleteIncident(id);
    setUpdatingId(null);
  };

  return (
    <div className="animate-in fade-in duration-500 max-w-6xl mx-auto pb-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 font-['Syne'] flex items-center gap-3">
          <Activity className="w-8 h-8 text-[#ff6b8a]" />
          Moderate Incidents
        </h1>
        <p className="text-[#8b949e]">Review user-reported incidents, update their status, or remove false reports.</p>
      </div>

      <div className="glass-card p-0 overflow-hidden">
        <div className="p-4 border-b border-[#30363d] bg-[#161b22]/50 flex justify-between items-center">
          <h2 className="text-lg font-bold text-white">All Reports</h2>
          <span className="text-xs text-[#8b949e]">{incidents.length} total</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-[#0d1117] text-[#8b949e] border-b border-[#30363d]">
                <th className="p-4 text-xs uppercase tracking-wider font-semibold">Incident Details</th>
                <th className="p-4 text-xs uppercase tracking-wider font-semibold">Location</th>
                <th className="p-4 text-xs uppercase tracking-wider font-semibold">Reporter</th>
                <th className="p-4 text-xs uppercase tracking-wider font-semibold">Time</th>
                <th className="p-4 text-xs uppercase tracking-wider font-semibold">Status / Actions</th>
              </tr>
            </thead>
            <tbody>
              {incidents.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-[#8b949e] italic">No incidents reported.</td></tr>
              ) : (
                incidents.map((i: any) => (
                  <tr key={i._id} className={`border-b border-[#30363d]/50 hover:bg-[#161b22] transition-colors ${updatingId === i._id ? 'opacity-50' : ''}`}>
                    <td className="p-4">
                      <div className="font-bold text-white mb-1 flex items-center gap-2">
                        {i.type}
                        <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${
                          i.severity === 'High' ? 'bg-[#ff6b8a] text-black' : 
                          i.severity === 'Medium' ? 'bg-[#fbbf24] text-black' : 
                          'bg-[#00e5a0] text-black'
                        }`}>
                          {i.severity}
                        </span>
                      </div>
                      {i.description && <div className="text-xs text-[#8b949e] max-w-xs">{i.description}</div>}
                    </td>
                    <td className="p-4 text-white font-medium">{i.location_name}</td>
                    <td className="p-4">
                      <div className="text-xs text-white">{i.reporter_name}</div>
                      <div className="text-[10px] text-[#8b949e]">{i.reporter_email}</div>
                    </td>
                    <td className="p-4 text-[#8b949e] text-xs">{new Date(i.reported_at).toLocaleString()}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <select 
                          value={i.status} 
                          onChange={(e) => handleStatusUpdate(i._id, e.target.value)}
                          disabled={updatingId === i._id}
                          className={`text-xs px-2 py-1 rounded font-bold appearance-none cursor-pointer focus:outline-none ${
                            i.status === 'Active' ? 'bg-[#ff6b8a]/10 text-[#ff6b8a] border border-[#ff6b8a]/20' : 
                            i.status === 'Resolved' ? 'bg-[#00e5a0]/10 text-[#00e5a0] border border-[#00e5a0]/20' : 
                            'bg-[#38bdf8]/10 text-[#38bdf8] border border-[#38bdf8]/20'
                          }`}
                        >
                          <option value="Active">Active</option>
                          <option value="Investigating">Investigating</option>
                          <option value="Resolved">Resolved</option>
                        </select>
                        <button 
                          onClick={() => handleDelete(i._id)} 
                          disabled={updatingId === i._id}
                          className="text-[#ff6b8a]/50 hover:text-[#ff6b8a] p-1 transition-colors"
                          title="Delete Report"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
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
