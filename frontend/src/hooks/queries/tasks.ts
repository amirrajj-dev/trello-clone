import { userApi } from "@/utils/api";
import api from "@/utils/axios";
import { useQuery } from "@tanstack/react-query";

export const useGetUserTasks = () => {
  return useQuery({
    queryKey: ["user-tasks"],
    queryFn: () => userApi.getTasks(api)
  });
};
