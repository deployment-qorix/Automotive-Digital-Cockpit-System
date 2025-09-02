// --- 1. Dependencies ---
const express = require('express');
const http = require('http');
const { Server } = require("socket.io"); // Using destructuring is a common modern practice

// --- 2. Configuration ---
// It's good practice to define configuration variables at the top.
const PORT = 3000;
const CLIENT_ORIGIN = "http://localhost:5173";

// --- 3. Server Setup ---
const app = express();
const server = http.createServer(app);

// --- 4. Socket.IO Initialization with CORS ---
// The global app.use(cors()) is not needed because we are defining
// a more specific CORS policy directly for Socket.IO here.
const io = new Server(server, {
  cors: {
    origin: CLIENT_ORIGIN,
    methods: ["GET", "POST"]
  }
});

// --- 5. Real-Time Application Logic ---
io.on('connection', (socket) => {
    console.log(`✅ User Connected: ${socket.id}`);

    // Handles generic text messages
    socket.on('message', (data) => {
        console.log(`✉️  Message from ${socket.id}:`, data);
        // Broadcast to all OTHER clients
        socket.broadcast.emit('message', data);
    });
    
    // Handles climate control state synchronization
    socket.on('climateChange', (climateData) => {
        console.log(`☀️  Climate update from ${socket.id}:`, climateData);
        // Broadcast to EVERY client, including the sender
        io.emit('climateChange', climateData);
    });
    
    // Handles media player state synchronization
    socket.on('mediaControl', (mediaState) => {
        console.log(`🎵 Media update from ${socket.id}:`, mediaState);
        // Broadcast to EVERY client, including the sender
        io.emit('mediaControl', mediaState);
    });

    // Handles the disconnection event for this specific socket
    socket.on('disconnect', () => {
        console.log(`❌ User Disconnected: ${socket.id}`);
    });
});

// --- 6. Start the Server ---
server.listen(PORT, () => {
    console.log(`🚀 Server is live and listening on http://localhost:${PORT}`);
});