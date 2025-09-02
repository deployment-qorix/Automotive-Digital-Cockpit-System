import { io } from 'socket.io-client';

// The URL of your backend server
const SOCKET_URL = 'http://localhost:3000';

// Create the socket connection
export const socket = io(SOCKET_URL);

// You can also create wrapper functions for cleanliness
export const sendMessage = (message) => {
  socket.emit('message', message);
};
export const sendMediaUpdate = (state) => {
  socket.emit('mediaControl', state);
};

export const sendClimateUpdate = (data) => {
  socket.emit('climateChange', data);
};
