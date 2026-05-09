"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { findRoutes } from "@/app/actions/routeAction";
import { createTrip } from "@/app/actions/tripAction";
import { Search, MapPin, DollarSign, ArrowRight, AlertCircle, Clock, CheckCircle2, Navigation } from "lucide-react";

const DhakaMap = dynamic(() => import("@/components/map/DhakaMap"), { ssr: false });

export default function RouteFinderClient({ locations }: { locations: any[] }) {
  const [routes, setRoutes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [aiInsight, setAiInsight] = useState("");
  const [searched, setSearched] = useState(false);
  const [routeGeometry, setRouteGeometry] = useState<any>(null);
  const [selectedSource, setSelectedSource] = useState("");
  const [selectedDest, setSelectedDest] = useState("");
  const [bookingConfirmed, setBookingConfirmed] = useState<string | null>(null);
  const [bookingLoading, setBookingLoading] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [bookedRoute, setBookedRoute] = useState<any>(null);

  const searchParams = useSearchParams();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const s = searchParams.get("source");
    const d = searchParams.get("destination");
    if (s && d && !searched) {
      const formData = new FormData();
      formData.append("source", s);
      formData.append("destination", d);
      formData.append("budget", "");
      handleSearch(formData);
    }
  }, [searchParams, searched]);

  async function handleSearch(formData: FormData) {
    setLoading(true);
    setError("");
    setSearched(true);
    setRouteGeometry(null);
    
    const source = formData.get("source") as string;
    const dest = formData.get("destination") as string;
    const budget = Number(formData.get("budget")) || 99999;

    setSelectedSource(source);
    setSelectedDest(dest);

    const result = await findRoutes(source, dest, budget);
    
    if (result.error) {
      setError(result.error);
      setRoutes([]);
      setAiInsight("");
    } else {
      setRoutes(result.routes || []);
      setAiInsight(result.ai_insight || "");
      
      // Fetch real road geometry from OSRM
      const srcLoc = locations.find(l => l._id === source);
      const dstLoc = locations.find(l => l._id === dest);
      
      if (srcLoc && dstLoc) {
        try {
          const res = await fetch(
            `/api/route-directions?srcLat=${srcLoc.latitude}&srcLng=${srcLoc.longitude}&dstLat=${dstLoc.latitude}&dstLng=${dstLoc.longitude}`
          );
          const geo = await res.json();
          if (geo.coordinates) {
            setRouteGeometry({
              coordinates: geo.coordinates,
              source: srcLoc,
              destination: dstLoc,
              distance: geo.distance,
              duration: geo.duration,
            });
          }
        } catch {
          // Silently fail - map will still show without route line
        }
      }
    }
    setLoading(false);
  }

  const handleSelectRoute = async (r: any) => {
    setBookingLoading(r._id);
    setError("");
    const result = await createTrip(selectedSource, selectedDest, r.min_seg_cost, r.adjusted_time);
    setBookingLoading(null);
    if (result.error) {
      setError(result.error);
    } else {
      setBookingConfirmed(r._id);
      setBookedRoute(r);
      setShowModal(true);
      setTimeout(() => setBookingConfirmed(null), 3000);
    }
  };

  return (
    <>
      {/* Search Form */}
      <form ref={formRef} action={handleSearch} className="glass-card mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#5F6368] uppercase tracking-wider ml-1">From</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#188038] pointer-events-none" />
              <select name="source" required defaultValue={searchParams.get("source") || ""} className="w-full bg-white/80 border border-[#DADCE0] rounded-lg py-3 pl-11 pr-8 text-[#202124] appearance-none focus:outline-none focus:border-[#1A73E8]">
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
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D93025] pointer-events-none" />
              <select name="destination" required defaultValue={searchParams.get("destination") || ""} className="w-full bg-white/80 border border-[#DADCE0] rounded-lg py-3 pl-11 pr-8 text-[#202124] appearance-none focus:outline-none focus:border-[#D93025]">
                <option value="">Select Destination...</option>
                {locations.map(l => (
                  <option key={l._id} value={l._id}>{l.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#5F6368] uppercase tracking-wider ml-1">Max Budget (৳)</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#F4B400] pointer-events-none" />
              <input type="number" name="budget" placeholder="Any" className="w-full bg-white/80 border border-[#DADCE0] rounded-lg py-3 pl-11 pr-4 text-[#202124] focus:outline-none focus:border-[#F4B400]" />
            </div>
          </div>

          <button type="submit" disabled={loading} className="bg-[#1A73E8] text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-[#1557B0] transition-colors disabled:opacity-50 h-[50px]">
            {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><Search className="w-5 h-5" /> Search Routes</>}
          </button>
        </div>
      </form>

      {/* Map */}
      <DhakaMap
        locations={locations}
        routeGeometry={routeGeometry}
        height="450px"
        showLocations={true}
        showIncidents={false}
      />

      {/* Route info bar */}
      {routeGeometry && (
        <div className="glass-card mt-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Navigation className="w-5 h-5 text-[#1A73E8]" />
              <span className="font-bold text-[#202124]">{routeGeometry.distance} km</span>
              <span className="text-[#5F6368]">via roads</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#F4B400]" />
              <span className="font-bold text-[#202124]">{routeGeometry.duration} min</span>
              <span className="text-[#5F6368]">estimated</span>
            </div>
          </div>
          <div className="text-sm text-[#5F6368]">
            {routeGeometry.source.name} → {routeGeometry.destination.name}
          </div>
        </div>
      )}

      {error && (
        <div className="mt-6 p-4 bg-[#D93025]/10 border border-[#D93025]/20 text-[#D93025] rounded-lg flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {searched && !loading && !error && (
        <div className="mt-8 space-y-4 animate-in slide-in-from-bottom-4 duration-500">
          
          {aiInsight && (
            <div className="glass-card mb-6 bg-gradient-to-r from-[#1A73E8]/5 to-transparent border-l-4 border-l-[#1A73E8]">
              <p className="text-[#202124] font-medium text-sm leading-relaxed">{aiInsight}</p>
            </div>
          )}

          <div className="flex items-center gap-2 mb-4 border-b border-[#DADCE0] pb-2">
            <h2 className="text-xl font-bold text-[#202124] font-['Syne']">Transport Options</h2>
            <span className="bg-[#1A73E8]/10 text-[#1A73E8] text-xs px-2 py-1 rounded-full font-bold">{routes.length} found</span>
          </div>

          {routes.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-[#DADCE0] rounded-xl text-[#5F6368]">
              <MapPin className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p>No routes found matching your criteria.</p>
            </div>
          ) : (
            routes.map(r => (
              <div key={r._id} className={`glass-card hover:border-[#1A73E8]/40 transition-all ${r.is_fastest ? 'border-[#1A73E8]/30 shadow-[0_0_15px_rgba(26,115,232,0.1)]' : ''}`}>
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 text-lg font-bold text-[#202124] mb-1">
                      <span>{r.transport_type}</span>
                      {r.is_fastest && <span className="text-[10px] bg-[#1A73E8] text-white px-2 py-0.5 rounded-full uppercase tracking-wider">Fastest</span>}
                      {r.is_cheapest && <span className="text-[10px] bg-[#188038] text-white px-2 py-0.5 rounded-full uppercase tracking-wider">Cheapest</span>}
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-[#5F6368]">
                      <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-[#188038]"/> {r.total_distance} km</span>
                      <span className="flex items-center gap-1.5 font-bold"><Clock className="w-4 h-4 text-[#F4B400]"/> {r.adjusted_time} min</span>
                    </div>
                  </div>

                  <div className="text-right flex items-center gap-4">
                    {r.is_over_budget && (
                      <div className="bg-[#D93025]/10 text-[#D93025] text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1 uppercase">
                        <AlertCircle className="w-3 h-3" /> Over Budget
                      </div>
                    )}
                    <span className="font-bold text-2xl text-[#202124]">
                      ৳{r.min_seg_cost}
                    </span>
                    <button 
                      onClick={() => handleSelectRoute(r)}
                      disabled={bookingLoading === r._id}
                      className="bg-[#1A73E8] text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-[#1557B0] transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50"
                    >
                      {bookingLoading === r._id ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : bookingConfirmed === r._id ? (
                        <><CheckCircle2 className="w-4 h-4" /> Selected</>
                      ) : (
                        "Select"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Confirmation Modal */}
      {showModal && bookedRoute && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#202124]/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="p-6 border-b border-[#DADCE0]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-[#202124] font-['Syne'] flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6 text-[#188038]" /> Trip Confirmed!
                </h3>
                <button onClick={() => setShowModal(false)} className="text-[#5F6368] hover:text-[#202124] font-bold text-lg">
                  ✕
                </button>
              </div>
              <p className="text-[#5F6368] text-sm leading-relaxed">Your trip has been saved to your history. Continue booking with your preferred provider:</p>
            </div>
            
            <div className="p-6 bg-[#F8F9FA]">
              {bookedRoute.transport_type === "Car (Uber X)" && (
                <a href={`https://m.uber.com/ul/?action=setPickup&pickup=my_location`} target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center gap-2 bg-black text-white py-3 px-4 rounded-xl font-bold hover:bg-gray-800 transition-colors shadow-lg">
                  Open Uber
                </a>
              )}
              {bookedRoute.transport_type === "Bike" && (
                <a href="https://pathao.com/bd/" target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center gap-2 bg-[#E11A22] text-white py-3 px-4 rounded-xl font-bold hover:bg-[#C1161D] transition-colors shadow-lg">
                  Open Pathao
                </a>
              )}
              {bookedRoute.transport_type === "Metro Rail" && (
                <a href="https://dmtcl.gov.bd/" target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center gap-2 bg-[#188038] text-white py-3 px-4 rounded-xl font-bold hover:bg-[#13652C] transition-colors shadow-lg">
                  Open DMTCL Web App
                </a>
              )}
              {["CNG Auto", "Local Bus"].includes(bookedRoute.transport_type) && (
                <div className="text-center py-4">
                  <div className="w-16 h-16 bg-[#188038]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Navigation className="w-8 h-8 text-[#188038]" />
                  </div>
                  <p className="font-bold text-[#202124] text-lg mb-1">Ready to go!</p>
                  <p className="text-sm text-[#5F6368] mb-6">Head to the nearest stand or stop to catch your {bookedRoute.transport_type}.</p>
                  <button onClick={() => setShowModal(false)} className="w-full bg-[#1A73E8] text-white py-3 px-4 rounded-xl font-bold shadow-lg hover:bg-[#1557B0] transition-colors">Done</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
