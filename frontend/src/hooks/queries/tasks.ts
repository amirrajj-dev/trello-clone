import { User } from "@/types/interfaces/interfaces";
import { userApi } from "@/utils/api";
import api from "@/utils/axios";
import { useQuery } from "@tanstack/react-query";

export const getUserTasks = () => {
  return useQuery({
    queryKey: ["user-tasks"],
    queryFn: () => userApi.getTasks(api)
  });
};
