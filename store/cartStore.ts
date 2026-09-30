import { create } from "zustand";
import { Artwork } from "../types";

interface CartState {
  items: Artwork[];
  addItem: (artwork: Artwork) => void;
  removeItem: (artworkId: number) => void;
  clearCart: () => void;
  total: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],

  addItem: (artwork) => {
    const exists = get().items.find((i) => i.id === artwork.id);
    if (exists) return; // each artwork is a unique piece, can't add twice
    set({ items: [...get().items, artwork] });
  },

  removeItem: (artworkId) => {
    set({ items: get().items.filter((i) => i.id !== artworkId) });
  },

  clearCart: () => set({ items: [] }),

  total: () => get().items.reduce((sum, i) => sum + i.price, 0),
}));
