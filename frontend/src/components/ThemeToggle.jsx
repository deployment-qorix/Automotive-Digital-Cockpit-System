import { useEffect, useState } from "react";
import { FaMoon, FaSun } from "react-icons/fa";

export default function ThemeToggle() {
  const [mode, setMode] = useState(() => localStorage.getItem("theme") || "dark");

  useEffect(() => {
    const root = document.documentElement;
    if (mode === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", mode);
  }, [mode]);

  return (
    <button
      onClick={() => setMode((m) => (m === "dark" ? "light" : "dark"))}
      className="relative flex items-center bg-white/10 backdrop-blur-lg rounded-full p-1 w-16 h-8 transition"
    >
      {/* Sliding circle */}
      <div
        className={`absolute top-1 left-1 w-6 h-6 rounded-full transition-all duration-300 flex items-center justify-center ${
          mode === "dark" ? "translate-x-0 bg-gray-800" : "translate-x-8 bg-yellow-400"
        }`}
      >
        {mode === "dark" ? (
          <FaMoon className="text-white text-xs" />
        ) : (
          <FaSun className="text-white text-xs" />
        )}
      </div>
      {/* Invisible spacer for flex */}
      <div className="flex-1" />
    </button>
  );
}
