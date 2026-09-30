import React from "react";
import { StyleSheet, View } from "react-native";
import { BadgeCheck } from "lucide-react-native";
import { colors, spacing } from "../../constants/theme";
import { AppText } from "./AppText";
import { Avatar } from "./Avatar";
import { Icon } from "./Icon";
import { PressableScale } from "./PressableScale";

interface Props {
  name: string;
  avatarUrl?: string | null;
  artworkCount?: number;
  // Must come from the real `verifiedArtist` field, never assumed.
  verified?: boolean;
  onPress: () => void;
}

export function ArtistCard({ name, avatarUrl, artworkCount, verified, onPress }: Props) {
  return (
    <PressableScale
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${name}${verified ? ", verified artist" : ""}`}
      accessibilityHint="Opens the artist profile"
      style={styles.card}
    >
      <Avatar uri={avatarUrl} name={name} size={84} />
      <View style={styles.nameRow}>
        <AppText variant="bodySmall" numberOfLines={1} style={styles.name}>
          {name}
        </AppText>
        {verified ? <Icon icon={BadgeCheck} size={14} color={colors.accent} strokeWidth={2} /> : null}
      </View>
      {artworkCount !== undefined ? (
        <AppText variant="caption" color="secondary">
          {artworkCount} {artworkCount === 1 ? "work" : "works"}
        </AppText>
      ) : null}
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  card: { width: 104, alignItems: "center", gap: spacing.xs },
  nameRow: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: spacing.xs, maxWidth: 104 },
  name: { flexShrink: 1 },
});
