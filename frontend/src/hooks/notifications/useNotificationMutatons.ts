import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Notification } from "@/types/interfaces/interfaces";
import { ApiResponse } from "@/types/api/api.response";
import { useMarkAsRead } from "../mutations/mark-as-read";
import { useDeleteReadNotifcations } from "../mutations/delete-read-notifications";

export const useNotificationMutations = (userId: string, socket: any) => {
  const queryClient = useQueryClient();
  const markAsReadMutation = useMarkAsRead(userId);
  const deleteReadNotificationsMutation = useDeleteReadNotifcations(userId);

  const markAsRead = useCallback((notificationId: string) => {
    console.log("Marking notification as read:", notificationId);

    // Optimistic update
    queryClient.setQueryData(
      ["notifications", userId],
      (old: ApiResponse<Notification[]> | undefined) => {
        if (!old?.data) return old;
        return {
          ...old,
          data: old.data.map((notif) =>
            notif.id === notificationId ? { ...notif, read: true } : notif
          ),
        };
      }
    );

    // Send HTTP request
    markAsReadMutation.mutate(notificationId);

    // Send WebSocket acknowledgment
    if (socket) {
      socket.emit("notification_ack", { notificationId });
      socket.emit("mark_notification_read", { notificationId });
    }
  }, [markAsReadMutation, queryClient, userId, socket]);

  const deleteReadNotifications = useCallback((notifications: Notification[]) => {
    console.log("Deleting read notifications");

    const readCount = notifications.filter((n: Notification) => n.read).length;
    if (readCount === 0) {
      toast.info("No read notifications to clear");
      return;
    }

    // Optimistic update
    queryClient.setQueryData(
      ["notifications", userId],
      (old: ApiResponse<Notification[]> | undefined) => {
        if (!old?.data) return old;
        return {
          ...old,
          data: old.data.filter((notif) => !notif.read),
        };
      }
    );

    // Send HTTP request
    deleteReadNotificationsMutation.mutate();

    // Send WebSocket event
    if (socket) {
      socket.emit("delete_seen_notifications", { userId });
    }

    toast.success(`Cleared ${readCount} read notifications`);
  }, [deleteReadNotificationsMutation, userId, queryClient, socket]);

  return {
    markAsRead,
    deleteReadNotifications,
    isMarkingAsRead: markAsReadMutation.isPending,
    isDeletingRead: deleteReadNotificationsMutation.isPending,
  };
};