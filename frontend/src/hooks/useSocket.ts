import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useUser } from '@clerk/clerk-react';

export const useSocket = () => {
  const { user } = useUser();
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!user) return;

    const socket = io('http://localhost:5000', {
      transports: ['websocket', 'polling'],
      withCredentials: true,
      auth: {
        userId: user.id
      },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
    };
  }, [user]);

  return socketRef.current;
}; 