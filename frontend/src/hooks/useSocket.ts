import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useUser } from '@clerk/clerk-react';

const BASE_URL = import.meta.env.MODE === 'development' 
  ? 'http://localhost:5000'
  : 'https://spotify-backend-3i89idi.onrender.com';  // Replace with your actual backend URL

export const useSocket = () => {
  const { user } = useUser();
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!user) return;

    const socket = io(BASE_URL, {
      transports: ['websocket', 'polling'],
      withCredentials: true,
      auth: {
        userId: user.id
      },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5
    });

    socket.on('connect', () => {
      console.log('Socket connected successfully');
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error.message);
    });

    socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
    });

    socketRef.current = socket;

    return () => {
      if (socket) {
        socket.disconnect();
        socketRef.current = null;
      }
    };
  }, [user]);

  return socketRef.current;
}; 