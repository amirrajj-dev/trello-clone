import { notificationApi } from "@/utils/api";
import api from "@/utils/axios";
import { useQuery } from "@tanstack/react-query";

export const useGetUserNotifications = (userId : string) => {
  return useQuery({
    queryKey: ["notifications", userId],
    queryFn: () => notificationApi.getUserNotifications(api, userId),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 min
  });
};
