"use client";

import { useState } from "react";
import { Bus, PlusCircle, Trash2, CheckCircle2, AlertCircle } from "lucide-react";
import { addTransport, deleteTransport } from "@/app/actions/adminTransport";

export default function AdminTransportClient({ transports }: any) {
  const [isPending, setIsPending] = useState(false);
  const [msg, setMsg] = useState("");
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    const formData = new FormData(e.currentTarget);
    const res = await addTransport(formData);
    
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
    if (!confirm("Remove this transport mode?")) return;
    await deleteTransport(id);
  };

  return (
    <div className="animate-in fade-in duration-500 max-w-4xl mx-auto pb-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#202124] mb-2 font-['Syne'] flex items-center gap-3">
          <Bus className="w-8 h-8 text-[#188038]" />
          Manage Transport Fares
        </h1>
        <p className="text-[#5F6368]">Update base fares and cost-per-km for Buses, Metros, and more.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        <div className="glass-card">
          <h2 className="text-lg font-bold text-[#202124] mb-4 flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-[#1A73E8]" /> Add Transport Mode
          </h2>
          
          {msg && (
            <div className={`p-3 rounded-lg text-xs mb-4 flex items-center gap-2 ${isError ? "bg-[#D93025]/10 text-[#D93025]" : "bg-[#1A73E8]/10 text-[#1A73E8]"}`}>
              {isError ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />} {msg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-[#5F6368] uppercase mb-1 block">Transport Type Name</label>
              <input type="text" name="transport_type" required placeholder="e.g. Electric Bus" className="w-full bg-white/60 border border-[#DADCE0] rounded-lg p-3 text-[#202124] text-sm" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-[#5F6368] uppercase mb-1 block">Avg Speed (km/h)</label>
                <input type="number" step="0.1" name="average_speed" required placeholder="30" className="w-full bg-white/60 border border-[#DADCE0] rounded-lg p-3 text-[#202124] text-sm" />
              </div>
              <div>
                <label className="text-xs text-[#5F6368] uppercase mb-1 block">Base Fare (BDT)</label>
                <input type="number" step="0.01" name="base_fare" required placeholder="25" className="w-full bg-white/60 border border-[#DADCE0] rounded-lg p-3 text-[#202124] text-sm" />
              </div>
            </div>
            <button type="submit" disabled={isPending} className="w-full bg-[#188038] text-white font-bold py-3 rounded-lg hover:bg-[#0284c7] transition-colors mt-2 text-sm disabled:opacity-50">
              {isPending ? "Adding..." : "Add Transport Mode"}
            </button>
          </form>
        </div>

        <div className="glass-card">
          <h2 className="text-sm font-bold text-[#5F6368] uppercase tracking-wider mb-4">Current Transport Modes</h2>
          <div className="space-y-3">
            {transports.length === 0 ? (
              <div className="text-sm text-[#5F6368] italic text-center p-4">No transport modes available.</div>
            ) : (
              transports.map((t: any) => (
                <div key={t._id} className="flex justify-between items-center p-3 bg-white/60 rounded-lg border border-[#DADCE0]">
                  <div>
                    <div className="font-bold text-[#202124] text-sm">{t.type}</div>
                    <div className="text-xs text-[#5F6368] mt-0.5">৳{t.base_fare} · {t.average_speed} km/h</div>
                  </div>
                  <button onClick={() => handleDelete(t._id)} className="w-8 h-8 rounded-lg bg-[#D93025]/10 text-[#D93025] flex items-center justify-center hover:bg-[#D93025] hover:text-[#202124] transition-colors">
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
