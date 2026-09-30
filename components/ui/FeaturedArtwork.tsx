import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { ArrowRight, Frame } from "lucide-react-native";
import { colors, radius, spacing } from "../../constants/theme";
import { duration } from "../../constants/motion";
import type { Artwork } from "../../types";
import { sizedImage } from "../../utils/image";
import { AppText } from "./AppText";
import { Icon } from "./Icon";
import { PressableScale } from "./PressableScale";

interface Props {
  artwork: Artwork;
  eyebrow: string;
  onPress: () => void;
}

// The immersive hero. One soft scrim only where the text sits; the artwork stays the star.
export function FeaturedArtwork({ artwork, eyebrow, onPress }: Props) {
  const [failed, setFailed] = useState(false);
  return (
    <Animated.View entering={FadeIn.duration(duration.slow)}>
      <PressableScale
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`${eyebrow}: ${artwork.title}, by ${artwork.artist.username}`}
        accessibilityHint="Opens the artwork"
        scaleTo={0.985}
        style={styles.card}
      >
        {failed ? (
          <View style={styles.fallback}>
            <Icon icon={Frame} size={36} color={colors.muted} />
          </View>
        ) : (
          <Image
            source={{ uri: sizedImage(artwork.imageUrl, 1100) }}
            style={StyleSheet.absoluteFill}
            contentFit="cover"
            transition={400}
            cachePolicy="memory-disk"
            onError={() => setFailed(true)}
          />
        )}
        <LinearGradient colors={["transparent", "rgba(8,8,8,0.88)"]} locations={[0.45, 1]} style={StyleSheet.absoluteFill} />
        <View style={styles.content}>
          <AppText variant="label" color="accent">
            {eyebrow}
          </AppText>
          <AppText variant="title1" numberOfLines={2} style={styles.title}>
            {artwork.title}
          </AppText>
          <AppText variant="bodySmall" color="secondary">
            {artwork.artist.username}
          </AppText>
          <View style={styles.pill}>
            <AppText variant="button" color="onAccent">
              Explore
            </AppText>
            <Icon icon={ArrowRight} size={16} color={colors.onAccent} strokeWidth={2} />
          </View>
        </View>
      </PressableScale>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: spacing.screen,
    aspectRatio: 4 / 5,
    borderRadius: radius.sm,
    overflow: "hidden",
    backgroundColor: colors.elevated,
    justifyContent: "flex-end",
  },
  fallback: { ...StyleSheet.absoluteFillObject, alignItems: "center", justifyContent: "center" },
  content: { padding: spacing.xl, gap: spacing.xs },
  title: { marginTop: spacing.xs },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: spacing.sm,
    marginTop: spacing.lg,
    paddingHorizontal: spacing.lg,
    height: 40,
    borderRadius: radius.sm,
    backgroundColor: colors.text,
  },
});
