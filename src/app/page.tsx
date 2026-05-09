import Link from "next/link";
import { Users, Route, AlertTriangle, Clock, Map, Flag, Activity, Navigation } from "lucide-react";
import connectToDatabase from "@/lib/db";
import { auth } from "@/auth";
import User from "@/models/User";
import RouteModel from "@/models/Route";
import Incident from "@/models/Incident";
import Trip from "@/models/Trip";
import Location from "@/models/Location";
import QuickSearchWidget from "@/components/dashboard/QuickSearchWidget";

export default async function Dashboard() {
  const session = await auth();
  await connectToDatabase();

  const userName = session?.user?.name?.split(" ")[0] || "Traveler";
  const hour = new Date().getHours();
  let greeting = "Good Evening";
  if (hour < 12) greeting = "Good Morning";
  else if (hour < 18) greeting = "Good Afternoon";

  // Fetch real stats from MongoDB
  const totalUsers = await User.countDocuments();
  const totalRoutes = await RouteModel.countDocuments();
  const activeIncidents = await Incident.countDocuments({ status: "Active" });
  const totalTrips = await Trip.countDocuments();
  
  const locations = await Location.find().sort({ name: 1 }).lean();
  const serializedLocations = locations.map(l => ({ _id: l._id.toString(), name: l.name }));

  // Fetch Recent Incidents
  const recentIncidents = await Incident.find({ status: "Active" })
    .sort({ reported_at: -1 })
    .limit(5)
    .populate("location", "name")
    .lean();

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#202124] mb-1 font-['Syne']">{greeting}, {userName}!</h1>
          <p className="text-[#5F6368] font-medium">Ready to navigate Dhaka today?</p>
        </div>
        <div className="hidden md:flex items-center gap-2 bg-[#1A73E8]/10 text-[#1A73E8] px-4 py-2 rounded-full font-bold text-sm">
          <Navigation className="w-4 h-4" /> Live Network Active
        </div>
      </div>

      <QuickSearchWidget locations={serializedLocations} />

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card flex items-center gap-4 hover:-translate-y-1">
          <div className="w-12 h-12 rounded-xl bg-[#1A73E8]/10 text-[#1A73E8] flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-[#202124]">{totalUsers}</div>
            <div className="text-xs text-[#5F6368] uppercase tracking-wider font-semibold">Registered Users</div>
          </div>
        </div>
        
        <div className="glass-card flex items-center gap-4 hover:-translate-y-1">
          <div className="w-12 h-12 rounded-xl bg-[#188038]/10 text-[#188038] flex items-center justify-center">
            <Route className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-[#202124]">{totalRoutes}</div>
            <div className="text-xs text-[#5F6368] uppercase tracking-wider font-semibold">Total Routes</div>
          </div>
        </div>

        <div className="glass-card flex items-center gap-4 hover:-translate-y-1">
          <div className="w-12 h-12 rounded-xl bg-[#D93025]/10 text-[#D93025] flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-[#202124]">{activeIncidents}</div>
            <div className="text-xs text-[#5F6368] uppercase tracking-wider font-semibold">Active Incidents</div>
          </div>
        </div>

        <div className="glass-card flex items-center gap-4 hover:-translate-y-1">
          <div className="w-12 h-12 rounded-xl bg-[#F4B400]/10 text-[#F4B400] flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-[#202124]">{totalTrips}</div>
            <div className="text-xs text-[#5F6368] uppercase tracking-wider font-semibold">Trips Logged</div>
          </div>
        </div>
      </div>

      {/* QUICK ACTIONS */}
      <div className="flex flex-wrap gap-4">
        <Link href="/route-finder" className="flex items-center gap-2 bg-[#1A73E8] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#1557B0] transition-colors shadow-[0_2px_8px_rgba(26,115,232,0.3)]">
          <Route className="w-5 h-5" /> Find a Route
        </Link>
        <Link href="/report" className="flex items-center gap-2 bg-[#F8F9FA] text-[#202124] border border-[#DADCE0]/60 px-6 py-3 rounded-lg font-medium hover:bg-[#E8EAED] transition-colors">
          <Flag className="w-5 h-5 text-[#D93025]" /> Report Incident
        </Link>
        <Link href="/chaos-map" className="flex items-center gap-2 bg-[#F8F9FA] text-[#202124] border border-[#DADCE0]/60 px-6 py-3 rounded-lg font-medium hover:bg-[#E8EAED] transition-colors">
          <Map className="w-5 h-5 text-[#188038]" /> View Chaos Map
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* RECENT TRIPS */}
        <div className="glass p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-[#202124] font-['Syne']">Recent Trips</h2>
            <Link href="/trip-history" className="text-xs text-[#5F6368] hover:text-[#1A73E8] uppercase tracking-wider font-semibold">View All</Link>
          </div>
          <div className="text-sm text-[#5F6368] italic py-8 text-center">
            No recent trips recorded. Go find a route!
          </div>
        </div>

        {/* ACTIVE INCIDENTS */}
        <div className="glass p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-[#202124] font-['Syne']">Active Incidents</h2>
            <Link href="/chaos-map" className="text-xs text-[#5F6368] hover:text-[#D93025] uppercase tracking-wider font-semibold">Map View</Link>
          </div>
          
          <div className="space-y-4">
            {recentIncidents.length === 0 ? (
              <div className="text-sm text-[#5F6368] italic py-8 text-center">
                All clear! No active incidents reported in Dhaka right now.
              </div>
            ) : (
              recentIncidents.map((incident: any) => (
                <div key={incident._id} className="flex items-start gap-4 p-4 rounded-lg bg-white/60/50 border border-[#DADCE0]/60">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                    incident.severity === 'High' ? 'bg-[#D93025]/20 text-[#D93025]' : 
                    incident.severity === 'Medium' ? 'bg-[#F4B400]/20 text-[#F4B400]' : 
                    'bg-[#188038]/20 text-[#188038]'
                  }`}>
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-[#202124]">{incident.type}</span>
                      <span className="text-xs text-[#5F6368]">at {incident.location?.name || "Unknown"}</span>
                    </div>
                    <div className="text-xs text-[#5F6368] mb-2">{new Date(incident.reported_at).toLocaleString()}</div>
                    <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded ${
                      incident.severity === 'High' ? 'bg-[#D93025] text-white' : 
                      incident.severity === 'Medium' ? 'bg-[#F4B400] text-white' : 
                      'bg-[#188038] text-white'
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
