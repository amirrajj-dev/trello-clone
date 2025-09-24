import { userApi } from "@/utils/api";
import api from "@/utils/axios";
import { useQuery } from "@tanstack/react-query";

export const useGetMe = () => {
  return useQuery({
    queryKey: ["user", "me"],
    queryFn: async () => {
      const response = await userApi.getMe(api)
      return response.data
    },
  });
};
