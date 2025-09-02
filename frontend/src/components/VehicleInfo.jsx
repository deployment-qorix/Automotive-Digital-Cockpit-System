import { useEffect, useState } from "react";
import { FaExclamationTriangle } from "react-icons/fa";
import { motion, animate } from "framer-motion";

export default function VehicleInfo() {
  const [speed, setSpeed] = useState(0);
  const [displaySpeed, setDisplaySpeed] = useState(0);
  const [fuel, setFuel] = useState(72);
  const [temp, setTemp] = useState(78);

  useEffect(() => {
    const id = setInterval(() => {
      const newSpeed = Math.max(0, Math.min(160, Math.round(speed + (Math.random() - 0.45) * 6)));
      setSpeed(newSpeed);
      setFuel((f) => Math.max(0, f - Math.random() * 0.05));
      setTemp((t) => Math.max(50, Math.min(110, Math.round(t + (Math.random() - 0.5) * 1))));
    }, 1500);
    return () => clearInterval(id);
  }, [speed]);

  // Smoothly animate displaySpeed towards speed
  useEffect(() => {
    const controls = animate(displaySpeed, speed, {
      duration: 0.6,
      onUpdate: (v) => setDisplaySpeed(Math.round(v)),
    });
    return () => controls.stop();
  }, [speed]);

  const lowFuel = fuel < 15;
  const highTemp = temp > 100;

  return (
    <div className="bg-panel p-5 rounded-2xl shadow-xl text-surface-foreground backdrop-blur-md border border-white/10">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold tracking-wide">Vehicle Status</h3>
        <div className="flex gap-3 items-center">
          {lowFuel && (
            <motion.div
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
              className="flex items-center gap-1 text-yellow-300 drop-shadow-[0_0_6px_rgba(250,204,21,0.8)]"
            >
              <FaExclamationTriangle /> Low Fuel
            </motion.div>
          )}
          {highTemp && (
            <motion.div
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
              className="flex items-center gap-1 text-red-400 drop-shadow-[0_0_6px_rgba(239,68,68,0.8)]"
            >
              <FaExclamationTriangle /> High Temp
            </motion.div>
          )}
        </div>
      </div>

      {/* Speedometer */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col items-center">
          <div className="relative w-28 h-28 rounded-full border-4 border-teal-500 shadow-[0_0_20px_rgba(20,184,166,0.6)] flex items-center justify-center">
            <motion.span
              key={displaySpeed}
              initial={{ opacity: 0.3, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="text-3xl font-bold"
            >
              {displaySpeed}
            </motion.span>
            <span className="absolute bottom-3 text-sm opacity-80">km/h</span>
          </div>
          <div className="mt-2 text-xs opacity-70">Speed</div>
        </div>

        {/* Engine Temp */}
        <div className="text-center">
          <div className="text-sm opacity-70">Engine Temp</div>
          <div
            className={`text-xl font-semibold ${
              highTemp ? "text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.7)]" : "text-teal-400"
            }`}
          >
            {temp}°C
          </div>
        </div>
      </div>

      {/* Fuel Bar */}
      <div className="mt-5">
        <div className="text-xs opacity-70 mb-1">Fuel Level</div>
        <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden shadow-inner">
          <motion.div
            animate={{ width: `${Math.round(fuel)}%` }}
            transition={{ duration: 0.6 }}
            className="h-3 rounded-full"
            style={{
              background:
                fuel > 50
                  ? "linear-gradient(90deg, #10b981, #34d399)"
                  : fuel > 25
                  ? "linear-gradient(90deg, #f59e0b, #fbbf24)"
                  : "linear-gradient(90deg, #ef4444, #f87171)",
            }}
          />
        </div>
        <div className="mt-1 text-xs opacity-70">{Math.round(fuel)}%</div>
      </div>
    </div>
  );
}
