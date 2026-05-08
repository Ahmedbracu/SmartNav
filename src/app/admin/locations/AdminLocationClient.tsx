"use client";

import { useState } from "react";
import { MapPin, PlusCircle, Trash2, CheckCircle2, AlertCircle } from "lucide-react";
import { addLocation, deleteLocation } from "@/app/actions/adminLocation";

export default function AdminLocationClient({ locations }: any) {
  const [isPending, setIsPending] = useState(false);
  const [msg, setMsg] = useState("");
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    const formData = new FormData(e.currentTarget);
    const res = await addLocation(formData);
    
    if (res.error) {
      setMsg(res.error);
      setIsError(true);
    } else {
      setMsg(res.success || "Added");
      setIsError(false);
      (e.target as HTMLFormElement).reset();
    }
    setIsPending(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this location?")) return;
    await deleteLocation(id);
  };

  return (
    <div className="animate-in fade-in duration-500 max-w-4xl mx-auto pb-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#202124] mb-2 font-['Syne'] flex items-center gap-3">
          <MapPin className="w-8 h-8 text-[#F4B400]" />
          Manage Locations
        </h1>
        <p className="text-[#5F6368]">Add new city map nodes and assign them to area zones.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        <div className="glass-card">
          <h2 className="text-lg font-bold text-[#202124] mb-4 flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-[#1A73E8]" /> Add New Location
          </h2>
          
          {msg && (
            <div className={`p-3 rounded-lg text-xs mb-4 flex items-center gap-2 ${isError ? "bg-[#D93025]/10 text-[#D93025]" : "bg-[#1A73E8]/10 text-[#1A73E8]"}`}>
              {isError ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />} {msg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-[#5F6368] uppercase mb-1 block">Location Name</label>
              <input type="text" name="name" required placeholder="e.g. Banani" className="w-full bg-white/60 border border-[#DADCE0] rounded-lg p-3 text-[#202124] text-sm" />
            </div>
            <div>
              <label className="text-xs text-[#5F6368] uppercase mb-1 block">Area Zone</label>
              <input type="text" name="area_zone" required placeholder="e.g. Dhaka North" className="w-full bg-white/60 border border-[#DADCE0] rounded-lg p-3 text-[#202124] text-sm" />
            </div>
            
            <button type="submit" disabled={isPending} className="w-full bg-[#F4B400] text-white font-bold py-3 rounded-lg hover:bg-[#d97706] transition-colors mt-2 text-sm disabled:opacity-50">
              {isPending ? "Adding..." : "Add Location"}
            </button>
          </form>
        </div>

        <div className="glass-card max-h-[600px] overflow-y-auto">
          <h2 className="text-sm font-bold text-[#5F6368] uppercase tracking-wider mb-4 flex justify-between items-center">
            Current Locations
            <span className="bg-[#F4B400]/10 text-[#F4B400] px-2 py-0.5 rounded text-[10px]">{locations.length} total</span>
          </h2>
          <div className="space-y-2">
            {locations.length === 0 ? (
              <div className="text-sm text-[#5F6368] italic text-center p-4">No locations available.</div>
            ) : (
              locations.map((l: any) => (
                <div key={l._id} className="flex justify-between items-center p-3 bg-white/60 rounded-lg border border-[#DADCE0]/60 hover:border-[#F4B400]/30 transition-colors">
                  <div>
                    <div className="font-bold text-[#202124] text-sm">{l.name}</div>
                    <div className="text-[10px] text-[#5F6368] mt-0.5 uppercase tracking-wider font-semibold">{l.area_zone}</div>
                  </div>
                  <button onClick={() => handleDelete(l._id)} className="text-[#D93025]/50 hover:text-[#D93025] transition-colors p-2">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
