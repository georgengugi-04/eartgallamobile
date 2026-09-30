export const formatPrice = (amount: number) => `KSh ${amount.toLocaleString("en-KE")}`;

export function greeting(date = new Date()): string {
  const h = date.getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export function initials(name: string): string {
  return name.replace(/[^a-zA-Z0-9 ]/g, " ").trim().slice(0, 2).toUpperCase() || "?";
}
