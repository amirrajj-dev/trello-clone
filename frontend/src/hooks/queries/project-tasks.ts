import { taskApi } from "@/utils/api";
import api from "@/utils/axios";
import { useQuery } from "@tanstack/react-query";

export const useGetProjectTasks = (projectId: string , projectData : any) => {
  return useQuery({
    queryKey: ["tasks", projectId],
    queryFn: () => taskApi.getTasks(api, projectId),
    enabled: !!projectData?.data,
  });
};
