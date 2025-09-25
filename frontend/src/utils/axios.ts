import axios, { AxiosInstance, AxiosError } from "axios";
import { getCookie } from "../helpers/get-cookie";

const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add JWT token to requests
api.interceptors.request.use(
  async (config) => {
    const token = await getCookie();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle errors only
api.interceptors.response.use(
  (response) => response, // full response
  (error: AxiosError<{ message?: string }>) => {
    const message =
      error.response?.data?.message || error.message || "Something went wrong";
    return Promise.reject({ message, status: error.response?.status });
  }
);

export default api;
