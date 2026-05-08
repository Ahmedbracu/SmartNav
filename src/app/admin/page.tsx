/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";
import { ShieldAlert, Route, Bus, MapPin, Activity, Users, ClipboardList, AlertTriangle, Star, Database, BarChart3, Navigation } from "lucide-react";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import Location from "@/models/Location";
import RouteModel from "@/models/Route";
import Trip from "@/models/Trip";
import Incident from "@/models/Incident";
import TransportMode from "@/models/TransportMode";
import Traffic from "@/models/Traffic";
import Review from "@/models/Review";

async function getAdminStats() {
  await connectToDatabase();

  const [usersCount, locationsCount, routesCount, tripsCount, incidentsCount, transportsCount, trafficCount, reviewsCount] = await Promise.all([
    User.countDocuments(),
    Location.countDocuments(),
    RouteModel.countDocuments(),
    Trip.countDocuments(),
    Incident.countDocuments({ status: { $ne: "Resolved" } }),
    TransportMode.countDocuments(),
    Traffic.countDocuments(),
    Review.countDocuments(),
  ]);

  // Get total segments across all routes
  const routes = await RouteModel.find().lean();
  const segmentsCount = routes.reduce((acc: number, r: any) => acc + (r.segments?.length || 0), 0);

  // Last 7 days trip data for the chart
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  const recentTrips = await Trip.find({ trip_date: { $gte: sevenDaysAgo } }).lean();
  const dayLabels = [];
  const dayCounts = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const label = d.toLocaleDateString("en-US", { weekday: "short" });
    const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const dayEnd = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1);
    const count = recentTrips.filter((t: any) => {
      const td = new Date(t.trip_date);
      return td >= dayStart && td < dayEnd;
    }).length;
    dayLabels.push(label);
    dayCounts.push(count);
  }

  // Cached routes from optimizer
  const cachedRoutes = 0; // Will show real data when optimizer is active

  return {
    usersCount, locationsCount, routesCount, tripsCount, incidentsCount,
    transportsCount, trafficCount, reviewsCount, segmentsCount, cachedRoutes,
    dayLabels, dayCounts,
  };
}

export default async function AdminHub() {
  const stats = await getAdminStats();
  const maxChart = Math.max(...stats.dayCounts, 1);

  const statCards = [
    { label: "Registered Users", value: stats.usersCount, icon: Users, color: "#1A73E8", bg: "#1A73E8" },
    { label: "Locations", value: stats.locationsCount, icon: MapPin, color: "#F4B400", bg: "#F4B400" },
    { label: "Routes", value: stats.routesCount, icon: Route, color: "#188038", bg: "#188038" },
    { label: "Trip Logs", value: stats.tripsCount, icon: ClipboardList, color: "#8E24AA", bg: "#8E24AA" },
    { label: "Active Issues", value: stats.incidentsCount, icon: AlertTriangle, color: "#D93025", bg: "#D93025" },
    { label: "Segments", value: stats.segmentsCount, icon: Navigation, color: "#00897B", bg: "#00897B" },
    { label: "Traffic Recs", value: stats.trafficCount, icon: Activity, color: "#E65100", bg: "#E65100" },
    { label: "Reviews", value: stats.reviewsCount, icon: Star, color: "#F9AB00", bg: "#F9AB00" },
    { label: "Transport Modes", value: stats.transportsCount, icon: Bus, color: "#1E88E5", bg: "#1E88E5" },
    { label: "Cached Routes", value: stats.cachedRoutes, icon: Database, color: "#5F6368", bg: "#5F6368" },
  ];

  const navCards = [
    { name: "Manage Routes", desc: "Add routes, define distances, assign multi-modal segments.", href: "/admin/routes", icon: Route, color: "#1A73E8" },
    { name: "Manage Fares", desc: "Update base fares and cost-per-km for all transports.", href: "/admin/transport", icon: Bus, color: "#188038" },
    { name: "Manage Locations", desc: "Add new map nodes and assign area zones.", href: "/admin/locations", icon: MapPin, color: "#F4B400" },
    { name: "Chaos Map", desc: "Review user-reported incidents and update their status.", href: "/admin/incidents", icon: AlertTriangle, color: "#D93025" },
    { name: "Traffic Data", desc: "View and manage real-time traffic congestion records.", href: "/admin/traffic", icon: Activity, color: "#E65100" },
  ];

  return (
    <div className="page-transition max-w-6xl mx-auto pb-20">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#202124] mb-2 font-['Syne'] flex items-center gap-3">
          <ShieldAlert className="w-8 h-8 text-[#D93025]" />
          Admin Control Center
        </h1>
        <p className="text-[#5F6368]">Manage system data, routes, locations, and view analytics.</p>
      </div>

      {/* Overview Stats Cards */}
      <div className="mb-8">
        <h2 className="text-sm font-bold text-[#5F6368] uppercase tracking-wider mb-4 flex items-center gap-2">
          <BarChart3 className="w-4 h-4" /> Overview
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {statCards.map((card) => (
            <div key={card.label} className="glass-card p-4 flex flex-col items-center text-center hover:scale-[1.03] transition-transform cursor-default">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-2"
                style={{ backgroundColor: `${card.bg}15` }}
              >
                <card.icon className="w-5 h-5" style={{ color: card.color }} />
              </div>
              <div className="text-2xl font-bold text-[#202124]">{card.value}</div>
              <div className="text-[10px] text-[#5F6368] uppercase tracking-wider font-semibold mt-1">{card.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Last 7 Days Chart */}
      <div className="glass-card mb-8">
        <h2 className="text-sm font-bold text-[#5F6368] uppercase tracking-wider mb-4">Last 7 Days — Trip Activity</h2>
        <div className="flex items-end gap-3 h-32">
          {stats.dayLabels.map((label: string, i: number) => (
            <div key={label} className="flex-1 flex flex-col items-center gap-1">
              <div className="text-xs font-bold text-[#1A73E8]">{stats.dayCounts[i]}</div>
              <div
                className="w-full rounded-t-lg transition-all"
                style={{
                  height: `${Math.max((stats.dayCounts[i] / maxChart) * 100, 4)}%`,
                  background: `linear-gradient(to top, #1A73E8, #42A5F5)`,
                  minHeight: "4px",
                }}
              />
              <div className="text-[10px] text-[#5F6368] font-semibold uppercase">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Admin Panel Navigation */}
      <div className="mb-4">
        <h2 className="text-sm font-bold text-[#5F6368] uppercase tracking-wider mb-4">Admin Panel</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {navCards.map((card) => (
          <Link key={card.name} href={card.href} className="glass-card hover:-translate-y-1 transition-all group" style={{ borderColor: "transparent" }}>
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
              style={{ backgroundColor: `${card.color}15` }}
            >
              <card.icon className="w-6 h-6" style={{ color: card.color }} />
            </div>
            <h2 className="text-xl font-bold text-[#202124] mb-2">{card.name}</h2>
            <p className="text-sm text-[#5F6368]">{card.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
