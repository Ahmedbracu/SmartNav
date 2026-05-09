"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { AlertTriangle } from "lucide-react";

const DhakaMap = dynamic(() => import("@/components/map/DhakaMap"), { ssr: false });

export default function ChaosMapClient({ locations, incidents }: any) {
  const [mapCenter, setMapCenter] = useState<[number, number] | undefined>(undefined);
  const [mapZoom, setMapZoom] = useState(13);

  const handleIncidentClick = (inc: any) => {
    setMapCenter([inc.latitude, inc.longitude]);
    setMapZoom(16);
  };

  const highCount = incidents.filter((i: any) => i.severity === "High").length;
  const medCount = incidents.filter((i: any) => i.severity === "Medium").length;
  const lowCount = incidents.filter((i: any) => i.severity === "Low").length;

  return (
    <div className="animate-in fade-in duration-500 max-w-6xl mx-auto pb-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#202124] mb-2 font-['Syne'] flex items-center gap-3">
          <AlertTriangle className="w-8 h-8 text-[#D93025]" />
          Chaos Map — Live Dhaka
        </h1>
        <p className="text-[#5F6368]">Real-time incident reports across Dhaka city. Pulsing markers indicate active hazards.</p>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="glass-card flex items-center gap-3 py-3">
          <div className="w-10 h-10 rounded-full bg-[#D93025]/10 text-[#D93025] flex items-center justify-center text-lg font-bold">{highCount}</div>
          <div><div className="text-sm font-bold text-[#202124]">High Severity</div><div className="text-xs text-[#5F6368]">Critical alerts</div></div>
        </div>
        <div className="glass-card flex items-center gap-3 py-3">
          <div className="w-10 h-10 rounded-full bg-[#F4B400]/10 text-[#F4B400] flex items-center justify-center text-lg font-bold">{medCount}</div>
          <div><div className="text-sm font-bold text-[#202124]">Medium</div><div className="text-xs text-[#5F6368]">Use caution</div></div>
        </div>
        <div className="glass-card flex items-center gap-3 py-3">
          <div className="w-10 h-10 rounded-full bg-[#188038]/10 text-[#188038] flex items-center justify-center text-lg font-bold">{lowCount}</div>
          <div><div className="text-sm font-bold text-[#202124]">Low</div><div className="text-xs text-[#5F6368]">Minor issues</div></div>
        </div>
      </div>

      {/* THE MAP */}
      <DhakaMap
        locations={locations}
        incidents={incidents}
        height="600px"
        showLocations={true}
        showIncidents={true}
        center={mapCenter || [23.7806, 90.3964]}
        zoom={mapZoom}
      />

      {/* Legend */}
      <div className="glass-card mt-6 flex flex-wrap gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-[#1A73E8] border-2 border-white shadow"></div>
          <span className="text-[#5F6368]">City Location</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-[#D93025] border-2 border-white shadow"></div>
          <span className="text-[#5F6368]">High Severity</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-[#F4B400] border-2 border-white shadow"></div>
          <span className="text-[#5F6368]">Medium Severity</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-[#188038] border-2 border-white shadow"></div>
          <span className="text-[#5F6368]">Low Severity</span>
        </div>
      </div>

      {/* Incident List Tabs */}
      <div className="mt-12">
        <h2 className="text-xl font-bold text-[#202124] mb-4 font-['Syne']">Active Incident Reports</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {incidents.filter((i:any) => i.status === "Active").map((inc: any) => (
            <button 
              key={inc._id}
              onClick={() => handleIncidentClick(inc)}
              className="text-left glass-card hover:-translate-y-1 hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-[#1A73E8]"
            >
              <div className="flex justify-between items-start mb-2">
                <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded ${
                  inc.severity === 'High' ? 'bg-[#D93025]/10 text-[#D93025]' : 
                  inc.severity === 'Medium' ? 'bg-[#F4B400]/10 text-[#F4B400]' : 
                  'bg-[#188038]/10 text-[#188038]'
                }`}>
                  {inc.severity} Severity
                </span>
                <span className="text-xs text-[#5F6368]">{new Date(inc.reported_at).toLocaleTimeString()}</span>
              </div>
              <h3 className="font-bold text-[#202124] text-lg mb-1">{inc.type}</h3>
              <p className="text-sm text-[#5F6368] flex items-center gap-1.5"><AlertTriangle className="w-4 h-4"/> {inc.location_name}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
