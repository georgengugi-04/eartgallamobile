import React, { useEffect } from "react";
import { DimensionValue, StyleProp, ViewStyle } from "react-native";
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { colors, radius } from "../../constants/theme";

interface Props {
  width?: DimensionValue;
  height: number;
  borderRadius?: number;
  style?: StyleProp<ViewStyle>;
}

// A calm pulse, not a flashy shimmer.
export function Skeleton({ width = "100%", height, borderRadius = radius.sm, style }: Props) {
  const opacity = useSharedValue(0.55);

  useEffect(() => {
    opacity.value = withRepeat(withSequence(withTiming(1, { duration: 900 }), withTiming(0.55, { duration: 900 })), -1);
    return () => cancelAnimation(opacity);
  }, [opacity]);

  const animated = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[{ width, height, borderRadius, backgroundColor: colors.elevated }, animated, style]}
    />
  );
}
