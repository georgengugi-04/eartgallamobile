import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { CircleAlert, type LucideIcon } from "lucide-react-native";
import { colors, radius, spacing } from "../../constants/theme";
import { duration } from "../../constants/motion";
import { AppText } from "./AppText";
import { Icon } from "./Icon";
import { SecondaryButton } from "./Buttons";

export function LoadingState({ message }: { message?: string }) {
  return (
    <View style={styles.center} accessibilityRole="progressbar" accessibilityLabel={message ?? "Loading"}>
      <ActivityIndicator color={colors.accent} />
      {message ? (
        <AppText variant="bodySmall" color="secondary" style={styles.gap}>
          {message}
        </AppText>
      ) : null}
    </View>
  );
}

interface EmptyProps {
  icon: LucideIcon;
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ icon, title, message, actionLabel, onAction }: EmptyProps) {
  return (
    <Animated.View entering={FadeIn.duration(duration.slow)} style={styles.center}>
      <View style={styles.ring}>
        <Icon icon={icon} size={26} color={colors.textSecondary} />
      </View>
      <AppText variant="title3" align="center" style={styles.gap}>
        {title}
      </AppText>
      {message ? (
        <AppText variant="bodySmall" color="secondary" align="center" style={styles.message}>
          {message}
        </AppText>
      ) : null}
      {actionLabel && onAction ? (
        <View style={styles.action}>
          <SecondaryButton label={actionLabel} onPress={onAction} fullWidth={false} size="sm" />
        </View>
      ) : null}
    </Animated.View>
  );
}

export function ErrorState({ message, onRetry }: { message?: string; onRetry?: () => void }) {
  return (
    <EmptyState
      icon={CircleAlert}
      title="Something went wrong."
      message={message ?? "Check your connection and try again."}
      actionLabel={onRetry ? "Try again" : undefined}
      onAction={onRetry}
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: spacing.xxl },
  ring: {
    width: 64,
    height: 64,
    borderRadius: radius.full,
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderColor: colors.borderStrong,
    alignItems: "center",
    justifyContent: "center",
  },
  gap: { marginTop: spacing.lg },
  message: { marginTop: spacing.sm, maxWidth: 280 },
  action: { marginTop: spacing.xl },
});
