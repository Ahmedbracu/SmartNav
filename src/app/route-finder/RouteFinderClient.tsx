"use client";

import { useState } from "react";
import { findRoutes } from "@/app/actions/routeAction";
import { Search, MapPin, DollarSign, ArrowRight, AlertCircle, Clock, CheckCircle2 } from "lucide-react";

export default function RouteFinderClient({ locations }: { locations: any[] }) {
  const [routes, setRoutes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  async function handleSearch(formData: FormData) {
    setLoading(true);
    setError("");
    setSearched(true);
    
    const source = formData.get("source") as string;
    const dest = formData.get("destination") as string;
    const budget = Number(formData.get("budget")) || 99999;

    const result = await findRoutes(source, dest, budget);
    
    if (result.error) {
      setError(result.error);
      setRoutes([]);
    } else {
      setRoutes(result.routes || []);
    }
    setLoading(false);
  }

  return (
    <>
      <form action={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-[#5F6368] uppercase tracking-wider ml-1">From</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1A73E8]" />
            <select name="source" required className="w-full bg-white/60 border border-[#DADCE0] rounded-lg py-3 pl-10 pr-4 text-[#202124] appearance-none focus:outline-none focus:border-[#1A73E8]">
              <option value="">Select Origin...</option>
              {locations.map(l => (
                <option key={l._id} value={l._id}>{l.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-[#5F6368] uppercase tracking-wider ml-1">To</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D93025]" />
            <select name="destination" required className="w-full bg-white/60 border border-[#DADCE0] rounded-lg py-3 pl-10 pr-4 text-[#202124] appearance-none focus:outline-none focus:border-[#D93025]">
              <option value="">Select Destination...</option>
              {locations.map(l => (
                <option key={l._id} value={l._id}>{l.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-[#5F6368] uppercase tracking-wider ml-1">Max Budget (BDT)</label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#F4B400]" />
            <input type="number" name="budget" placeholder="Any" className="w-full bg-white/60 border border-[#DADCE0] rounded-lg py-3 pl-10 pr-4 text-[#202124] placeholder-[#8b949e]/50 focus:outline-none focus:border-[#F4B400]" />
          </div>
        </div>

        <button type="submit" disabled={loading} className="bg-[#1A73E8] text-[#202124] font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-[#00c489] transition-colors disabled:opacity-50 h-[50px]">
          {loading ? <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" /> : <><Search className="w-5 h-5" /> Search</>}
        </button>
      </form>

      {error && (
        <div className="mt-6 p-4 bg-[#D93025]/10 border border-[#D93025]/20 text-[#D93025] rounded-lg flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {searched && !loading && !error && (
        <div className="mt-10 space-y-6 animate-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center gap-2 mb-4 border-b border-[#DADCE0] pb-2">
            <h2 className="text-xl font-bold text-[#202124] font-['Syne']">Search Results</h2>
            <span className="bg-[#30363d] text-[#5F6368] text-xs px-2 py-1 rounded-full">{routes.length} found</span>
          </div>

          {routes.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-[#DADCE0] rounded-xl text-[#5F6368]">
              <MapPin className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p>No routes found matching your criteria.</p>
            </div>
          ) : (
            routes.map(r => (
              <div key={r._id} className="bg-[#F8F9FA] border border-[#DADCE0] rounded-xl overflow-hidden hover:border-[#1A73E8]/50 transition-colors">
                <div className="p-5 flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 text-lg font-bold text-[#202124] mb-2">
                      <span>{r.source_name}</span>
                      <ArrowRight className="w-5 h-5 text-[#5F6368]" />
                      <span>{r.dest_name}</span>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-[#5F6368]">
                      <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-[#188038]"/> {r.total_distance} km</span>
                      <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-[#F4B400]"/> {r.adjusted_time} min</span>
                      <span className="flex items-center gap-1.5 font-bold text-[#202124] bg-[#30363d] px-2 py-1 rounded">
                        ৳{r.min_seg_cost} {r.max_seg_cost > r.min_seg_cost ? `- ${r.max_seg_cost}` : ''}
                      </span>
                    </div>
                  </div>

                  {r.is_over_budget && (
                    <div className="bg-[#D93025]/20 text-[#D93025] text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-2 uppercase tracking-wider">
                      <AlertCircle className="w-4 h-4" /> Over Budget
                    </div>
                  )}
                </div>

                <div className="bg-white/60 p-4 border-t border-[#DADCE0]">
                  <h4 className="text-xs font-semibold text-[#5F6368] uppercase tracking-wider mb-3">Transport Options</h4>
                  <div className="space-y-2">
                    {r.segments.map((seg: any) => (
                      <div key={seg._id} className="flex items-center justify-between bg-[#F8F9FA] p-3 rounded-lg border border-[#DADCE0]/60">
                        <div className="flex items-center gap-3">
                          <span className="text-[#1A73E8] font-bold text-sm bg-[#1A73E8]/10 px-2 py-1 rounded">{seg.transport_type}</span>
                          <span className="text-sm text-[#202124]">৳{seg.cost}</span>
                        </div>
                        <button className="text-xs font-semibold flex items-center gap-1 text-[#188038] hover:text-[#202124] transition-colors">
                          <CheckCircle2 className="w-4 h-4" /> Select
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </>
  );
}
