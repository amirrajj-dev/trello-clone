import { projectApi } from "@/utils/api";
import api from "@/utils/axios";
import { useQuery } from "@tanstack/react-query";

export const useGetProject = (projectId : string) => {
  return useQuery({
    queryKey: ["project",projectId],
    queryFn: () => projectApi.getProject(api , projectId),
  });
};
