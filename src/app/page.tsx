import Link from "next/link";
import { Users, Route, AlertTriangle, Clock, Map, Flag, Activity } from "lucide-react";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import RouteModel from "@/models/Route";
import Incident from "@/models/Incident";
import Trip from "@/models/Trip";

export default async function Dashboard() {
  await connectToDatabase();

  // Fetch real stats from MongoDB
  const totalUsers = await User.countDocuments();
  const totalRoutes = await RouteModel.countDocuments();
  const activeIncidents = await Incident.countDocuments({ status: "Active" });
  const totalTrips = await Trip.countDocuments();

  // Fetch Recent Incidents
  const recentIncidents = await Incident.find({ status: "Active" })
    .sort({ reported_at: -1 })
    .limit(5)
    .populate("location", "name")
    .lean();

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2 font-['Syne']">Dashboard</h1>
        <p className="text-[#8b949e]">Welcome to SmartNav. Here is the current state of Dhaka&apos;s transit network.</p>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card flex items-center gap-4 hover:-translate-y-1">
          <div className="w-12 h-12 rounded-xl bg-[#00e5a0]/10 text-[#00e5a0] flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{totalUsers}</div>
            <div className="text-xs text-[#8b949e] uppercase tracking-wider font-semibold">Registered Users</div>
          </div>
        </div>
        
        <div className="glass-card flex items-center gap-4 hover:-translate-y-1">
          <div className="w-12 h-12 rounded-xl bg-[#38bdf8]/10 text-[#38bdf8] flex items-center justify-center">
            <Route className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{totalRoutes}</div>
            <div className="text-xs text-[#8b949e] uppercase tracking-wider font-semibold">Total Routes</div>
          </div>
        </div>

        <div className="glass-card flex items-center gap-4 hover:-translate-y-1">
          <div className="w-12 h-12 rounded-xl bg-[#ff6b8a]/10 text-[#ff6b8a] flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{activeIncidents}</div>
            <div className="text-xs text-[#8b949e] uppercase tracking-wider font-semibold">Active Incidents</div>
          </div>
        </div>

        <div className="glass-card flex items-center gap-4 hover:-translate-y-1">
          <div className="w-12 h-12 rounded-xl bg-[#fbbf24]/10 text-[#fbbf24] flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{totalTrips}</div>
            <div className="text-xs text-[#8b949e] uppercase tracking-wider font-semibold">Trips Logged</div>
          </div>
        </div>
      </div>

      {/* QUICK ACTIONS */}
      <div className="flex flex-wrap gap-4">
        <Link href="/route-finder" className="flex items-center gap-2 bg-[#00e5a0] text-black px-6 py-3 rounded-lg font-bold hover:bg-[#00c489] transition-colors shadow-[0_0_20px_rgba(0,229,160,0.3)]">
          <Route className="w-5 h-5" /> Find a Route
        </Link>
        <Link href="/report" className="flex items-center gap-2 bg-[#161b22] text-white border border-[#30363d]/40 px-6 py-3 rounded-lg font-medium hover:bg-[#21262d] transition-colors">
          <Flag className="w-5 h-5 text-[#ff6b8a]" /> Report Incident
        </Link>
        <Link href="/chaos-map" className="flex items-center gap-2 bg-[#161b22] text-white border border-[#30363d]/40 px-6 py-3 rounded-lg font-medium hover:bg-[#21262d] transition-colors">
          <Map className="w-5 h-5 text-[#38bdf8]" /> View Chaos Map
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* RECENT TRIPS */}
        <div className="glass p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-white font-['Syne']">Recent Trips</h2>
            <Link href="/trip-history" className="text-xs text-[#8b949e] hover:text-[#00e5a0] uppercase tracking-wider font-semibold">View All</Link>
          </div>
          <div className="text-sm text-[#8b949e] italic py-8 text-center">
            No recent trips recorded. Go find a route!
          </div>
        </div>

        {/* ACTIVE INCIDENTS */}
        <div className="glass p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-white font-['Syne']">Active Incidents</h2>
            <Link href="/chaos-map" className="text-xs text-[#8b949e] hover:text-[#ff6b8a] uppercase tracking-wider font-semibold">Map View</Link>
          </div>
          
          <div className="space-y-4">
            {recentIncidents.length === 0 ? (
              <div className="text-sm text-[#8b949e] italic py-8 text-center">
                All clear! No active incidents reported in Dhaka right now.
              </div>
            ) : (
              recentIncidents.map((incident: any) => (
                <div key={incident._id} className="flex items-start gap-4 p-4 rounded-lg bg-[#0d1117]/50 border border-[#30363d]/40">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                    incident.severity === 'High' ? 'bg-[#ff6b8a]/20 text-[#ff6b8a]' : 
                    incident.severity === 'Medium' ? 'bg-[#fbbf24]/20 text-[#fbbf24]' : 
                    'bg-[#38bdf8]/20 text-[#38bdf8]'
                  }`}>
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-white">{incident.type}</span>
                      <span className="text-xs text-[#8b949e]">at {incident.location?.name || "Unknown"}</span>
                    </div>
                    <div className="text-xs text-[#8b949e] mb-2">{new Date(incident.reported_at).toLocaleString()}</div>
                    <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded ${
                      incident.severity === 'High' ? 'bg-[#ff6b8a] text-black' : 
                      incident.severity === 'Medium' ? 'bg-[#fbbf24] text-black' : 
                      'bg-[#38bdf8] text-black'
                    }`}>
                      {incident.severity}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
