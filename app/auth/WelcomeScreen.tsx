import React from "react";
import { StyleSheet, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppText, BrandMark, PrimaryButton, SecondaryButton } from "../../components/ui";
import { colors, spacing } from "../../constants/theme";
import { duration } from "../../constants/motion";
import { RootScreenProps } from "../../types/navigation";

const enter = (delay: number) => FadeInDown.duration(duration.slow + 200).delay(delay);

export default function WelcomeScreen({ navigation }: RootScreenProps<"Welcome">) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.root, { paddingTop: insets.top + spacing.xxxl, paddingBottom: insets.bottom + spacing.xl }]}>
      <View style={styles.hero}>
        <Animated.View entering={enter(0)}>
          <BrandMark width={40} />
        </Animated.View>
        <Animated.View entering={enter(120)}>
          <AppText variant="label" color="accent" style={styles.eyebrow}>
            African art · Artists · Stories
          </AppText>
        </Animated.View>
        <Animated.View entering={enter(240)}>
          <AppText variant="display" accessibilityRole="header" style={styles.wordmark}>
            E-ArtGalla
          </AppText>
        </Animated.View>
        <Animated.View entering={enter(360)}>
          <AppText variant="body" color="secondary" style={styles.tagline}>
            Discover contemporary African art, meet the artists behind it, and build a collection that feels like yours.
          </AppText>
        </Animated.View>
      </View>

      <Animated.View entering={enter(520)} style={styles.actions}>
        <PrimaryButton label="Create account" onPress={() => navigation.navigate("Signup")} />
        <SecondaryButton label="Sign in" onPress={() => navigation.navigate("Login")} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: spacing.screen, justifyContent: "space-between" },
  hero: { gap: spacing.md },
  eyebrow: { marginTop: spacing.xl },
  wordmark: { fontSize: 54, lineHeight: 60, letterSpacing: -1 },
  tagline: { maxWidth: 330, marginTop: spacing.xs },
  actions: { gap: spacing.md },
});
