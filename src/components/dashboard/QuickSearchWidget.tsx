"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Search } from "lucide-react";

export default function QuickSearchWidget({ locations }: { locations: any[] }) {
  const router = useRouter();
  const [source, setSource] = useState("");
  const [dest, setDest] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (source && dest) {
      // In a real app, you might pass these via query params or context
      // For now, we redirect to route-finder
      router.push("/route-finder");
    }
  };

  return (
    <form onSubmit={handleSearch} className="glass-card mb-8 relative overflow-hidden group">
      {/* Animated background blob */}
      <div className="absolute -right-20 -top-20 w-64 h-64 bg-gradient-to-br from-[#1A73E8]/20 to-[#00e5a0]/10 rounded-full blur-[60px] group-hover:scale-110 transition-transform duration-700 pointer-events-none"></div>
      
      <h2 className="text-xl font-bold text-[#202124] font-['Syne'] mb-4 relative z-10">Where to?</h2>
      
      <div className="flex flex-col md:flex-row gap-4 relative z-10">
        <div className="flex-1 relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#188038] pointer-events-none" />
          <select 
            required 
            value={source} 
            onChange={e => setSource(e.target.value)}
            className="w-full bg-white/80 border border-[#DADCE0] rounded-xl py-3 pl-10 pr-8 text-[#202124] focus:outline-none focus:border-[#1A73E8] focus:ring-2 focus:ring-[#1A73E8]/20 transition-all font-medium appearance-none"
          >
            <option value="">Current Location</option>
            {locations.map(l => <option key={l._id} value={l._id}>{l.name}</option>)}
          </select>
        </div>

        <div className="flex-1 relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#D93025] pointer-events-none" />
          <select 
            required 
            value={dest} 
            onChange={e => setDest(e.target.value)}
            className="w-full bg-white/80 border border-[#DADCE0] rounded-xl py-3 pl-10 pr-8 text-[#202124] focus:outline-none focus:border-[#D93025] focus:ring-2 focus:ring-[#D93025]/20 transition-all font-medium appearance-none"
          >
            <option value="">Destination</option>
            {locations.map(l => <option key={l._id} value={l._id}>{l.name}</option>)}
          </select>
        </div>

        <button type="submit" className="bg-[#202124] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#3C4043] transition-colors flex items-center justify-center gap-2 shadow-lg hover:shadow-xl">
          <Search className="w-5 h-5" /> Go
        </button>
      </div>
    </form>
  );
}
