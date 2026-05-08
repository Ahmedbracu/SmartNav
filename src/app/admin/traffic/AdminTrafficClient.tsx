"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Activity, PlusCircle, Trash2 } from "lucide-react";
import { addTrafficRecord, deleteTrafficRecord } from "@/app/actions/admin";

interface Props {
  locations: { _id: string; name: string }[];
  records: {
    _id: string;
    location_name: string;
    congestion_level: string;
    avg_speed: number;
    date: string;
    time_slot: string;
  }[];
}

const congestionColors: Record<string, string> = {
  Gridlock: "#D93025",
  Heavy: "#E65100",
  Moderate: "#F4B400",
  Light: "#188038",
};

export default function AdminTrafficClient({ locations, records }: Props) {
  return (
    <div className="page-transition max-w-6xl mx-auto pb-20">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#202124] mb-2 font-['Syne'] flex items-center gap-3">
          <Activity className="w-8 h-8 text-[#E65100]" />
          Traffic Data
        </h1>
        <p className="text-[#5F6368]">View and manage traffic congestion records across Dhaka.</p>
      </div>

      {/* Add Traffic Record */}
      <div className="glass-card mb-8">
        <h2 className="text-lg font-bold text-[#202124] mb-4 flex items-center gap-2">
          <PlusCircle className="w-5 h-5 text-[#E65100]" /> Add Traffic Record
        </h2>
        <form action={async (formData) => { await addTrafficRecord(formData); }} className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="text-xs text-[#5F6368] uppercase mb-1 block">Location</label>
              <select name="location_id" required className="w-full bg-white/60 border border-[#DADCE0] rounded-lg p-2 text-[#202124]">
                {locations.map((l) => <option key={l._id} value={l._id}>{l.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-[#5F6368] uppercase mb-1 block">Congestion Level</label>
              <select name="congestion_level" required className="w-full bg-white/60 border border-[#DADCE0] rounded-lg p-2 text-[#202124]">
                <option value="Light">Light</option>
                <option value="Moderate">Moderate</option>
                <option value="Heavy">Heavy</option>
                <option value="Gridlock">Gridlock</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-[#5F6368] uppercase mb-1 block">Avg Speed (km/h)</label>
              <input type="number" step="0.1" name="avg_speed" required className="w-full bg-white/60 border border-[#DADCE0] rounded-lg p-2 text-[#202124]" />
            </div>
            <div>
              <label className="text-xs text-[#5F6368] uppercase mb-1 block">Time Slot</label>
              <input type="text" name="time_slot" placeholder="08:00-09:00" required className="w-full bg-white/60 border border-[#DADCE0] rounded-lg p-2 text-[#202124]" />
            </div>
          </div>
          <button type="submit" className="bg-[#E65100] text-white font-bold py-2 px-6 rounded-lg hover:bg-[#BF360C] transition-colors">
            Add Record
          </button>
        </form>
      </div>

      {/* Traffic Records Table */}
      <div className="glass-card p-0 overflow-hidden">
        <div className="p-4 border-b border-[#DADCE0] bg-[#F8F9FA]/80">
          <h2 className="text-lg font-bold text-[#202124] flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#E65100]" /> Recent Traffic Records ({records.length})
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-white/60 text-[#5F6368] border-b border-[#DADCE0]">
                <th className="p-4 font-semibold uppercase tracking-wider text-xs">Location</th>
                <th className="p-4 font-semibold uppercase tracking-wider text-xs">Congestion</th>
                <th className="p-4 font-semibold uppercase tracking-wider text-xs">Avg Speed</th>
                <th className="p-4 font-semibold uppercase tracking-wider text-xs">Time Slot</th>
                <th className="p-4 font-semibold uppercase tracking-wider text-xs">Date</th>
                <th className="p-4 w-16"></th>
              </tr>
            </thead>
            <tbody>
              {records.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-[#5F6368] italic">No traffic records found.</td></tr>
              ) : (
                records.map((rec) => (
                  <tr key={rec._id} className="border-b border-[#DADCE0]/60 hover:bg-[#F8F9FA] transition-colors">
                    <td className="p-4 font-bold text-[#202124]">{rec.location_name}</td>
                    <td className="p-4">
                      <span
                        className="px-2 py-1 rounded font-bold text-xs text-white"
                        style={{ backgroundColor: congestionColors[rec.congestion_level] || "#5F6368" }}
                      >
                        {rec.congestion_level}
                      </span>
                    </td>
                    <td className="p-4 text-[#5F6368]">{rec.avg_speed} km/h</td>
                    <td className="p-4 text-[#5F6368]">{rec.time_slot}</td>
                    <td className="p-4 text-[#5F6368]">{rec.date}</td>
                    <td className="p-4">
                      <button onClick={() => deleteTrafficRecord(rec._id)} className="text-[#D93025]/50 hover:text-[#D93025] transition-colors p-2">
                        <Trash2 className="w-4 h-4" />
                      </button>
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
