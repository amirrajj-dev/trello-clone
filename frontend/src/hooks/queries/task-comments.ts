import { commentApi, projectApi } from "@/utils/api";
import api from "@/utils/axios";
import { useQuery } from "@tanstack/react-query";

export const useGetTaskComments = (taskId: string, projectId: string) => {
  return useQuery({
    queryKey: ["comments", taskId],
    queryFn: () => commentApi.getComments(api, projectId, taskId),
  });
};
