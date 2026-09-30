import React from "react";
import { StyleSheet, View } from "react-native";
import type { LucideIcon } from "lucide-react-native";
import { colors, radius, spacing } from "../../constants/theme";
import { AppText } from "./AppText";
import { Icon } from "./Icon";

interface Props {
  label: string;
  tone?: "neutral" | "accent" | "outline";
  icon?: LucideIcon;
}

export function Badge({ label, tone = "neutral", icon }: Props) {
  const fg = tone === "accent" ? colors.accent : colors.textSecondary;
  return (
    <View style={[styles.base, tone === "neutral" ? styles.neutral : styles.outline, tone === "accent" ? styles.accentBorder : null]}>
      {icon ? <Icon icon={icon} size={12} color={fg} strokeWidth={2} /> : null}
      <AppText variant="label" style={{ color: fg, fontSize: 10, lineHeight: 12 }}>
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.sm,
  },
  neutral: { backgroundColor: colors.elevated },
  outline: { borderWidth: StyleSheet.hairlineWidth * 2, borderColor: colors.borderStrong },
  accentBorder: { borderColor: colors.accent },
});
