import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaFan, FaSnowflake, FaLeaf } from "react-icons/fa";
// Import the socket connection and sender function
import { socket, sendClimateUpdate } from "../socket";

export default function ClimateControl() {
  // 1. Combine state into a single object for easier management
  const [climateState, setClimateState] = useState({
    temp: 22,
    fan: 3,
    mode: "Auto",
  });

  // 2. This useEffect hook LISTENS for incoming updates from the server
  useEffect(() => {
    const handleClimateUpdate = (data) => {
      console.log("Received climate update from server:", data);
      setClimateState(data);
    };

    socket.on('climateChange', handleClimateUpdate);

    // Cleanup the listener when the component unmounts
    return () => {
      socket.off('climateChange', handleClimateUpdate);
    };
  }, []); // Empty dependency array means this runs only once on mount

  // 3. This useEffect hook SENDS updates to the server whenever our state changes
  useEffect(() => {
    // We send the entire state object to the server
    sendClimateUpdate(climateState);
  }, [climateState]); // The dependency array ensures this runs anytime climateState changes

  // Helper function to update a part of the state
  const handleStateChange = (field, value) => {
    setClimateState(prevState => ({
      ...prevState,
      [field]: value,
    }));
  };

  const modeIcons = {
    Auto: <FaFan />,
    Eco: <FaLeaf />,
    "Max AC": <FaSnowflake />,
  };

  return (
    <motion.div
      className="bg-panel p-4 rounded-2xl shadow-lg text-surface-foreground space-y-4"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Climate Control</h2>
        <div className="flex items-center gap-2 text-sm opacity-80">
          {modeIcons[climateState.mode]} {climateState.mode}
        </div>
      </div>

      {/* Temperature */}
      <div>
        <div className="flex justify-between mb-1 text-sm opacity-80">
          <span>Temperature</span>
          <span>{climateState.temp}°C</span>
        </div>
        <motion.input
          type="range"
          min="16"
          max="30"
          value={climateState.temp}
          onChange={(e) => handleStateChange('temp', Number(e.target.value))}
          className="w-full accent-teal-500"
          whileTap={{ scale: 1.05 }}
        />
      </div>

      {/* Fan */}
      <div>
        <div className="flex justify-between mb-1 text-sm opacity-80">
          <span>Fan Speed</span>
          <span>{climateState.fan}</span>
        </div>
        <motion.input
          type="range"
          min="1"
          max="5"
          value={climateState.fan}
          onChange={(e) => handleStateChange('fan', Number(e.target.value))}
          className="w-full accent-indigo-500"
          whileTap={{ scale: 1.05 }}
        />
      </div>

      {/* Modes */}
      <div className="flex gap-2">
        {["Auto", "Eco", "Max AC"].map((m) => (
          <motion.button
            key={m}
            onClick={() => handleStateChange('mode', m)}
            className={`flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg text-sm transition-all ${
              climateState.mode === m
                ? "bg-indigo-600 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {modeIcons[m]} {m}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}