// The API URL comes from the environment, never from source code.
// Expo inlines EXPO_PUBLIC_* variables at build time (see .env.example).
const url = process.env.EXPO_PUBLIC_API_URL;

if (!url) {
  throw new Error(
    "EXPO_PUBLIC_API_URL is not set. Copy .env.example to .env and set it, then restart Expo with `npx expo start -c`."
  );
}

export const API_URL = url.replace(/\/$/, "");
