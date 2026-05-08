import { AlertTriangle, Activity, MapPin, Search } from "lucide-react";
import connectToDatabase from "@/lib/db";
import Incident from "@/models/Incident";
import Traffic from "@/models/Traffic";

export default async function ChaosMapPage() {
  await connectToDatabase();
  
  const incidents = await Incident.find({ status: "Active" })
    .populate("location")
    .sort({ reported_at: -1 })
    .lean();
    
  const currentHour = new Date().getHours() + ":00-00:00";
  // In a real app we'd filter by current date as well
  const trafficData = await Traffic.find({ /* time_slot: currentHour */ })
    .populate("location")
    .lean();

  return (
    <div className="animate-in fade-in duration-500 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#202124] mb-2 font-['Syne'] flex items-center gap-3">
          <AlertTriangle className="w-8 h-8 text-[#D93025]" />
          Chaos Map
        </h1>
        <p className="text-[#5F6368]">Live view of Dhaka&apos;s current traffic bottlenecks and active incidents.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* MAP AREA (Simulated grid for now since real Google Maps costs money/setup) */}
        <div className="lg:col-span-2 glass-card min-h-[600px] relative p-0 overflow-hidden flex items-center justify-center bg-[#0a0d12]">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#30363d_1px,transparent_1px)] [background-size:20px_20px]" />
          <div className="z-10 text-center">
            <MapPin className="w-16 h-16 text-[#30363d] mx-auto mb-4" />
            <h3 className="text-[#5F6368] font-semibold tracking-widest uppercase">Map Visualization</h3>
            <p className="text-xs text-[#5F6368]/60 mt-2 max-w-xs mx-auto">Interactive map integration will render here. Incidents and traffic nodes are mapped to geospatial coordinates.</p>
          </div>
        </div>

        {/* FEED AREA */}
        <div className="flex flex-col gap-6">
          <div className="glass-card p-5 border-l-4 border-l-[#ff6b8a]">
            <h3 className="text-[#202124] font-bold mb-4 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#D93025]" /> Live Incidents
              <span className="ml-auto bg-[#D93025]/20 text-[#D93025] text-[10px] px-2 py-0.5 rounded-full">{incidents.length} Active</span>
            </h3>
            
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
              {incidents.length === 0 ? (
                <div className="text-sm text-[#5F6368] italic text-center py-4">No active incidents</div>
              ) : (
                incidents.map((inc: any) => (
                  <div key={inc._id} className="p-3 bg-white/60 rounded-lg border border-[#DADCE0]/60">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-bold text-[#202124] text-sm">{inc.type}</span>
                      <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${
                        inc.severity === 'High' ? 'bg-[#D93025] text-[#202124]' : 
                        inc.severity === 'Medium' ? 'bg-[#F4B400] text-[#202124]' : 
                        'bg-[#188038] text-[#202124]'
                      }`}>
                        {inc.severity}
                      </span>
                    </div>
                    <div className="text-xs text-[#5F6368] flex items-center gap-1 mb-2">
                      <MapPin className="w-3 h-3" /> {inc.location?.name}
                    </div>
                    {inc.description && <p className="text-xs text-[#202124]/70">{inc.description}</p>}
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="glass-card p-5 border-l-4 border-l-[#fbbf24]">
            <h3 className="text-[#202124] font-bold mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#F4B400]" /> Traffic Hotspots
            </h3>
            
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
              {trafficData.length === 0 ? (
                <div className="text-sm text-[#5F6368] italic text-center py-4">No traffic data recorded</div>
              ) : (
                trafficData.map((td: any) => (
                  <div key={td._id} className="p-3 bg-white/60 rounded-lg border border-[#DADCE0]/60 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-[#202124] text-sm">{td.location?.name}</div>
                      <div className="text-xs text-[#5F6368]">{td.avg_speed} km/h</div>
                    </div>
                    <span className={`text-xs font-bold ${
                      td.congestion_level === 'Gridlock' ? 'text-[#D93025]' : 
                      td.congestion_level === 'Heavy' ? 'text-[#F4B400]' : 
                      'text-[#1A73E8]'
                    }`}>
                      {td.congestion_level}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
