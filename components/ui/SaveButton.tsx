import React from "react";
import { Pressable, StyleSheet } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withSpring } from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { Heart } from "lucide-react-native";
import { colors, layout, radius } from "../../constants/theme";
import { spring } from "../../constants/motion";
import { Icon } from "./Icon";

interface Props {
  saved: boolean;
  onToggle: () => void;
  variant?: "plain" | "overlay";
  size?: number;
}

const tap = (fn: () => Promise<void>) => fn().catch(() => undefined);

// Presentational: the caller owns the saved state (and, later, the API call).
export function SaveButton({ saved, onToggle, variant = "overlay", size = 20 }: Props) {
  const scale = useSharedValue(1);
  const animated = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const press = () => {
    if (!saved) {
      scale.value = withSequence(withSpring(1.3, spring.pop), withSpring(1, spring.pop));
      void tap(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light));
    } else {
      void tap(() => Haptics.selectionAsync());
    }
    onToggle();
  };

  return (
    <Pressable
      onPress={press}
      hitSlop={6}
      accessibilityRole="button"
      accessibilityLabel={saved ? "Remove from saved" : "Save artwork"}
      accessibilityState={{ selected: saved }}
      style={[styles.base, variant === "overlay" ? styles.overlay : null]}
    >
      <Animated.View style={animated}>
        <Icon
          icon={Heart}
          size={size}
          color={saved ? colors.accent : colors.text}
          fill={saved ? colors.accent : "none"}
        />
      </Animated.View>
    </Pressable>
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
});
