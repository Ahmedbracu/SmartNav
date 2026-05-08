import { auth } from "@/auth";
import { redirect } from "next/navigation";
import connectToDatabase from "@/lib/db";
import Trip from "@/models/Trip";
import RouteModel from "@/models/Route";
import Location from "@/models/Location";
import { Clock, DollarSign, Route, TrendingUp, ArrowRight, Heart } from "lucide-react";
import Link from "next/link";

export default async function TripHistoryPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  await connectToDatabase();
  const userId = session.user.id;

  // Stats aggregation
  const statsAgg = await Trip.aggregate([
    { $match: { user: userId } },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        totalCost: { $sum: "$travel_cost" },
        avgTime: { $avg: "$travel_time" },
        avgCost: { $avg: "$travel_cost" }
      }
    }
  ]);
  const stats = statsAgg[0] || { total: 0, totalCost: 0, avgTime: 0, avgCost: 0 };

  // All trips (lean for perf)
  const trips = await Trip.find({ user: userId })
    .populate({
      path: "route",
      populate: [
        { path: "source_location", model: Location },
        { path: "destination_location", model: Location }
      ]
    })
    .sort({ trip_date: -1 })
    .limit(50)
    .lean();

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#202124] mb-2 font-['Syne'] flex items-center gap-3">
          <Clock className="w-8 h-8 text-[#F4B400]" />
          Trip History
        </h1>
        <p className="text-[#5F6368]">Your personal navigation analytics and trip log.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="glass-card flex items-center gap-4 hover:-translate-y-1 transition-transform">
          <div className="w-12 h-12 rounded-xl bg-[#188038]/10 text-[#188038] flex items-center justify-center"><Route className="w-6 h-6" /></div>
          <div>
            <div className="text-2xl font-bold text-[#202124]">{stats.total}</div>
            <div className="text-xs text-[#5F6368] uppercase tracking-wider font-semibold">Total Trips</div>
          </div>
        </div>
        <div className="glass-card flex items-center gap-4 hover:-translate-y-1 transition-transform">
          <div className="w-12 h-12 rounded-xl bg-[#1A73E8]/10 text-[#1A73E8] flex items-center justify-center"><DollarSign className="w-6 h-6" /></div>
          <div>
            <div className="text-2xl font-bold text-[#202124]">৳{Math.round(stats.totalCost).toLocaleString()}</div>
            <div className="text-xs text-[#5F6368] uppercase tracking-wider font-semibold">Total Spent</div>
          </div>
        </div>
        <div className="glass-card flex items-center gap-4 hover:-translate-y-1 transition-transform">
          <div className="w-12 h-12 rounded-xl bg-[#F4B400]/10 text-[#F4B400] flex items-center justify-center"><Clock className="w-6 h-6" /></div>
          <div>
            <div className="text-2xl font-bold text-[#202124]">{Math.round(stats.avgTime)}<span className="text-sm text-[#5F6368]">m</span></div>
            <div className="text-xs text-[#5F6368] uppercase tracking-wider font-semibold">Avg Trip Time</div>
          </div>
        </div>
        <div className="glass-card flex items-center gap-4 hover:-translate-y-1 transition-transform">
          <div className="w-12 h-12 rounded-xl bg-[#D93025]/10 text-[#D93025] flex items-center justify-center"><TrendingUp className="w-6 h-6" /></div>
          <div>
            <div className="text-2xl font-bold text-[#202124]">৳{Math.round(stats.avgCost)}</div>
            <div className="text-xs text-[#5F6368] uppercase tracking-wider font-semibold">Avg Trip Cost</div>
          </div>
        </div>
      </div>

      {/* Full History Table */}
      <div className="glass-card p-0 overflow-hidden">
        <div className="p-4 border-b border-[#DADCE0] bg-[#F8F9FA]/80 flex justify-between items-center">
          <h2 className="text-lg font-bold text-[#202124]">All Trips</h2>
          <span className="text-xs text-[#5F6368]">{stats.total} total</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-white/60 text-[#5F6368] border-b border-[#DADCE0]">
                <th className="p-4 text-xs uppercase tracking-wider font-semibold">Route</th>
                <th className="p-4 text-xs uppercase tracking-wider font-semibold">Time</th>
                <th className="p-4 text-xs uppercase tracking-wider font-semibold">Cost</th>
                <th className="p-4 text-xs uppercase tracking-wider font-semibold">Date</th>
              </tr>
            </thead>
            <tbody>
              {trips.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-[#5F6368] italic">
                    No trips yet. <Link href="/route-finder" className="text-[#1A73E8] hover:underline">Find a route →</Link>
                  </td>
                </tr>
              ) : (
                trips.map((t: any) => (
                  <tr key={t._id} className="border-b border-[#DADCE0]/60 hover:bg-[#F8F9FA] transition-colors">
                    <td className="p-4 font-medium text-[#202124] flex items-center gap-2">
                      {t.route?.source_location?.name || "—"}
                      <ArrowRight className="w-4 h-4 text-[#5F6368]" />
                      {t.route?.destination_location?.name || "—"}
                    </td>
                    <td className="p-4 text-[#5F6368]">{t.travel_time} min</td>
                    <td className="p-4"><span className="bg-[#1A73E8]/10 text-[#1A73E8] px-2 py-1 rounded font-bold">৳{t.travel_cost}</span></td>
                    <td className="p-4 text-[#5F6368] text-xs">{new Date(t.trip_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
