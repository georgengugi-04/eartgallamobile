import React, { memo, useState } from "react";
import { StyleSheet, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { Image } from "expo-image";
import { Frame } from "lucide-react-native";
import { colors, radius, spacing } from "../../constants/theme";
import { duration } from "../../constants/motion";
import type { Artwork } from "../../types";
import { formatPrice } from "../../utils/format";
import { sizedImage } from "../../utils/image";
import { AppText } from "./AppText";
import { Badge } from "./Badge";
import { Icon } from "./Icon";
import { PressableScale } from "./PressableScale";
import { SaveButton } from "./SaveButton";

interface Props {
  artwork: Artwork;
  onPress: () => void;
  // Fixed width for horizontal rails. Omit in a grid cell so it fills the column.
  width?: number;
  // Save is only shown when the caller wires it up (needs the saved-artwork API).
  saved?: boolean;
  onToggleSave?: () => void;
}

function ArtworkCardBase({ artwork, onPress, width, saved = false, onToggleSave }: Props) {
  const [failed, setFailed] = useState(false);
  const unavailable = artwork.availability && artwork.availability !== "available";
  const status = artwork.availability === "sold" ? "Sold" : "Reserved";
  const priceText = unavailable ? status : formatPrice(artwork.price);

  return (
    <Animated.View entering={FadeIn.duration(duration.slow)} style={width ? { width } : styles.fill}>
      <PressableScale
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`${artwork.title}, by ${artwork.artist.username}. ${priceText}`}
        accessibilityHint="Opens the artwork"
        scaleTo={0.98}
      >
        <View style={styles.imageWrap}>
          {failed ? (
            <View style={styles.fallback}>
              <Icon icon={Frame} size={28} color={colors.muted} />
            </View>
          ) : (
            <Image
              source={{ uri: sizedImage(artwork.imageUrl, 700) }}
              style={styles.image}
              contentFit="cover"
              transition={300}
              cachePolicy="memory-disk"
              recyclingKey={String(artwork.id)}
              onError={() => setFailed(true)}
            />
          )}
          {onToggleSave ? (
            <View style={styles.save}>
              <SaveButton saved={saved} onToggle={onToggleSave} />
            </View>
          ) : null}
        </View>

        <View style={styles.meta}>
          <AppText variant="cardTitle" numberOfLines={1}>
            {artwork.title}
          </AppText>
          <AppText variant="bodySmall" color="secondary" numberOfLines={1}>
            {artwork.artist.username}
          </AppText>
          <View style={styles.price}>
            {unavailable ? (
              <Badge label={status} tone="outline" />
            ) : (
              <AppText variant="caption" color="secondary">
                {priceText}
              </AppText>
            )}
          </View>
        </View>
      </PressableScale>
    </Animated.View>
  );
}

// Cards sit in long lists; skip re-renders when nothing about them changed.
export const ArtworkCard = memo(ArtworkCardBase);

const styles = StyleSheet.create({
  fill: { flex: 1 },
  imageWrap: { borderRadius: radius.sm, overflow: "hidden", backgroundColor: colors.elevated },
  image: { width: "100%", aspectRatio: 4 / 5 },
  fallback: { width: "100%", aspectRatio: 4 / 5, alignItems: "center", justifyContent: "center" },
  save: { position: "absolute", top: spacing.sm, right: spacing.sm },
  meta: { paddingTop: spacing.md, gap: 2 },
  price: { marginTop: spacing.xs },
});
