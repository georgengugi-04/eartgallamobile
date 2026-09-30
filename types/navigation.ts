import type { CompositeScreenProps, NavigatorScreenParams } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";

export type MainTabParamList = {
  Home: undefined;
  Explore: { category?: string } | undefined;
  Collections: undefined;
  Events: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Signup: undefined;
  Main: NavigatorScreenParams<MainTabParamList> | undefined;
  ArtworkDetail: { id: number };
  ArtistProfile: { id: number };
  ChatThread: { userId: number; username: string };
  Messages: undefined;
  Cart: undefined;
  Orders: undefined;
  EditProfile: undefined;
  Upload: undefined;
  DesignSystem: undefined;
};

export type RootScreenProps<T extends keyof RootStackParamList> = NativeStackScreenProps<RootStackParamList, T>;

// Tab screens can also navigate to stack screens (ArtworkDetail, Orders, ...).
export type TabScreenProps<T extends keyof MainTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, T>,
  NativeStackScreenProps<RootStackParamList>
>;
