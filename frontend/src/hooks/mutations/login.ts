import { setCookie } from "@/helpers/set-cookie";
import { authApi } from "@/utils/api";
import api from "@/utils/axios";
import { LoginUserDto } from "@/utils/dtos";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useLogin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (user: LoginUserDto) => {
      const response = await authApi.login(api, user);
      return response.data;
    },
    onSuccess: async (response) => {
      const { access_token } = response;
      // Set cookie with 30-day expiry
      await setCookie(
        access_token,
        30 * 24 * 60 * 60
      );
      await queryClient.invalidateQueries({ queryKey: ["user", "me"] });
    },
  });
};
