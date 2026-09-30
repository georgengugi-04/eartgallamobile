import React from "react";
import { ActivityIndicator, StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import type { LucideIcon } from "lucide-react-native";
import { colors, layout, radius, spacing, type } from "../../constants/theme";
import { AppText } from "./AppText";
import { Icon } from "./Icon";
import { PressableScale } from "./PressableScale";

interface ButtonProps {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  icon?: LucideIcon;
  size?: "md" | "sm";
  fullWidth?: boolean;
  accessibilityHint?: string;
  style?: StyleProp<ViewStyle>;
}

interface BaseProps extends ButtonProps {
  background: string;
  foreground: string;
  borderColor?: string;
}

function BaseButton({
  label,
  onPress,
  loading,
  disabled,
  icon,
  size = "md",
  fullWidth = true,
  accessibilityHint,
  style,
  background,
  foreground,
  borderColor,
}: BaseProps) {
  const inactive = disabled || loading;
  return (
    <PressableScale
      onPress={inactive ? undefined : onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: !!disabled, busy: !!loading }}
      scaleTo={0.98}
      style={[
        styles.base,
        { backgroundColor: background, minHeight: size === "sm" ? layout.minTouch : layout.buttonHeight },
        borderColor ? { borderColor, borderWidth: StyleSheet.hairlineWidth * 2 } : null,
        fullWidth ? styles.full : styles.auto,
        disabled ? styles.disabled : null,
        style,
      ]}
    >
      <View style={[styles.content, loading ? styles.hidden : null]}>
        {icon ? <Icon icon={icon} size={18} color={foreground} /> : null}
        <AppText style={[type.button, { color: foreground }]}>{label}</AppText>
      </View>
      {loading ? (
        <View style={styles.spinner}>
          <ActivityIndicator color={foreground} />
        </View>
      ) : null}
    </PressableScale>
  );
}

// Main action. Cream by default; "accent" for the rare moment that deserves gold.
export function PrimaryButton({ tone = "light", ...props }: ButtonProps & { tone?: "light" | "accent" }) {
  return tone === "accent" ? (
    <BaseButton {...props} background={colors.accent} foreground={colors.onAccent} />
  ) : (
    <BaseButton {...props} background={colors.text} foreground={colors.bg} />
  );
}

export function SecondaryButton(props: ButtonProps) {
  return <BaseButton {...props} background="transparent" foreground={colors.text} borderColor={colors.borderStrong} />;
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.sm,
    paddingHorizontal: spacing.xl,
    alignItems: "center",
    justifyContent: "center",
  },
  full: { alignSelf: "stretch" },
  auto: { alignSelf: "flex-start" },
  content: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  hidden: { opacity: 0 },
  spinner: { ...StyleSheet.absoluteFillObject, alignItems: "center", justifyContent: "center" },
  disabled: { opacity: 0.45 },
});
