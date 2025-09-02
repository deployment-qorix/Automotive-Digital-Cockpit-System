import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { motion, AnimatePresence } from "framer-motion";
import { FaHome, FaBriefcase, FaShoppingCart, FaLocationArrow, FaTimes } from "react-icons/fa";

// --- Configuration ---
// You can get a free API key from maptiler.com for better, high-res map tiles
const MAPTILER_API_KEY = "YOUR_MAPTILER_API_KEY"; // Replace with your key or leave as is for a good default map
const TILE_URL = MAPTILER_API_KEY !== "YOUR_MAPTILER_API_KEY"
  ? `https://api.maptiler.com/maps/streets-v2-dark/{z}/{x}/{y}.png?key=${MAPTILER_API_KEY}`
  : "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";

const ATTRIBUTION = MAPTILER_API_KEY !== "YOUR_MAPTILER_API_KEY"
  ? '&copy; <a href="https://www.maptiler.com/copyright/" target="_blank">MapTiler</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>'
  : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>';

const DEMO_COORD = [12.9716, 77.5946]; // Default: Bengaluru

// --- Helper Functions ---
const formatTime = (seconds) => {
  if (isNaN(seconds)) return "0 min";
  const minutes = Math.round(seconds / 60);
  return `${minutes} min`;
};

const formatDistance = (meters) => {
  if (isNaN(meters)) return "0 km";
  const kilometers = (meters / 1000).toFixed(1);
  return `${kilometers} km`;
};

// --- Component ---
export default function Navigation() {
  // --- Refs for map elements ---
  const mapRef = useRef(null);
  const carMarkerRef = useRef(null);
  const routeLayerRef = useRef(null);

  // --- State Management ---
  const [position, setPosition] = useState(DEMO_COORD);
  const [isRouting, setIsRouting] = useState(false);
  const [routeDetails, setRouteDetails] = useState(null); // Holds ETA, distance, steps

  const DESTINATIONS = [
    { name: "Home", coords: [12.9352, 77.6245], icon: <FaHome /> }, // Koramangala
    { name: "Work", coords: [12.9784, 77.5918], icon: <FaBriefcase /> }, // Cubbon Park Area
    { name: "Mall", coords: [12.9719, 77.6371], icon: <FaShoppingCart /> }, // Indiranagar
  ];

  // --- Map Initialization Effect ---
  useEffect(() => {
    if (mapRef.current) return; // Initialize map only once

    mapRef.current = L.map("map", { zoomControl: false }).setView(position, 14);
    L.tileLayer(TILE_URL, { attribution: ATTRIBUTION, maxZoom: 20 }).addTo(mapRef.current);

    // Use a sleek SVG for the car icon for better quality and styling
    const carIcon = L.divIcon({
      className: "car-marker",
      html: `<svg class="w-10 h-10 text-cyan-400 drop-shadow-lg" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.428A1 1 0 0010 16.57l5.318 1.518a1 1 0 001.17-1.409l-7-14z"></path></svg>`,
      iconSize: [40, 40],
      iconAnchor: [20, 20],
    });

    carMarkerRef.current = L.marker(position, { icon: carIcon, zIndexOffset: 1000 }).addTo(mapRef.current);
  }, []);

  // --- Geolocation & Simulation Effect ---
  useEffect(() => {
    // NOTE: Your existing geolocation/simulation logic can be pasted here.
    // It should update the 'position' state and rotate the car icon.
    // For this demo, we'll just keep the car static.
  }, []);

  // --- Routing Logic ---
  const goTo = async (dest) => {
    if (!mapRef.current || isRouting) return;
    setIsRouting(true);
    setRouteDetails(null);

    const src = `${position[1]},${position[0]}`;
    const dst = `${dest.coords[1]},${dest.coords[0]}`;
    // Request turn-by-turn steps from the routing engine
    const url = `https://router.project-osrm.org/route/v1/driving/${src};${dst}?overview=full&geometries=geojson&steps=true`;

    try {
      const res = await fetch(url);
      const data = await res.json();
      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        setRouteDetails(route.legs[0]); // Store distance, duration, and steps

        const latlon = route.geometry.coordinates.map((c) => [c[1], c[0]]);
        if (routeLayerRef.current) mapRef.current.removeLayer(routeLayerRef.current);

        // Style the route line to be more prominent
        routeLayerRef.current = L.polyline(latlon, { color: "#0ea5e9", weight: 7, opacity: 0.8 }).addTo(mapRef.current);
        mapRef.current.fitBounds(routeLayerRef.current.getBounds(), { padding: [50, 50] });
      }
    } catch (e) {
      console.error("Routing failed:", e);
      alert("Could not fetch the route. Please try again.");
    } finally {
      setIsRouting(false);
    }
  };

  const cancelRoute = () => {
    setRouteDetails(null);
    if (routeLayerRef.current) {
      mapRef.current.removeLayer(routeLayerRef.current);
      routeLayerRef.current = null;
    }
    mapRef.current.setView(position, 14);
  };

  return (
    <div className="w-full h-full bg-zinc-900 rounded-2xl shadow-lg relative overflow-hidden">
      <div id="map" className="w-full h-full" />
      
      {/* Loading Spinner Overlay */}
      <AnimatePresence>
        {isRouting && !routeDetails && (
          <motion.div
            className="absolute inset-0 bg-black/60 flex items-center justify-center z-[1001]"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <div className="w-12 h-12 border-4 border-t-cyan-400 border-zinc-700 rounded-full animate-spin"></div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom UI Panel */}
      <div className="absolute bottom-0 left-0 right-0 p-4 z-[1000]">
        <AnimatePresence mode="wait">
          {!routeDetails ? (
            // --- Destination Selection View ---
            <motion.div
              key="destinations"
              className="bg-zinc-800/80 backdrop-blur-md rounded-xl p-4 flex justify-around items-center shadow-2xl"
              initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }}
            >
              {DESTINATIONS.map((d) => (
                <div key={d.name} onClick={() => goTo(d)} className="flex flex-col items-center gap-2 text-white cursor-pointer hover:text-cyan-400 transition-colors">
                  <div className="text-3xl">{d.icon}</div>
                  <span className="font-semibold text-sm">{d.name}</span>
                </div>
              ))}
            </motion.div>
          ) : (
            // --- Active Navigation View ---
            <motion.div
              key="navigation"
              className="bg-zinc-800/80 backdrop-blur-md rounded-xl p-4 text-white shadow-2xl"
              initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-cyan-400">{formatTime(routeDetails.duration)}</h3>
                  <p className="text-sm text-gray-400">{formatDistance(routeDetails.distance)}</p>
                </div>
                <button onClick={cancelRoute} className="p-3 bg-zinc-700 hover:bg-red-600/80 rounded-full transition-colors">
                  <FaTimes />
                </button>
              </div>
              <div className="border-t border-zinc-700 my-3"></div>
              <div className="flex items-center gap-4">
                <FaLocationArrow className="text-3xl text-cyan-400" />
                <p className="font-semibold text-lg flex-1">
                  {routeDetails.steps[0]?.maneuver.instruction || "Arrive at destination"}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
