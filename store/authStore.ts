import { create } from "zustand";
import * as SecureStore from "expo-secure-store";
import { User } from "../types";
import { loginRequest, signupRequest, logoutRequest } from "../api/endpoints";
import { setAuthFailureHandler } from "../api/client";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: { email: string; password: string; username: string; isArtist: boolean }) => Promise<void>;
  logout: () => Promise<void>;
  loadSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,

  login: async (email, password) => {
    const res = await loginRequest({ email, password });
    await SecureStore.setItemAsync("accessToken", res.accessToken);
    await SecureStore.setItemAsync("refreshToken", res.refreshToken);
    await SecureStore.setItemAsync("user", JSON.stringify(res.user));
    set({ user: res.user, isAuthenticated: true });
  },

  signup: async (data) => {
    const res = await signupRequest(data);
    await SecureStore.setItemAsync("accessToken", res.accessToken);
    await SecureStore.setItemAsync("refreshToken", res.refreshToken);
    await SecureStore.setItemAsync("user", JSON.stringify(res.user));
    set({ user: res.user, isAuthenticated: true });
  },

  logout: async () => {
    try {
      await logoutRequest();
    } catch {
      // Offline or token already expired: still sign out locally.
    }
    await SecureStore.deleteItemAsync("accessToken");
    await SecureStore.deleteItemAsync("refreshToken");
    await SecureStore.deleteItemAsync("user");
    set({ user: null, isAuthenticated: false });
  },

  loadSession: async () => {
    try {
      const userJson = await SecureStore.getItemAsync("user");
      const token = await SecureStore.getItemAsync("accessToken");
      if (userJson && token) {
        set({ user: JSON.parse(userJson), isAuthenticated: true });
      }
    } finally {
      set({ isLoading: false });
    }
  },
}));

// If a token refresh fails for good, drop the session so the app returns to Login.
setAuthFailureHandler(() => useAuthStore.setState({ user: null, isAuthenticated: false }));
