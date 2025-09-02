import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "leaflet/dist/leaflet.css";

// Render App
createRoot(document.getElementById("root")).render(
  // Remove StrictMode if you want smoother map/data updates in dev
  //<React.StrictMode>
    <App />
  //</React.StrictMode>
);
