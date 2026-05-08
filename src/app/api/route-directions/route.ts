import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const srcLat = searchParams.get("srcLat");
  const srcLng = searchParams.get("srcLng");
  const dstLat = searchParams.get("dstLat");
  const dstLng = searchParams.get("dstLng");

  if (!srcLat || !srcLng || !dstLat || !dstLng) {
    return NextResponse.json({ error: "Missing coordinates" }, { status: 400 });
  }

  try {
    // OSRM is a free, open-source routing engine
    const url = `https://router.project-osrm.org/route/v1/driving/${srcLng},${srcLat};${dstLng},${dstLat}?overview=full&geometries=geojson&steps=true`;
    
    const res = await fetch(url);
    const data = await res.json();

    if (data.code !== "Ok" || !data.routes?.length) {
      return NextResponse.json({ error: "No route found" }, { status: 404 });
    }

    const route = data.routes[0];

    return NextResponse.json({
      coordinates: route.geometry.coordinates,
      distance: Math.round(route.distance / 1000 * 10) / 10, // km
      duration: Math.round(route.duration / 60), // minutes
      steps: route.legs[0]?.steps?.map((step: any) => ({
        instruction: step.maneuver?.type + (step.maneuver?.modifier ? ` ${step.maneuver.modifier}` : ""),
        distance: Math.round(step.distance),
        duration: Math.round(step.duration),
        name: step.name || "unnamed road",
      })) || [],
    });
  } catch {
    return NextResponse.json({ error: "Routing service unavailable" }, { status: 500 });
  }
}
