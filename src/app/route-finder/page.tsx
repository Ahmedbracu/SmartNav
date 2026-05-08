import { Navigation } from "lucide-react";
import connectToDatabase from "@/lib/db";
import Location from "@/models/Location";
import RouteFinderClient from "./RouteFinderClient";

export default async function RouteFinderPage() {
  await connectToDatabase();
  
  const locations = await Location.find().sort({ name: 1 }).lean();
  
  // Serialize for client component — now includes GPS coordinates for map
  const locList = locations.map(l => ({
    _id: l._id.toString(),
    name: l.name,
    latitude: l.latitude,
    longitude: l.longitude,
    area_zone: l.area_zone
  }));

  return (
    <div className="animate-in fade-in duration-500 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#202124] mb-2 font-['Syne'] flex items-center gap-3">
          <Navigation className="w-8 h-8 text-[#1A73E8]" />
          Route Finder
        </h1>
        <p className="text-[#5F6368]">Find the fastest and cheapest multi-modal routes across Dhaka. Routes are drawn on real roads.</p>
      </div>

      <RouteFinderClient locations={locList} />
    </div>
  );
}
