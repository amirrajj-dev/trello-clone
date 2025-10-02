import { notificationApi } from "@/utils/api";
import api from "@/utils/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useMarkAsRead = (userId : string) => {
    const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (notificationId: string) =>
      notificationApi.markAsRead(api, notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications", userId] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to mark notification as read");
    },
  });
};
