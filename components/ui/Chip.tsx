import React from "react";
import { StyleSheet } from "react-native";
import { colors, radius, spacing, type } from "../../constants/theme";
import { AppText } from "./AppText";
import { PressableScale } from "./PressableScale";

interface Props {
  label: string;
  selected?: boolean;
  onPress: () => void;
}

export function Chip({ label, selected = false, onPress }: Props) {
  return (
    <PressableScale
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected }}
      scaleTo={0.95}
      style={[styles.chip, selected ? styles.selected : styles.idle]}
    >
      <AppText style={[type.bodySmall, { color: selected ? colors.bg : colors.text }]}>{label}</AppText>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  chip: {
    minHeight: 40,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  idle: { borderWidth: StyleSheet.hairlineWidth * 2, borderColor: colors.borderStrong },
  selected: { backgroundColor: colors.text, borderWidth: StyleSheet.hairlineWidth * 2, borderColor: colors.text },
});
