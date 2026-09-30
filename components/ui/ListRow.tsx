import React from "react";
import { StyleSheet, View } from "react-native";
import { ChevronRight, type LucideIcon } from "lucide-react-native";
import { colors, layout, spacing } from "../../constants/theme";
import { AppText } from "./AppText";
import { Icon } from "./Icon";
import { PressableScale } from "./PressableScale";

interface Props {
  icon: LucideIcon;
  label: string;
  onPress: () => void;
  value?: string;
  destructive?: boolean;
}

export function ListRow({ icon, label, onPress, value, destructive }: Props) {
  const tint = destructive ? colors.danger : colors.text;
  return (
    <PressableScale onPress={onPress} accessibilityRole="button" accessibilityLabel={label} scaleTo={0.99} style={styles.row}>
      <Icon icon={icon} size={20} color={destructive ? colors.danger : colors.textSecondary} />
      <AppText variant="body" style={[styles.label, { color: tint }]}>
        {label}
      </AppText>
      {value ? (
        <AppText variant="bodySmall" color="secondary">
          {value}
        </AppText>
      ) : null}
      {destructive ? null : <Icon icon={ChevronRight} size={18} color={colors.muted} />}
    </PressableScale>
  );
}

export function ListGroup({ children }: { children: React.ReactNode }) {
  return <View style={styles.group}>{children}</View>;
}

const styles = StyleSheet.create({
  group: {
    marginHorizontal: spacing.screen,
    borderTopWidth: StyleSheet.hairlineWidth * 2,
    borderTopColor: colors.border,
  },
  row: {
    minHeight: layout.buttonHeight + 4,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth * 2,
    borderBottomColor: colors.border,
  },
  label: { flex: 1 },
});
