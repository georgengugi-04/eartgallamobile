import { useEffect } from "react";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { savePushTokenRequest } from "../api/endpoints";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Call this once, after the user is logged in, to register their device for push notifications.
export function useRegisterPushToken(isAuthenticated: boolean) {
  useEffect(() => {
    if (!isAuthenticated) return;

    (async () => {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") return;

      // Android needs the channel to exist before a token is requested.
      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.MAX,
        });
      }

      try {
        // Requires an EAS projectId in app config (Expo Go on Android can't do remote push).
        const tokenData = await Notifications.getExpoPushTokenAsync();
        await savePushTokenRequest(tokenData.data);
      } catch (err) {
        // Push is optional; never crash the app because it isn't available.
        console.warn("Push registration skipped:", err);
      }
    })();
  }, [isAuthenticated]);
}
