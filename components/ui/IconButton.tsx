import React from "react";
import { StyleSheet, View } from "react-native";
import type { LucideIcon } from "lucide-react-native";
import { colors, layout, radius } from "../../constants/theme";
import { AppText } from "./AppText";
import { Icon } from "./Icon";
import { PressableScale } from "./PressableScale";

interface Props {
  icon: LucideIcon;
  onPress: () => void;
  // Required: an icon alone means nothing to a screen reader.
  accessibilityLabel: string;
  variant?: "plain" | "overlay";
  iconSize?: number;
  color?: string;
  badgeCount?: number;
}

export function IconButton({
  icon,
  onPress,
  accessibilityLabel,
  variant = "plain",
  iconSize = 22,
  color = colors.text,
  badgeCount,
}: Props) {
  return (
    <PressableScale
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      hitSlop={6}
      style={[styles.base, variant === "overlay" ? styles.overlay : null]}
    >
      <Icon icon={icon} size={iconSize} color={color} />
      {badgeCount ? (
        <View style={styles.badge}>
          <AppText variant="caption" color="onAccent" style={styles.badgeText}>
            {badgeCount > 9 ? "9+" : badgeCount}
          </AppText>
        </View>
      ) : null}
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  base: {
    width: layout.minTouch,
    height: layout.minTouch,
    borderRadius: radius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  overlay: {
    backgroundColor: colors.overlay,
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderColor: colors.border,
  },
  badge: {
    position: "absolute",
    top: 4,
    right: 4,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    paddingHorizontal: 4,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: { fontSize: 10, lineHeight: 12 },
});
