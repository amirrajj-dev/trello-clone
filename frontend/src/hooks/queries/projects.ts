import { User } from "@/types/interfaces/interfaces";
import { projectApi } from "@/utils/api";
import api from "@/utils/axios";
import { useQuery } from "@tanstack/react-query";

export const useGetProjects = () => {
  return useQuery({
    queryKey: ["user-projects"],
    queryFn: () => projectApi.getProjects(api).then(response=>response)
  });
};
