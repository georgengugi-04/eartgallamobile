import React from "react";
import { Pressable, PressableProps, StyleProp, ViewStyle } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { spring } from "../../constants/motion";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface Props extends Omit<PressableProps, "style"> {
  scaleTo?: number;
  style?: StyleProp<ViewStyle>;
}

// A pressable that eases in slightly under the finger. The base for cards and buttons.
export function PressableScale({ scaleTo = 0.97, style, onPressIn, onPressOut, ...rest }: Props) {
  const scale = useSharedValue(1);
  const animated = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <AnimatedPressable
      {...rest}
      onPressIn={(e) => {
        scale.value = withSpring(scaleTo, spring.press);
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        scale.value = withSpring(1, spring.press);
        onPressOut?.(e);
      }}
      style={[style, animated]}
    />
  );
}
