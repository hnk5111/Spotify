import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useUser } from '@clerk/clerk-react';

// Since frontend is served from backend, we can use relative URL
const SOCKET_URL = import.meta.env.MODE === 'development' 
  ? 'http://localhost:5000'
  : ''; // Empty string means it will use the same URL as the page

export const useSocket = () => {
  const { user } = useUser();
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!user) return;

    try {
      const socket = io(SOCKET_URL, {
        transports: ['polling', 'websocket'],
        withCredentials: true,
        auth: {
          userId: user.id
        },
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5,
        timeout: 20000,
        path: '/socket.io/'
      });

      socket.on('connect', () => {
        console.log('✅ Socket connected successfully on:', window.location.origin);
      });

      socket.on('connect_error', (error) => {
        console.error('❌ Socket connection error:', error.message);
        // Try polling if websocket fails
        if (socket.io.engine.transport.name === 'websocket') {
          console.log('⚠️ Falling back to polling transport');
          socket.io.opts.transports = ['polling'];
          socket.connect();
        }
      });

      socket.on('disconnect', (reason) => {
        console.log('⚠️ Socket disconnected:', reason);
        if (reason === 'io server disconnect' || reason === 'transport error') {
          socket.connect();
        }
      });

      socketRef.current = socket;

      return () => {
        if (socket) {
          socket.removeAllListeners();
          socket.close();
          socketRef.current = null;
        }
      };
    } catch (error) {
      console.error('❌ Socket initialization error:', error);
    }
  }, [user]);

  return socketRef.current;
}; 