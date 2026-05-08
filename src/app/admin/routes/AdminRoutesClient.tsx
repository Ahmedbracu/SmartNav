"use client";

import React, { useState } from "react";
import { addRoute, addSegment, deleteRoute, deleteSegment } from "@/app/actions/admin";
import { PlusCircle, GitBranch, ChevronRight, Trash2, XCircle, Route as RouteIcon, Bus } from "lucide-react";

export default function AdminRoutesClient({ locations, transports, routes }: any) {
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

  const toggleRow = (id: string) => {
    setExpandedRows(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="animate-in fade-in duration-500 max-w-6xl mx-auto pb-20">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 font-['Syne']">Manage Routes</h1>
        <p className="text-[#8b949e]">Add new city routes and configure their multi-modal segments.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 items-start">
        {/* ADD ROUTE FORM */}
        <div className="glass-card">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-[#00e5a0]" /> Add New Route
          </h2>
          <form action={addRoute} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-[#8b949e] uppercase mb-1 block">Source</label>
                <select name="source_location_id" required className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg p-2 text-white">
                  {locations.map((l:any) => <option key={l._id} value={l._id}>{l.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-[#8b949e] uppercase mb-1 block">Destination</label>
                <select name="destination_location_id" required className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg p-2 text-white">
                  {locations.map((l:any) => <option key={l._id} value={l._id}>{l.name}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-xs text-[#8b949e] uppercase mb-1 block">Distance (km)</label>
                <input type="number" step="0.1" name="total_distance" required className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg p-2 text-white" />
              </div>
              <div>
                <label className="text-xs text-[#8b949e] uppercase mb-1 block">Time (min)</label>
                <input type="number" name="estimated_time" required className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg p-2 text-white" />
              </div>
              <div>
                <label className="text-xs text-[#8b949e] uppercase mb-1 block">Cost (BDT)</label>
                <input type="number" step="0.1" name="estimated_cost" required className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg p-2 text-white" />
              </div>
            </div>
            <button type="submit" className="w-full bg-[#00e5a0] text-black font-bold py-2 rounded-lg hover:bg-[#00c489] transition-colors">Add Route</button>
          </form>
        </div>

        {/* ADD SEGMENT FORM */}
        <div className="glass-card">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <GitBranch className="w-5 h-5 text-[#38bdf8]" /> Add Segment
          </h2>
          <form action={addSegment} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-[#8b949e] uppercase mb-1 block">Route ID</label>
                <select name="route_id" required className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg p-2 text-white text-xs">
                  {routes.map((r:any) => <option key={r._id} value={r._id}>{r.source_name} → {r.dest_name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-[#8b949e] uppercase mb-1 block">Transport</label>
                <select name="transport_id" required className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg p-2 text-white">
                  {transports.map((t:any) => <option key={t._id} value={t._id}>{t.type}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-[#8b949e] uppercase mb-1 block">Start Loc</label>
                <select name="start_location_id" required className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg p-2 text-white">
                  {locations.map((l:any) => <option key={l._id} value={l._id}>{l.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-[#8b949e] uppercase mb-1 block">End Loc</label>
                <select name="end_location_id" required className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg p-2 text-white">
                  {locations.map((l:any) => <option key={l._id} value={l._id}>{l.name}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-xs text-[#8b949e] uppercase mb-1 block">Dist (km)</label>
                <input type="number" step="0.1" name="segment_distance" required className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg p-2 text-white" />
              </div>
              <div>
                <label className="text-xs text-[#8b949e] uppercase mb-1 block">Time (min)</label>
                <input type="number" name="segment_time" required className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg p-2 text-white" />
              </div>
              <div>
                <label className="text-xs text-[#8b949e] uppercase mb-1 block">Cost (BDT)</label>
                <input type="number" step="0.1" name="segment_cost" required className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg p-2 text-white" />
              </div>
            </div>
            <button type="submit" className="w-full bg-[#161b22] text-[#38bdf8] border border-[#38bdf8]/30 font-bold py-2 rounded-lg hover:bg-[#38bdf8]/10 transition-colors">Add Segment</button>
          </form>
        </div>
      </div>

      {/* ROUTES TABLE WITH EXPANDABLE SEGMENTS */}
      <div className="glass-card p-0 overflow-hidden">
        <div className="p-4 border-b border-[#30363d] bg-[#161b22]/50">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <RouteIcon className="w-5 h-5 text-[#00e5a0]" /> All Routes & Segments
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-[#0d1117] text-[#8b949e] border-b border-[#30363d]">
                <th className="p-4 w-10"></th>
                <th className="p-4 font-semibold uppercase tracking-wider text-xs">Route</th>
                <th className="p-4 font-semibold uppercase tracking-wider text-xs">Distance</th>
                <th className="p-4 font-semibold uppercase tracking-wider text-xs">Time</th>
                <th className="p-4 font-semibold uppercase tracking-wider text-xs">Cost</th>
                <th className="p-4 font-semibold uppercase tracking-wider text-xs">Segments</th>
                <th className="p-4 w-20"></th>
              </tr>
            </thead>
            <tbody>
              {routes.length === 0 ? (
                <tr><td colSpan={7} className="p-8 text-center text-[#8b949e] italic">No routes found.</td></tr>
              ) : (
                routes.map((r: any) => (
                  <React.Fragment key={r._id}>
                    <tr onClick={() => toggleRow(r._id)} className="border-b border-[#30363d]/50 hover:bg-[#161b22] cursor-pointer transition-colors group">
                      <td className="p-4">
                        <ChevronRight className={`w-4 h-4 text-[#8b949e] transition-transform ${expandedRows[r._id] ? 'rotate-90' : ''}`} />
                      </td>
                      <td className="p-4 font-bold text-white">{r.source_name} → {r.dest_name}</td>
                      <td className="p-4 text-[#8b949e]">{r.total_distance} km</td>
                      <td className="p-4 text-[#8b949e]">{r.estimated_time} min</td>
                      <td className="p-4"><span className="bg-[#00e5a0]/10 text-[#00e5a0] px-2 py-1 rounded font-bold">৳{r.estimated_cost}</span></td>
                      <td className="p-4"><span className="bg-[#38bdf8]/10 text-[#38bdf8] px-2 py-1 rounded font-bold">{r.segments.length}</span></td>
                      <td className="p-4 text-right">
                        <button onClick={(e) => { e.stopPropagation(); deleteRoute(r._id); }} className="text-[#ff6b8a]/50 hover:text-[#ff6b8a] transition-colors p-2">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                    
                    {/* EXPANDED ROWS */}
                    {expandedRows[r._id] && (
                      <tr className="bg-[#0d1117]">
                        <td colSpan={7} className="p-0 border-b border-[#30363d]">
                          <div className="p-6 bg-gradient-to-r from-[#00e5a0]/5 to-transparent">
                            <h4 className="text-xs font-bold text-[#8b949e] uppercase tracking-wider mb-4 flex items-center gap-2">
                              <Bus className="w-4 h-4" /> Transport Options
                            </h4>
                            {r.segments.length === 0 ? (
                              <div className="text-sm text-[#8b949e] italic mb-2">No segments added yet.</div>
                            ) : (
                              <div className="space-y-2">
                                {r.segments.map((seg: any) => (
                                  <div key={seg._id} className="flex items-center justify-between p-3 bg-[#161b22] rounded-lg border border-[#30363d]/50">
                                    <div className="flex items-center gap-4">
                                      <span className="font-bold text-[#38bdf8] bg-[#38bdf8]/10 px-2 py-1 rounded text-xs">{seg.transport_type}</span>
                                      <span className="text-sm text-white">{seg.start_name} → {seg.end_name}</span>
                                    </div>
                                    <div className="flex items-center gap-6">
                                      <span className="text-xs text-[#8b949e]">{seg.distance}km</span>
                                      <span className="text-xs text-[#8b949e]">{seg.time}min</span>
                                      <span className="font-bold text-[#00e5a0] text-sm">৳{seg.cost}</span>
                                      <button onClick={() => deleteSegment(r._id, seg._id)} className="text-[#ff6b8a]/50 hover:text-[#ff6b8a] transition-colors">
                                        <XCircle className="w-4 h-4" />
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
