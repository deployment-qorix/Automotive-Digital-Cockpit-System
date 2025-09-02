import React, { useState, useEffect } from 'react';
import { socket, sendMessage } from './socket'; // Import from your new socket file

import Navigation from "./components/Navigation";
import VehicleInfo from "./components/VehicleInfo";
import MediaPlayer from "./components/MediaPlayer";
import ClimateControl from "./components/ClimateControl";
import ThemeToggle from "./components/ThemeToggle";

export default function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [lastMessage, setLastMessage] = useState(null);

  useEffect(() => {
    // Function to handle connection event
    function onConnect() {
      console.log('Frontend connected to server!');
      setIsConnected(true);
    }

    // Function to handle disconnection event
    function onDisconnect() {
      console.log('Frontend disconnected from server!');
      setIsConnected(false);
    }

    // Function to handle incoming messages
    function onMessage(data) {
      console.log('Message received from server:', data);
      setLastMessage(data);
    }

    // Add event listeners
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('message', onMessage);

    // Cleanup function to remove listeners when the component unmounts
    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('message', onMessage);
    };
  }, []);

  // A simple function to test sending a message
  const handleTestMessage = () => {
    sendMessage({ text: "Hello from the frontend!", timestamp: new Date() });
  };

  return (
    <div className="min-h-screen w-full bg-[#0B0F19] font-sans text-gray-200">
      <div className="mx-auto max-w-7xl p-4 md:p-6">
        {/* Connection Status Indicator */}
        <div className="mb-4 rounded-lg bg-[#1C2135]/50 p-3 text-center">
          <p>Connection Status: {isConnected ? '✅ Connected' : '❌ Disconnected'}</p>
          <button onClick={handleTestMessage} className="mt-2 rounded bg-blue-500 px-4 py-1 text-white">
            Send Test Message
          </button>
          {lastMessage && <p className="mt-2 text-sm text-gray-400">Last message received: {lastMessage.text}</p>}
        </div>

        {/* Your existing grid layout... */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
          <div className="rounded-xl border border-white/10 bg-[#1C2135]/50 p-6 shadow-lg backdrop-blur-sm">
            <VehicleInfo />
            <div className="mt-6 border-t border-white/10 pt-4">
              <ThemeToggle />
            </div>
          </div>
          {/* ...other components */}
          <div className="rounded-xl border border-white/10 bg-[#1C2135]/50 p-6 shadow-lg backdrop-blur-sm">
            <Navigation />
          </div>
          <div className="rounded-xl border border-white/10 bg-[#1C2135]/50 p-6 shadow-lg backdrop-blur-sm">
            <MediaPlayer />
          </div>
          <div className="rounded-xl border border-white/10 bg-[#1C2135]/50 p-6 shadow-lg backdrop-blur-sm">
            <ClimateControl />
          </div>
        </div>
      </div>
    </div>
  );
}