import React from "react";
import { Text, TextProps } from "react-native";
import { TextColor, TypeVariant, textColors, type } from "../../constants/theme";

interface Props extends TextProps {
  variant?: TypeVariant;
  color?: TextColor;
  align?: "left" | "center" | "right";
}

// Every piece of text in the app goes through this, so hierarchy stays consistent.
export function AppText({ variant = "body", color = "primary", align, style, ...rest }: Props) {
  return (
    <Text
      // Respect the user's font size, but cap it so layouts don't break.
      maxFontSizeMultiplier={1.3}
      {...rest}
      style={[type[variant], { color: textColors[color] }, align ? { textAlign: align } : null, style]}
    />
  );
}
