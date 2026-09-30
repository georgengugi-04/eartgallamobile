import React, { useState } from "react";
import { StyleSheet, TextInput, TextInputProps, View } from "react-native";
import Animated, { interpolateColor, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { Eye, EyeOff } from "lucide-react-native";
import { colors, fonts, layout, radius, spacing } from "../../constants/theme";
import { duration } from "../../constants/motion";
import { AppText } from "./AppText";
import { IconButton } from "./IconButton";

interface Props extends Omit<TextInputProps, "style"> {
  label: string;
  error?: string | null;
  secure?: boolean;
}

export function TextField({ label, error, secure, onFocus, onBlur, ...rest }: Props) {
  const [hidden, setHidden] = useState(!!secure);
  const focus = useSharedValue(0);
  const border = useAnimatedStyle(() => ({
    borderColor: error
      ? colors.danger
      : interpolateColor(focus.value, [0, 1], [colors.border, colors.accent]),
  }));

  return (
    <View style={styles.wrap}>
      <AppText variant="label" color="secondary" style={styles.label}>
        {label}
      </AppText>
      <Animated.View style={[styles.box, border]}>
        <TextInput
          {...rest}
          style={styles.input}
          secureTextEntry={hidden}
          placeholderTextColor={colors.muted}
          selectionColor={colors.accent}
          accessibilityLabel={label}
          onFocus={(e) => {
            focus.value = withTiming(1, { duration: duration.base });
            onFocus?.(e);
          }}
          onBlur={(e) => {
            focus.value = withTiming(0, { duration: duration.base });
            onBlur?.(e);
          }}
        />
        {secure ? (
          <IconButton
            icon={hidden ? Eye : EyeOff}
            iconSize={20}
            color={colors.textSecondary}
            onPress={() => setHidden((h) => !h)}
            accessibilityLabel={hidden ? "Show password" : "Hide password"}
          />
        ) : null}
      </Animated.View>
      {error ? (
        <AppText variant="caption" color="danger" style={styles.error} accessibilityLiveRegion="polite">
          {error}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: spacing.lg },
  label: { marginBottom: spacing.sm },
  box: {
    minHeight: layout.buttonHeight,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radius.sm,
    borderWidth: StyleSheet.hairlineWidth * 2,
    paddingLeft: spacing.lg,
    paddingRight: spacing.xs,
  },
  input: { flex: 1, color: colors.text, fontFamily: fonts.ui, fontSize: 16, paddingVertical: spacing.md },
  error: { marginTop: spacing.xs },
});
