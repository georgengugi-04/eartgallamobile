import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Image } from "expo-image";
import { colors, fonts } from "../../constants/theme";
import { initials } from "../../utils/format";
import { sizedImage } from "../../utils/image";
import { AppText } from "./AppText";

interface Props {
  uri?: string | null;
  name: string;
  size?: number;
}

// Falls back to initials, so there is never a network call for a placeholder image.
export function Avatar({ uri, name, size = 44 }: Props) {
  const [failed, setFailed] = useState(false);
  const shape = { width: size, height: size, borderRadius: size / 2 };

  if (uri && !failed) {
    return (
      <Image
        source={{ uri: sizedImage(uri, size * 3) }}
        style={[shape, styles.image]}
        contentFit="cover"
        transition={200}
        cachePolicy="memory-disk"
        onError={() => setFailed(true)}
        accessibilityLabel={`${name}'s avatar`}
      />
    );
  }
  return (
    <View style={[shape, styles.fallback]} accessibilityLabel={`${name}'s avatar`}>
      <AppText style={{ fontFamily: fonts.display, fontSize: size * 0.36, color: colors.textSecondary }}>
        {initials(name)}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  image: { backgroundColor: colors.elevated },
  fallback: {
    backgroundColor: colors.elevated,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderColor: colors.border,
  },
});
