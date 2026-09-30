import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { TabBar } from "../../components/navigation/TabBar";
import { colors } from "../../constants/theme";
import { MainTabParamList } from "../../types/navigation";
import HomeScreen from "./HomeScreen";
import ExploreScreen from "./ExploreScreen";
import CollectionsScreen from "./CollectionsScreen";
import EventsScreen from "./EventsScreen";
import ProfileScreen from "./ProfileScreen";

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      tabBar={(props) => <TabBar {...props} />}
      sceneContainerStyle={{ backgroundColor: colors.bg }}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Explore" component={ExploreScreen} />
      <Tab.Screen name="Collections" component={CollectionsScreen} />
      <Tab.Screen name="Events" component={EventsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
