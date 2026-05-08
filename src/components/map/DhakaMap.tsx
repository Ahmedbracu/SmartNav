"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface MapLocation {
  _id: string;
  name: string;
  latitude: number;
  longitude: number;
  area_zone: string;
}

interface Incident {
  _id: string;
  type: string;
  severity: string;
  status: string;
  location_name: string;
  latitude: number;
  longitude: number;
}

interface RouteGeometry {
  coordinates: [number, number][];
  source: MapLocation;
  destination: MapLocation;
  distance: number;
  duration: number;
}

interface DhakaMapProps {
  locations: MapLocation[];
  incidents?: Incident[];
  routeGeometry?: RouteGeometry | null;
  center?: [number, number];
  zoom?: number;
  height?: string;
  showLocations?: boolean;
  showIncidents?: boolean;
  onLocationClick?: (loc: MapLocation) => void;
}

export default function DhakaMap({
  locations,
  incidents = [],
  routeGeometry = null,
  center = [23.7806, 90.3964],
  zoom = 13,
  height = "500px",
  showLocations = true,
  showIncidents = true,
  onLocationClick,
}: DhakaMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const routeLayerRef = useRef<L.LayerGroup | null>(null);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center,
      zoom,
      zoomControl: false,
      attributionControl: false,
    });

    // Use a clean, Google-Maps-like tile layer
    L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
      maxZoom: 19,
      subdomains: "abcd",
    }).addTo(map);

    // Add zoom control to top-right (Google Maps style)
    L.control.zoom({ position: "topright" }).addTo(map);

    // Attribution bottom-right
    L.control.attribution({ position: "bottomright", prefix: "© OpenStreetMap" }).addTo(map);

    routeLayerRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;
    setMapReady(true);

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Add location markers
  useEffect(() => {
    if (!mapRef.current || !mapReady || !showLocations) return;

    const locationIcon = L.divIcon({
      className: "custom-marker",
      html: `<div style="
        width: 28px; height: 28px; border-radius: 50%;
        background: #1A73E8; border: 3px solid white;
        box-shadow: 0 2px 8px rgba(26,115,232,0.4);
        display: flex; align-items: center; justify-content: center;
      "><svg width="14" height="14" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3" fill="#1A73E8"/></svg></div>`,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
    });

    locations.forEach((loc) => {
      const marker = L.marker([loc.latitude, loc.longitude], { icon: locationIcon })
        .addTo(mapRef.current!)
        .bindPopup(
          `<div style="font-family:Inter,sans-serif;min-width:140px">
            <div style="font-weight:700;font-size:14px;color:#202124;margin-bottom:4px">${loc.name}</div>
            <div style="font-size:11px;color:#5F6368;text-transform:uppercase;letter-spacing:0.5px">${loc.area_zone}</div>
          </div>`,
          { className: "glass-popup" }
        );

      if (onLocationClick) {
        marker.on("click", () => onLocationClick(loc));
      }
    });
  }, [mapReady, locations, showLocations]);

  // Add incident markers
  useEffect(() => {
    if (!mapRef.current || !mapReady || !showIncidents) return;

    const severityColors: Record<string, string> = {
      High: "#D93025",
      Medium: "#F4B400",
      Low: "#188038",
    };

    const incidentIcons: Record<string, string> = {
      Accident: "🚗",
      Flood: "🌊",
      Protest: "✊",
      "Traffic Jam": "🚦",
      "Road Work": "🚧",
      "VIP Movement": "🚔",
      Other: "⚠️",
    };

    incidents
      .filter((inc) => inc.status === "Active")
      .forEach((inc) => {
        const color = severityColors[inc.severity] || "#D93025";
        const emoji = incidentIcons[inc.type] || "⚠️";

        const incidentIcon = L.divIcon({
          className: "incident-marker",
          html: `<div style="
            width: 36px; height: 36px; border-radius: 50%;
            background: ${color}; border: 3px solid white;
            box-shadow: 0 2px 12px ${color}66;
            display: flex; align-items: center; justify-content: center;
            font-size: 16px; animation: pulse 2s infinite;
          ">${emoji}</div>`,
          iconSize: [36, 36],
          iconAnchor: [18, 18],
        });

        L.marker([inc.latitude, inc.longitude], { icon: incidentIcon })
          .addTo(mapRef.current!)
          .bindPopup(
            `<div style="font-family:Inter,sans-serif;min-width:160px">
              <div style="font-weight:700;font-size:14px;color:${color};margin-bottom:4px">${emoji} ${inc.type}</div>
              <div style="font-size:12px;color:#202124;margin-bottom:2px">${inc.location_name}</div>
              <span style="
                display:inline-block;font-size:10px;font-weight:700;padding:2px 8px;border-radius:4px;
                background:${color}22;color:${color};text-transform:uppercase;
              ">${inc.severity} Severity</span>
            </div>`,
            { className: "glass-popup" }
          );
      });
  }, [mapReady, incidents, showIncidents]);

  // Draw route line
  useEffect(() => {
    if (!mapRef.current || !mapReady || !routeLayerRef.current) return;
    routeLayerRef.current.clearLayers();

    if (!routeGeometry) return;

    // Draw the route polyline
    const latLngs = routeGeometry.coordinates.map(
      (coord) => [coord[1], coord[0]] as [number, number]
    );

    // Shadow line (thicker, darker)
    L.polyline(latLngs, {
      color: "#1A73E8",
      weight: 8,
      opacity: 0.3,
      lineCap: "round",
      lineJoin: "round",
    }).addTo(routeLayerRef.current);

    // Main route line
    L.polyline(latLngs, {
      color: "#1A73E8",
      weight: 5,
      opacity: 1,
      lineCap: "round",
      lineJoin: "round",
    }).addTo(routeLayerRef.current);

    // Source marker (green)
    const startIcon = L.divIcon({
      className: "route-marker",
      html: `<div style="
        width: 20px; height: 20px; border-radius: 50%;
        background: #188038; border: 4px solid white;
        box-shadow: 0 2px 12px rgba(24,128,56,0.5);
      "></div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    });

    // Destination marker (red)
    const endIcon = L.divIcon({
      className: "route-marker",
      html: `<div style="
        width: 20px; height: 20px; border-radius: 50%;
        background: #D93025; border: 4px solid white;
        box-shadow: 0 2px 12px rgba(217,48,37,0.5);
      "></div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    });

    L.marker(
      [routeGeometry.source.latitude, routeGeometry.source.longitude],
      { icon: startIcon }
    )
      .addTo(routeLayerRef.current)
      .bindPopup(`<b style="color:#188038">Start:</b> ${routeGeometry.source.name}`);

    L.marker(
      [routeGeometry.destination.latitude, routeGeometry.destination.longitude],
      { icon: endIcon }
    )
      .addTo(routeLayerRef.current)
      .bindPopup(`<b style="color:#D93025">End:</b> ${routeGeometry.destination.name}`);

    // Fit map to route bounds
    mapRef.current.fitBounds(L.latLngBounds(latLngs), { padding: [60, 60] });
  }, [mapReady, routeGeometry]);

  return (
    <div className="relative rounded-2xl overflow-hidden border border-[#DADCE0]/60 shadow-[0_4px_24px_rgba(32,33,36,0.08)]" style={{ height }}>
      <div ref={mapContainerRef} className="w-full h-full" />
      <style jsx global>{`
        .glass-popup .leaflet-popup-content-wrapper {
          background: rgba(255, 255, 255, 0.92);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.9);
          box-shadow: 0 4px 24px rgba(32, 33, 36, 0.12);
          padding: 4px 8px;
        }
        .glass-popup .leaflet-popup-tip {
          background: rgba(255, 255, 255, 0.92);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.15); }
        }
        .leaflet-control-zoom a {
          background: rgba(255,255,255,0.9) !important;
          backdrop-filter: blur(12px) !important;
          border: 1px solid #DADCE0 !important;
          color: #202124 !important;
          width: 36px !important;
          height: 36px !important;
          line-height: 36px !important;
          font-size: 18px !important;
        }
        .leaflet-control-zoom {
          border: none !important;
          border-radius: 8px !important;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1) !important;
        }
      `}</style>
    </div>
  );
}
