import React from "react";
import { StyleSheet, TextInput, View } from "react-native";
import Animated, { interpolateColor, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { Search, X } from "lucide-react-native";
import { colors, fonts, layout, radius, spacing } from "../../constants/theme";
import { duration } from "../../constants/motion";
import { AppText } from "./AppText";
import { Icon } from "./Icon";
import { IconButton } from "./IconButton";
import { PressableScale } from "./PressableScale";

interface Props {
  value?: string;
  onChangeText?: (text: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
  // When set, the bar is a tappable entry point (e.g. on Home) instead of an input.
  onPress?: () => void;
  autoFocus?: boolean;
}

export function SearchBar({
  value = "",
  onChangeText,
  onSubmit,
  placeholder = "Search artists, artworks, styles...",
  onPress,
  autoFocus,
}: Props) {
  const focus = useSharedValue(0);
  const border = useAnimatedStyle(() => ({
    borderColor: interpolateColor(focus.value, [0, 1], [colors.border, colors.accent]),
  }));

  if (onPress) {
    return (
      <PressableScale onPress={onPress} accessibilityRole="search" accessibilityLabel="Search" scaleTo={0.99}>
        <View style={[styles.box, styles.staticBorder]}>
          <Icon icon={Search} size={20} color={colors.textSecondary} />
          <AppText variant="body" color="secondary" numberOfLines={1} style={styles.flex}>
            {placeholder}
          </AppText>
        </View>
      </PressableScale>
    );
  }

  return (
    <Animated.View style={[styles.box, styles.animatedBorder, border]}>
      <Icon icon={Search} size={20} color={colors.textSecondary} />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmit}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
        selectionColor={colors.accent}
        returnKeyType="search"
        autoCorrect={false}
        autoCapitalize="none"
        autoFocus={autoFocus}
        accessibilityLabel="Search"
        onFocus={() => (focus.value = withTiming(1, { duration: duration.base }))}
        onBlur={() => (focus.value = withTiming(0, { duration: duration.base }))}
      />
      {value ? <IconButton icon={X} iconSize={18} onPress={() => onChangeText?.("")} accessibilityLabel="Clear search" /> : null}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  box: {
    minHeight: layout.buttonHeight,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingLeft: spacing.lg,
    paddingRight: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.sm,
  },
  staticBorder: { borderWidth: StyleSheet.hairlineWidth * 2, borderColor: colors.border, paddingRight: spacing.lg },
  animatedBorder: { borderWidth: StyleSheet.hairlineWidth * 2 },
  flex: { flex: 1 },
  input: { flex: 1, color: colors.text, fontFamily: fonts.ui, fontSize: 16, paddingVertical: spacing.md },
});
