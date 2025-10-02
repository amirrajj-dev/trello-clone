import { useEffect, useState, useRef } from "react";
import { useSocket } from "@/contexts/socket-context";
import { useGetUserNotifications } from "../queries/notifications";
import { useNotificationEvents } from "./useNotificationEvents";
import { useNotificationMutations } from "./useNotificationMutatons";
import { Notification } from "@/types/interfaces/interfaces";

export const useNotifications = (userId: string) => {
  const { isConnected, socket } = useSocket();
  const [unreadCount, setUnreadCount] = useState(0);
  const previousNotificationsRef = useRef<Notification[]>([]);

  // Queries
  const {
    data: notificationsData,
    refetch: refetchNotifications,
    isLoading,
    error,
  } = useGetUserNotifications(userId);

  const notifications = notificationsData?.data || [];

  // Events
  const {
    handleNewNotification,
    handleNotificationsDeleted,
    handleNotificationRead,
    handleBulkNotificationsDeleted,
  } = useNotificationEvents(userId);

  // Mutations
  const {
    markAsRead,
    deleteReadNotifications,
    isMarkingAsRead,
    isDeletingRead,
  } = useNotificationMutations(userId, socket);

  // Update unread count
  useEffect(() => {
    if (!notifications || !Array.isArray(notifications)) {
      setUnreadCount(0);
      previousNotificationsRef.current = [];
      return;
    }

    const currentNotifications = JSON.stringify(notifications);
    const previousNotifications = JSON.stringify(previousNotificationsRef.current);

    if (currentNotifications !== previousNotifications) {
      const count = notifications.filter((n: Notification) => !n.read).length;
      console.log("Updating unread count:", count);
      setUnreadCount(count);
      previousNotificationsRef.current = notifications;
    }
  }, [notifications]);

  // WebSocket event listeners
  useEffect(() => {
    if (!socket || !userId) return;

    console.log("Setting up notification event listeners");

    socket.on("notification", handleNewNotification);
    socket.on("notifications_deleted", handleNotificationsDeleted);
    socket.on("notification.read", handleNotificationRead);
    socket.on("notifications.deleted", handleBulkNotificationsDeleted);

    return () => {
      console.log("Cleaning up notification event listeners");
      socket.off("notification", handleNewNotification);
      socket.off("notifications_deleted", handleNotificationsDeleted);
      socket.off("notification.read", handleNotificationRead);
      socket.off("notifications.deleted", handleBulkNotificationsDeleted);
    };
  }, [
    socket,
    userId,
    handleNewNotification,
    handleNotificationsDeleted,
    handleNotificationRead,
    handleBulkNotificationsDeleted
  ]);

  return {
    notifications,
    unreadCount,
    isLoading,
    isConnected,
    error,
    markAsRead,
    deleteReadNotifications: () => deleteReadNotifications(notifications),
    refreshNotifications: refetchNotifications,
    isMarkingAsRead,
    isDeletingRead,
  };
};