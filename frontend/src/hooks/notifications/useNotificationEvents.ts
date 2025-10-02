import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Notification } from "@/types/interfaces/interfaces";
import { ApiResponse } from "@/types/api/api.response";
import { useNotificationUtils } from "./notificationUtils";

export const useNotificationEvents = (userId: string) => {
  const queryClient = useQueryClient();
  const { invalidateQueriesByNotificationType } = useNotificationUtils();

  const handleNewNotification = useCallback((notification: Notification) => {
    console.log("New notification received:", notification);

    // Update notifications list
    queryClient.setQueryData(
      ["notifications", userId],
      (old: ApiResponse<Notification[]> | undefined) => {
        const currentData = old?.data || [];
        const exists = currentData.some((n) => n.id === notification.id);
        if (exists) return old;

        return {
          success: true,
          message: "Notifications updated",
          timestamp: new Date().toISOString(),
          data: [notification, ...currentData],
        };
      }
    );

    // Invalidate queries based on type
    invalidateQueriesByNotificationType(notification);

    // Show toast
    if (!notification.read) {
      toast.info(notification.message, {
        duration: 4000,
        action: {
          label: "Mark as read",
          onClick: () => {},
        },
      });
    }
  }, [queryClient, userId, invalidateQueriesByNotificationType]);

  const handleNotificationsDeleted = useCallback(({ count }: { count: number }) => {
    console.log("Notifications deleted via socket:", count);
    queryClient.invalidateQueries({ queryKey: ["notifications", userId] });
  }, [queryClient, userId]);

  const handleNotificationRead = useCallback((data: { notificationId: string }) => {
    console.log("Notification read via socket:", data.notificationId);
    queryClient.setQueryData(
      ["notifications", userId],
      (old: ApiResponse<Notification[]> | undefined) => {
        if (!old?.data) return old;
        return {
          ...old,
          data: old.data.map((notif) =>
            notif.id === data.notificationId ? { ...notif, read: true } : notif
          ),
        };
      }
    );
  }, [queryClient, userId]);

  const handleBulkNotificationsDeleted = useCallback((data: { count: number }) => {
    queryClient.invalidateQueries({ queryKey: ["notifications", userId] });
  }, [queryClient, userId]);

  return {
    handleNewNotification,
    handleNotificationsDeleted,
    handleNotificationRead,
    handleBulkNotificationsDeleted,
  };
};