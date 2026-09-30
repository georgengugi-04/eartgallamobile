import React, { useState } from "react";
import { LayoutChangeEvent, Pressable, StyleSheet, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import * as Haptics from "expo-haptics";
import { CalendarDays, Compass, House, Bookmark, User, type LucideIcon } from "lucide-react-native";
import { colors, layout, spacing } from "../../constants/theme";
import { spring } from "../../constants/motion";
import { AppText } from "../ui/AppText";
import { Icon } from "../ui/Icon";

const TABS: Record<string, { label: string; icon: LucideIcon }> = {
  Home: { label: "Home", icon: House },
  Explore: { label: "Explore", icon: Compass },
  Collections: { label: "Collections", icon: Bookmark },
  Events: { label: "Events", icon: CalendarDays },
  Profile: { label: "Profile", icon: User },
};

const INDICATOR_WIDTH = 24;

export function TabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const [width, setWidth] = useState(0);
  const tabWidth = width / state.routes.length;
  const x = useSharedValue(0);

  // The gold indicator glides to the active tab.
  React.useEffect(() => {
    if (tabWidth > 0) {
      x.value = withSpring(state.index * tabWidth + (tabWidth - INDICATOR_WIDTH) / 2, spring.tab);
    }
  }, [state.index, tabWidth, x]);

  const indicator = useAnimatedStyle(() => ({ transform: [{ translateX: x.value }] }));

  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, spacing.sm) }]}>
      <View style={styles.row} onLayout={(e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width)}>
        <Animated.View style={[styles.indicator, indicator]} />
        {state.routes.map((route, index) => {
          const focused = state.index === index;
          const meta = TABS[route.name];
          const tint = focused ? colors.text : colors.textSecondary;

          const onPress = () => {
            const event = navigation.emit({ type: "tabPress", target: route.key, canPreventDefault: true });
            if (!focused && !event.defaultPrevented) {
              Haptics.selectionAsync().catch(() => undefined);
              navigation.navigate(route.name, route.params);
            }
          };

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              onLongPress={() => navigation.emit({ type: "tabLongPress", target: route.key })}
              accessibilityRole="tab"
              accessibilityLabel={meta.label}
              accessibilityState={{ selected: focused }}
              style={styles.tab}
            >
              <Icon icon={meta.icon} size={22} color={tint} strokeWidth={focused ? 2 : 1.5} />
              <AppText variant="caption" style={[styles.label, { color: tint }]}>
                {meta.label}
              </AppText>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    backgroundColor: colors.bg,
    borderTopWidth: StyleSheet.hairlineWidth * 2,
    borderTopColor: colors.border,
  },
  row: { flexDirection: "row", minHeight: layout.tabBarHeight },
  tab: { flex: 1, alignItems: "center", justifyContent: "center", gap: 4, paddingTop: spacing.sm },
  label: { fontSize: 11, lineHeight: 14 },
  indicator: {
    position: "absolute",
    top: 0,
    width: INDICATOR_WIDTH,
    height: 2,
    backgroundColor: colors.accent,
  },
});
