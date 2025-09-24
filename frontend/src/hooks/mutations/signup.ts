import { setCookie } from "@/helpers/set-cookie";
import { authApi } from "@/utils/api";
import api from "@/utils/axios";
import { SignUpUserDto } from "@/utils/dtos";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useSignup = () => {
    const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (user: SignUpUserDto) => {
      const response = await authApi.signup(api, user)
      return response.data
    },
    onSuccess: async (response) => {
      const {access_token} = response;
      // Set cookie with 1h expiry
      await setCookie(
        access_token,
        60 * 60,
        Date.now() + 60 * 60 * 1000
      );
        await queryClient.invalidateQueries({ queryKey: ["user", "me"] });
    },
  });
};
