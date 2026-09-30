import React from "react";
import { StyleSheet, View } from "react-native";
import { ChevronRight } from "lucide-react-native";
import { colors, spacing } from "../../constants/theme";
import { AppText } from "./AppText";
import { Icon } from "./Icon";
import { PressableScale } from "./PressableScale";

interface Props {
  title: string;
  eyebrow?: string;
  actionLabel?: string;
  onActionPress?: () => void;
}

export function SectionHeader({ title, eyebrow, actionLabel, onActionPress }: Props) {
  return (
    <View style={styles.row}>
      <View style={styles.flex}>
        {eyebrow ? (
          <AppText variant="label" color="accent" style={styles.eyebrow}>
            {eyebrow}
          </AppText>
        ) : null}
        <AppText variant="title2" accessibilityRole="header">
          {title}
        </AppText>
      </View>
      {actionLabel && onActionPress ? (
        <PressableScale onPress={onActionPress} accessibilityRole="button" accessibilityLabel={actionLabel} hitSlop={10} style={styles.action}>
          <AppText variant="bodySmall" color="secondary">
            {actionLabel}
          </AppText>
          <Icon icon={ChevronRight} size={16} color={colors.textSecondary} />
        </PressableScale>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "flex-end", paddingHorizontal: spacing.screen, marginBottom: spacing.lg },
  flex: { flex: 1 },
  eyebrow: { marginBottom: spacing.xs },
  action: { flexDirection: "row", alignItems: "center", gap: 2, paddingBottom: 4 },
});
