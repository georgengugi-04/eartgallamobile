export interface User {
  id: number;
  email: string;
  username: string;
  isArtist: boolean;
  avatarUrl?: string | null;
  bio?: string | null;
}

export interface Artwork {
  id: number;
  title: string;
  description?: string | null;
  price: number;
  category: string;
  imageUrl: string;
  availability?: "available" | "reserved" | "sold";
  artistId: number;
  artist: {
    id: number;
    username: string;
    avatarUrl?: string | null;
  };
  createdAt: string;
}

export interface Order {
  id: number;
  total: number;
  status: string;
  items: {
    id: number;
    price: number;
    artwork: Artwork;
  }[];
  createdAt: string;
}

export interface Message {
  id: number;
  senderId: number;
  receiverId: number;
  content: string;
  read: boolean;
  createdAt: string;
}

export interface Conversation {
  partner: {
    id: number;
    username: string;
    avatarUrl?: string | null;
  };
  lastMessage: Message;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
}
