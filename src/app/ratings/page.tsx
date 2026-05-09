import { auth } from "@/auth";
import connectToDatabase from "@/lib/db";
import TransportMode from "@/models/TransportMode";
import RouteModel from "@/models/Route";
import Review from "@/models/Review";
import Location from "@/models/Location";
import User from "@/models/User";
import RatingsClient from "./RatingsClient";

export default async function RatingsPage() {
  const session = await auth();
  await connectToDatabase();

  const transports = await TransportMode.find().sort({ type: 1 }).lean();
  const serializedTransports = transports.map(t => ({ _id: t._id.toString(), type: t.type, base_fare: t.base_fare, average_speed: t.average_speed }));

  const locationsData = await Location.find().sort({ name: 1 }).lean();
  const serializedLocations = locationsData.map(l => ({ _id: l._id.toString(), name: l.name }));

  // Overall Ratings Aggregation
  const overallAgg = await Review.aggregate([
    {
      $group: {
        _id: "$transport",
        avg_r: { $avg: "$rating" },
        cnt: { $sum: 1 }
      }
    }
  ]);

  const overallRatings = transports.map(t => {
    const agg = overallAgg.find(a => a._id.toString() === t._id.toString());
    return {
      _id: t._id.toString(),
      type: t.type,
      base_fare: t.base_fare,
      average_speed: t.average_speed,
      avg_r: agg ? agg.avg_r : 0,
      cnt: agg ? agg.cnt : 0
    };
  }).sort((a, b) => b.avg_r - a.avg_r);

  // Recent Reviews
  const recentReviews = await Review.find()
    .populate("user", "name")
    .populate("transport", "type")
    .populate({
      path: "route",
      populate: [
        { path: "source_location", model: Location },
        { path: "destination_location", model: Location }
      ]
    })
    .sort({ timestamp: -1 })
    .limit(10)
    .lean();

  const serializedReviews = recentReviews.map((r: any) => ({
    _id: r._id.toString(),
    user_name: r.user?.name || "Unknown",
    transport_type: r.transport?.type || "Unknown",
    route_name: r.route ? `${r.route.source_location?.name} → ${r.route.destination_location?.name}` : null,
    rating: r.rating,
    comment: r.comment,
    timestamp: r.timestamp.toISOString()
  }));

  // My Reviews
  let serializedMyReviews: any[] = [];
  if (session?.user?.id) {
    const myReviews = await Review.find({ user: session.user.id })
      .populate("transport", "type")
      .populate({
        path: "route",
        populate: [
          { path: "source_location", model: Location },
          { path: "destination_location", model: Location }
        ]
      })
      .sort({ timestamp: -1 })
      .limit(5)
      .lean();

    serializedMyReviews = myReviews.map((r: any) => ({
      _id: r._id.toString(),
      transport_type: r.transport?.type || "Unknown",
      route_name: r.route ? `${r.route.source_location?.name} → ${r.route.destination_location?.name}` : null,
      rating: r.rating,
      comment: r.comment,
      timestamp: r.timestamp.toISOString()
    }));
  }

  return (
    <RatingsClient 
      isLoggedIn={!!session?.user?.id}
      userId={session?.user?.id}
      transports={serializedTransports}
      locations={serializedLocations}
      overallRatings={overallRatings}
      recentReviews={serializedReviews}
      myReviews={serializedMyReviews}
    />
  );
}
