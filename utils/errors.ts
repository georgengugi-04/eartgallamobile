import { isAxiosError } from "axios";

// Turns any thrown value into a message that is safe to show the user.
export function getErrorMessage(err: unknown, fallback = "Something went wrong"): string {
  if (isAxiosError(err)) {
    const message = err.response?.data?.message;
    if (typeof message === "string" && message) return message;
    if (!err.response) return "Can't reach the server. Check your connection.";
  }
  return fallback;
}
