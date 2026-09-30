import React from "react";
import { StyleSheet, View } from "react-native";
import { colors, spacing } from "../../constants/theme";
import { AppText } from "./AppText";

export interface MetadataItem {
  label: string;
  value?: string | null;
}

// Museum-label style key/value rows. Rows without a value are skipped, so
// optional fields (year, edition...) simply don't appear until they exist.
export function ArtworkMetadata({ items }: { items: MetadataItem[] }) {
  const rows = items.filter((i) => i.value);
  if (rows.length === 0) return null;
  return (
    <View>
      {rows.map((item, i) => (
        <View key={item.label} style={[styles.row, i === 0 ? styles.first : null]} accessible accessibilityLabel={`${item.label}: ${item.value}`}>
          <AppText variant="label" color="secondary">
            {item.label}
          </AppText>
          <AppText variant="bodySmall" style={styles.value}>
            {item.value}
          </AppText>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth * 2,
    borderBottomColor: colors.border,
  },
  first: { borderTopWidth: StyleSheet.hairlineWidth * 2, borderTopColor: colors.border },
  value: { flexShrink: 1, textAlign: "right", marginLeft: spacing.lg },
});
