"use client";
import React, { createContext, useContext, useEffect, useState, ReactNode, useRef } from 'react';
import { initializeSocket } from '@/utils/socket';
import { useGetMe } from '@/hooks/queries/user';

interface SocketContextType {
  isConnected: boolean;
  socket: any | null;
  hasNotificationBeenShown: (id: string) => boolean;
  markNotificationAsShown: (id: string) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState<any>(null);
  const {data : user} = useGetMe()
  const shownNotificationIds = useRef(new Set<string>());

  const hasNotificationBeenShown = (id: string) => {
    return shownNotificationIds.current.has(id);
  };

  const markNotificationAsShown = (id: string) => {
    shownNotificationIds.current.add(id);
    
    // Clean up old IDs to prevent memory leaks
    if (shownNotificationIds.current.size > 100) {
      const firstId = shownNotificationIds.current.values().next().value;
      shownNotificationIds.current.delete(firstId as string);
    }
  };

  useEffect(() => {
    if (!user?.id) return;

    const socketInstance = initializeSocket(user?.id);
    setSocket(socketInstance);

    const handleConnect = () => {
      console.log("✅ Socket connected");
      setIsConnected(true);
    };

    const handleDisconnect = (reason: string) => {
      console.log("❌ Socket disconnected:", reason);
      setIsConnected(false);
    };

    const handleConnectError = (error: Error) => {
      console.error("❌ Socket connection error:", error);
      setIsConnected(false);
    };

    socketInstance.on('connect', handleConnect);
    socketInstance.on('disconnect', handleDisconnect);
    socketInstance.on('connect_error', handleConnectError);

    // Check initial connection state
    if (socketInstance.connected) {
      setIsConnected(true);
    }

    return () => {
      socketInstance.off('connect', handleConnect);
      socketInstance.off('disconnect', handleDisconnect);
      socketInstance.off('connect_error', handleConnectError);
    };
  }, [user?.id]);

  return (
    <SocketContext.Provider value={{ isConnected, socket , hasNotificationBeenShown , markNotificationAsShown }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};