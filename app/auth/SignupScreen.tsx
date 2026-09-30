import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Switch, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppText, PrimaryButton, PressableScale, TextField } from "../../components/ui";
import { colors, radius, spacing } from "../../constants/theme";
import { duration } from "../../constants/motion";
import { useAuthStore } from "../../store/authStore";
import { RootScreenProps } from "../../types/navigation";
import { getErrorMessage } from "../../utils/errors";

// Mirrors the server's rules so people get feedback before a round trip.
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USERNAME = /^[a-zA-Z0-9_]{3,30}$/;

interface FieldErrors {
  email?: string;
  username?: string;
  password?: string;
}

export default function SignupScreen({ navigation }: RootScreenProps<"Signup">) {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isArtist, setIsArtist] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const signup = useAuthStore((s) => s.signup);

  const submit = async () => {
    const next: FieldErrors = {};
    if (!EMAIL.test(email.trim())) next.email = "Enter a valid email address.";
    if (!USERNAME.test(username.trim())) next.username = "3-30 letters, numbers or underscores.";
    if (password.length < 8) next.password = "Use at least 8 characters.";
    setErrors(next);
    setFormError(null);
    if (Object.keys(next).length > 0) return;

    setLoading(true);
    try {
      await signup({ email: email.trim(), password, username: username.trim(), isArtist });
    } catch (err) {
      setFormError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + spacing.xl }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInDown.duration(duration.slow)}>
          <AppText variant="title1" accessibilityRole="header">
            Join E-ArtGalla.
          </AppText>
          <AppText variant="body" color="secondary" style={styles.sub}>
            Discover art, follow artists, and collect what moves you.
          </AppText>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(duration.slow).delay(100)} style={styles.form}>
          <TextField
            label="Username"
            value={username}
            onChangeText={setUsername}
            error={errors.username}
            autoCapitalize="none"
            autoComplete="username-new"
            returnKeyType="next"
          />
          <TextField
            label="Email"
            value={email}
            onChangeText={setEmail}
            error={errors.email}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            textContentType="emailAddress"
            returnKeyType="next"
          />
          <TextField
            label="Password"
            value={password}
            onChangeText={setPassword}
            error={errors.password}
            secure
            autoCapitalize="none"
            autoComplete="password-new"
            textContentType="newPassword"
            returnKeyType="go"
            onSubmitEditing={submit}
          />

          <View style={styles.artistRow}>
            <View style={styles.artistText}>
              <AppText variant="headline">I&apos;m an artist</AppText>
              <AppText variant="caption" color="secondary">
                I want to share and sell my artwork.
              </AppText>
            </View>
            <Switch
              value={isArtist}
              onValueChange={setIsArtist}
              trackColor={{ false: colors.elevated, true: colors.accent }}
              thumbColor={colors.text}
              accessibilityLabel="I'm an artist"
            />
          </View>

          {formError ? (
            <AppText variant="bodySmall" color="danger" style={styles.error} accessibilityLiveRegion="polite">
              {formError}
            </AppText>
          ) : null}
          <PrimaryButton label="Create account" onPress={submit} loading={loading} />
        </Animated.View>

        <View style={styles.footer}>
          <AppText variant="bodySmall" color="secondary">
            Already have an account?
          </AppText>
          <PressableScale onPress={() => navigation.replace("Login")} accessibilityRole="link" accessibilityLabel="Sign in" hitSlop={10}>
            <AppText variant="bodySmall" color="accent">
              Sign in
            </AppText>
          </PressableScale>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  content: { paddingHorizontal: spacing.screen, paddingTop: spacing.xl },
  sub: { marginTop: spacing.sm },
  form: { marginTop: spacing.xxl },
  artistRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.lg,
    marginBottom: spacing.xl,
    backgroundColor: colors.surface,
    borderRadius: radius.sm,
    gap: spacing.md,
  },
  artistText: { flex: 1, gap: 2 },
  error: { marginBottom: spacing.lg },
  footer: { flexDirection: "row", justifyContent: "center", gap: spacing.sm, marginTop: spacing.xl },
});
