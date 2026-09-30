import { sizedImage } from "../utils/image";
import { formatPrice, greeting, initials } from "../utils/format";

describe("sizedImage", () => {
  const url = "https://res.cloudinary.com/demo/image/upload/v1/eartgalla/artworks/a.jpg";

  it("inserts a width transformation for Cloudinary URLs", () => {
    expect(sizedImage(url, 600)).toBe(
      "https://res.cloudinary.com/demo/image/upload/c_limit,w_600,q_auto,f_auto/v1/eartgalla/artworks/a.jpg"
    );
  });

  it("leaves other hosts and already-sized URLs alone", () => {
    expect(sizedImage("https://example.com/a.jpg", 600)).toBe("https://example.com/a.jpg");
    const sized = sizedImage(url, 600);
    expect(sizedImage(sized, 300)).toBe(sized);
  });
});

describe("format helpers", () => {
  it("formats prices in KSh", () => {
    expect(formatPrice(12000)).toBe("KSh 12,000");
  });
  it("greets by time of day", () => {
    expect(greeting(new Date(2026, 0, 1, 8))).toBe("Good morning");
    expect(greeting(new Date(2026, 0, 1, 14))).toBe("Good afternoon");
    expect(greeting(new Date(2026, 0, 1, 21))).toBe("Good evening");
  });
  it("builds initials", () => {
    expect(initials("amina_k")).toBe("AM");
    expect(initials("")).toBe("?");
  });
});
