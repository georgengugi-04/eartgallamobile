import axios, { AxiosError, InternalAxiosRequestConfig, create } from "axios";
import * as SecureStore from "expo-secure-store";
import { API_URL } from "../constants/config";

export const BASE_URL = API_URL;

const api = create({ baseURL: BASE_URL, timeout: 20000 });

// The auth store registers a handler here so a failed token refresh signs the
// user out of the UI too. (client.ts can't import the store: that would be circular.)
let onAuthFailure: (() => void) | null = null;
export const setAuthFailureHandler = (fn: () => void) => {
  onAuthFailure = fn;
};

api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

type RetryableConfig = InternalAxiosRequestConfig & { _retry?: boolean };

let isRefreshing = false;
let refreshQueue: { resolve: (token: string) => void; reject: (err: unknown) => void }[] = [];

const flushQueue = (err: unknown, token?: string) => {
  refreshQueue.forEach((p) => (token ? p.resolve(token) : p.reject(err)));
  refreshQueue = [];
};

// Login/signup/refresh return 401 for bad credentials; that must reach the
// screen as-is, not trigger a token refresh.
const isAuthUrl = (url?: string) => !!url && url.startsWith("/auth/");

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableConfig | undefined;

    if (error.response?.status !== 401 || !originalRequest || originalRequest._retry || isAuthUrl(originalRequest.url)) {
      return Promise.reject(error);
    }
    originalRequest._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        refreshQueue.push({
          resolve: (token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(api(originalRequest));
          },
          reject,
        });
      });
    }

    isRefreshing = true;
    try {
      const refreshToken = await SecureStore.getItemAsync("refreshToken");
      if (!refreshToken) throw new Error("No refresh token");
      const res = await axios.post(`${BASE_URL}/auth/refresh`, { refreshToken }, { timeout: 20000 });
      const { accessToken, refreshToken: newRefreshToken } = res.data;

      await SecureStore.setItemAsync("accessToken", accessToken);
      await SecureStore.setItemAsync("refreshToken", newRefreshToken);

      flushQueue(null, accessToken);
      originalRequest.headers.Authorization = `Bearer ${accessToken}`;
      return api(originalRequest);
    } catch (refreshError) {
      flushQueue(refreshError);
      await SecureStore.deleteItemAsync("accessToken");
      await SecureStore.deleteItemAsync("refreshToken");
      await SecureStore.deleteItemAsync("user");
      onAuthFailure?.();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;
