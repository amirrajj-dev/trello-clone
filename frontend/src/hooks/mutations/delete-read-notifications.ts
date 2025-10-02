import { notificationApi } from "@/utils/api";
import api from "@/utils/axios";
import queryClient from "@/utils/queryClient";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useDeleteReadNotifcations = (userId : string)=>{
    return useMutation({
    mutationFn: () => notificationApi.deleteReadNotifications(api),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["notifications", userId] });
      toast.success(data.message || "Read notifications deleted");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete read notifications");
    },
  })
}