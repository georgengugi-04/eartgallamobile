import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator, NativeStackNavigationOptions } from "@react-navigation/native-stack";
import * as SplashScreen from "expo-splash-screen";

import WelcomeScreen from "./auth/WelcomeScreen";
import LoginScreen from "./auth/LoginScreen";
import SignupScreen from "./auth/SignupScreen";
import TabNavigator from "./tabs/TabNavigator";
import ArtworkDetailScreen from "./artwork/ArtworkDetailScreen";
import ArtistProfileScreen from "./artist/ArtistProfileScreen";
import ChatThreadScreen from "./chat/ChatThreadScreen";
import MessagesScreen from "./tabs/MessagesScreen";
import CartScreen from "./tabs/CartScreen";
import OrdersScreen from "./tabs/OrdersScreen";
import EditProfileScreen from "./tabs/EditProfileScreen";
import UploadScreen from "./tabs/UploadScreen";
import DesignSystemScreen from "./dev/DesignSystemScreen";
import { navigationTheme } from "../constants/navigationTheme";
import { colors, fonts } from "../constants/theme";
import { useAuthStore } from "../store/authStore";
import { useRegisterPushToken } from "../hooks/useRegisterPushToken";
import { RootStackParamList } from "../types/navigation";

const Stack = createNativeStackNavigator<RootStackParamList>();

const screenOptions: NativeStackNavigationOptions = {
  headerStyle: { backgroundColor: colors.bg },
  headerTintColor: colors.text,
  headerTitleStyle: { fontFamily: fonts.display, fontSize: 18 },
  headerShadowVisible: false,
  headerBackTitleVisible: false,
  contentStyle: { backgroundColor: colors.bg },
  animation: "slide_from_right",
};

export default function RootNavigator() {
  const { isAuthenticated, isLoading, loadSession } = useAuthStore();

  React.useEffect(() => {
    loadSession();
  }, [loadSession]);

  useRegisterPushToken(isAuthenticated);

  // The native splash stays up until the session is known: no flash of the wrong screen.
  if (isLoading) return null;

  return (
    <NavigationContainer theme={navigationTheme} onReady={() => SplashScreen.hideAsync().catch(() => undefined)}>
      <Stack.Navigator screenOptions={screenOptions}>
        {!isAuthenticated ? (
          <>
            <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false, animation: "fade" }} />
            <Stack.Screen name="Login" component={LoginScreen} options={{ title: "" }} />
            <Stack.Screen name="Signup" component={SignupScreen} options={{ title: "" }} />
          </>
        ) : (
          <>
            <Stack.Screen name="Main" component={TabNavigator} options={{ headerShown: false, animation: "fade" }} />
            <Stack.Screen name="ArtworkDetail" component={ArtworkDetailScreen} options={{ title: "" }} />
            <Stack.Screen name="ArtistProfile" component={ArtistProfileScreen} options={{ title: "" }} />
            <Stack.Screen name="ChatThread" component={ChatThreadScreen} options={({ route }) => ({ title: route.params.username })} />
            <Stack.Screen name="Messages" component={MessagesScreen} options={{ title: "Messages" }} />
            <Stack.Screen name="Cart" component={CartScreen} options={{ title: "Cart", animation: "fade_from_bottom" }} />
            <Stack.Screen name="Orders" component={OrdersScreen} options={{ title: "Order history" }} />
            <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ title: "Edit profile" }} />
            <Stack.Screen name="Upload" component={UploadScreen} options={{ title: "Upload artwork", animation: "fade_from_bottom" }} />
            {__DEV__ ? <Stack.Screen name="DesignSystem" component={DesignSystemScreen} options={{ title: "Design system" }} /> : null}
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
