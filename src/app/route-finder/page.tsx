import { MapPin, Search, Navigation } from "lucide-react";
import connectToDatabase from "@/lib/db";
import Location from "@/models/Location";
import RouteFinderClient from "./RouteFinderClient";

export default async function RouteFinderPage() {
  await connectToDatabase();
  
  const locations = await Location.find().sort({ name: 1 }).lean();
  
  // Serialize for client component
  const locList = locations.map(l => ({
    _id: l._id.toString(),
    name: l.name,
    area_zone: l.area_zone
  }));

  return (
    <div className="animate-in fade-in duration-500 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 font-['Syne'] flex items-center gap-3">
          <Navigation className="w-8 h-8 text-[#00e5a0]" />
          Route Finder
        </h1>
        <p className="text-[#8b949e]">Find the fastest and cheapest multi-modal routes across Dhaka.</p>
      </div>

      <div className="glass-card p-6 mb-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#00e5a0] to-[#38bdf8]" />
        
        <RouteFinderClient locations={locList} />
      </div>
    </div>
  );
}
