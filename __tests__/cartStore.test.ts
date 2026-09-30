import { useCartStore } from "../store/cartStore";
import type { Artwork } from "../types";

const artwork = (id: number, price: number): Artwork => ({
  id,
  title: `Piece ${id}`,
  price,
  category: "Abstract",
  imageUrl: "https://example.com/a.jpg",
  artistId: 1,
  artist: { id: 1, username: "artist" },
  createdAt: "2026-01-01T00:00:00.000Z",
});

describe("cartStore", () => {
  beforeEach(() => useCartStore.getState().clearCart());

  it("adds an artwork once (each piece is unique)", () => {
    const { addItem } = useCartStore.getState();
    addItem(artwork(1, 5000));
    addItem(artwork(1, 5000));
    expect(useCartStore.getState().items).toHaveLength(1);
  });

  it("totals prices and removes items", () => {
    const { addItem, removeItem } = useCartStore.getState();
    addItem(artwork(1, 5000));
    addItem(artwork(2, 2500));
    expect(useCartStore.getState().total()).toBe(7500);
    removeItem(1);
    expect(useCartStore.getState().total()).toBe(2500);
  });
});
