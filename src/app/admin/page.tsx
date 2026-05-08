import Link from "next/link";
import { ShieldAlert, Route, Bus, MapPin, Activity } from "lucide-react";

export default function AdminHub() {
  return (
    <div className="animate-in fade-in duration-500 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 font-['Syne'] flex items-center gap-3">
          <ShieldAlert className="w-8 h-8 text-[#ff6b8a]" />
          Admin Control Center
        </h1>
        <p className="text-[#8b949e]">Manage system data, routes, locations, and view analytics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/admin/routes" className="glass-card hover:border-[#00e5a0]/50 hover:-translate-y-1 transition-all group">
          <div className="w-12 h-12 rounded-xl bg-[#00e5a0]/10 text-[#00e5a0] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Route className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Manage Routes & Segments</h2>
          <p className="text-sm text-[#8b949e]">Add new city routes, define distances, and assign multi-modal transport segments to them.</p>
        </Link>

        <Link href="/admin/transport" className="glass-card hover:border-[#38bdf8]/50 hover:-translate-y-1 transition-all group">
          <div className="w-12 h-12 rounded-xl bg-[#38bdf8]/10 text-[#38bdf8] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Bus className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Manage Transport Fares</h2>
          <p className="text-sm text-[#8b949e]">Update base fares and cost-per-km for Buses, Metros, CNGs, and Rickshaws.</p>
        </Link>

        <Link href="/admin/locations" className="glass-card hover:border-[#fbbf24]/50 hover:-translate-y-1 transition-all group">
          <div className="w-12 h-12 rounded-xl bg-[#fbbf24]/10 text-[#fbbf24] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <MapPin className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Manage Locations</h2>
          <p className="text-sm text-[#8b949e]">Add new map nodes (e.g. Banani, Dhanmondi) and assign them to area zones.</p>
        </Link>

        <Link href="/admin/incidents" className="glass-card hover:border-[#ff6b8a]/50 hover:-translate-y-1 transition-all group">
          <div className="w-12 h-12 rounded-xl bg-[#ff6b8a]/10 text-[#ff6b8a] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Activity className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Moderate Incidents</h2>
          <p className="text-sm text-[#8b949e]">Review user-reported incidents, update their status, or remove false reports.</p>
        </Link>
      </div>
    </div>
  );
}
