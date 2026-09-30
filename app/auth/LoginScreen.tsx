import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppText, PrimaryButton, PressableScale, TextField } from "../../components/ui";
import { colors, spacing } from "../../constants/theme";
import { duration } from "../../constants/motion";
import { useAuthStore } from "../../store/authStore";
import { RootScreenProps } from "../../types/navigation";
import { getErrorMessage } from "../../utils/errors";

export default function LoginScreen({ navigation }: RootScreenProps<"Login">) {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const login = useAuthStore((s) => s.login);

  const submit = async () => {
    if (!email.trim() || !password) {
      setError("Enter your email and password.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await login(email.trim(), password);
    } catch (err) {
      setError(getErrorMessage(err));
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
            Welcome back.
          </AppText>
          <AppText variant="body" color="secondary" style={styles.sub}>
            Sign in to continue exploring.
          </AppText>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(duration.slow).delay(100)} style={styles.form}>
          <TextField
            label="Email"
            value={email}
            onChangeText={setEmail}
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
            secure
            autoCapitalize="none"
            autoComplete="password"
            textContentType="password"
            returnKeyType="go"
            onSubmitEditing={submit}
          />
          {error ? (
            <AppText variant="bodySmall" color="danger" style={styles.error} accessibilityLiveRegion="polite">
              {error}
            </AppText>
          ) : null}
          <PrimaryButton label="Sign in" onPress={submit} loading={loading} />
        </Animated.View>

        <View style={styles.footer}>
          <AppText variant="bodySmall" color="secondary">
            New to E-ArtGalla?
          </AppText>
          <PressableScale onPress={() => navigation.replace("Signup")} accessibilityRole="link" accessibilityLabel="Create an account" hitSlop={10}>
            <AppText variant="bodySmall" color="accent">
              Create an account
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
  error: { marginBottom: spacing.lg },
  footer: { flexDirection: "row", justifyContent: "center", gap: spacing.sm, marginTop: spacing.xl },
});
