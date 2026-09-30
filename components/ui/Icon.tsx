import React from "react";
import type { LucideIcon } from "lucide-react-native";
import { colors } from "../../constants/theme";

interface Props {
  icon: LucideIcon;
  size?: number;
  color?: string;
  strokeWidth?: number;
  fill?: string;
}

// Thin, consistent strokes. Icons are decorative; put accessibility labels on the control.
export function Icon({ icon: Glyph, size = 22, color = colors.text, strokeWidth = 1.5, fill }: Props) {
  return <Glyph size={size} color={color} strokeWidth={strokeWidth} fill={fill ?? "none"} />;
}
