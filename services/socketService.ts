import { io, Socket } from 'socket.io-client';

// Get socket URL from environment variables
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';

let socket: Socket | null = null;

/**
 * Initialize socket connection with authentication
 */
export const initializeSocket = (): Socket => {
  if (socket) {
    return socket;
  }

  // Get stored access token
  const token = localStorage.getItem('accessToken');

  // Create socket connection
  socket = io(SOCKET_URL, {
    auth: {
      token: token || undefined
    },
    autoConnect: true,
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5,
    transports: ['websocket', 'polling']
  });

  // Connection event handlers
  socket.on('connect', () => {
    console.log('✅ Connected to backend server');
  });

  socket.on('disconnect', (reason) => {
    console.log('❌ Disconnected from backend server:', reason);
  });

  socket.on('connect_error', (error) => {
    console.error('⚠️ Connection error:', error.message);
    
    // If authentication error, try to refresh token
    if (error.message === 'Authentication error') {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken && socket) {
        socket.emit('auth:refresh', { refreshToken }, (response: any) => {
          if (response.ok) {
            localStorage.setItem('accessToken', response.token);
            localStorage.setItem('refreshToken', response.refreshToken);
            // Reconnect with new token
            socket!.auth = { token: response.token };
            socket!.connect();
          } else {
            console.error('Token refresh failed:', response.error);
            // Redirect to login or clear tokens
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
          }
        });
      }
    }
  });

  return socket;
};

/**
 * Get the current socket instance
 */
export const getSocket = (): Socket => {
  if (!socket) {
    return initializeSocket();
  }
  return socket;
};

/**
 * Disconnect socket
 */
export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

/**
 * Update socket authentication token
 */
export const updateSocketAuth = (token: string): void => {
  if (socket) {
    socket.auth = { token };
  }
};

export default {
  initializeSocket,
  getSocket,
  disconnectSocket,
  updateSocketAuth
};
