import api from "./client";
import { Artwork, Order, PaginatedResponse, Conversation, Message } from "../types";

// ---- Auth ----
export const signupRequest = (data: {
  email: string;
  password: string;
  username: string;
  isArtist: boolean;
}) => api.post("/auth/signup", data).then((r) => r.data);

export const loginRequest = (data: { email: string; password: string }) =>
  api.post("/auth/login", data).then((r) => r.data);

// The server identifies the user from the access token.
export const logoutRequest = () => api.post("/auth/logout").then((r) => r.data);

// ---- Artworks ----
export const fetchArtworks = (params: {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
}) => api.get<PaginatedResponse<Artwork>>("/artworks", { params }).then((r) => r.data);

export const fetchArtworkById = (id: number) =>
  api.get<Artwork>(`/artworks/${id}`).then((r) => r.data);

export const fetchArtworksByArtist = (artistId: number) =>
  api.get<Artwork[]>(`/artworks/artist/${artistId}`).then((r) => r.data);

export const uploadArtwork = (formData: FormData) =>
  api
    .post<Artwork>("/artworks", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((r) => r.data);

export const deleteArtworkRequest = (id: number) =>
  api.delete(`/artworks/${id}`).then((r) => r.data);

// ---- Orders ----
export const createOrderRequest = (items: { artworkId: number }[], phoneNumber: string) =>
  api.post<Order>("/orders", { items, phoneNumber }).then((r) => r.data);

export const fetchMyOrders = () => api.get<Order[]>("/orders/me").then((r) => r.data);

// ---- Users ----
export const fetchUserProfile = (id: number) => api.get(`/users/${id}`).then((r) => r.data);

export const updateProfileRequest = (data: { bio?: string; avatarUrl?: string; username?: string }) =>
  api.put("/users/me", data).then((r) => r.data);

export const savePushTokenRequest = (pushToken: string) =>
  api.post("/users/me/push-token", { pushToken }).then((r) => r.data);

export const followUserRequest = (id: number) => api.post(`/users/${id}/follow`).then((r) => r.data);
export const unfollowUserRequest = (id: number) => api.delete(`/users/${id}/follow`).then((r) => r.data);

// ---- Messages ----
export const fetchConversations = () =>
  api.get<Conversation[]>("/messages/conversations").then((r) => r.data);

export const fetchThread = (userId: number) =>
  api.get<Message[]>(`/messages/${userId}`).then((r) => r.data);

export const sendMessageRequest = (receiverId: number, content: string) =>
  api.post<Message>("/messages", { receiverId, content }).then((r) => r.data);
