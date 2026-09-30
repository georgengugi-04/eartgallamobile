import { DarkTheme, Theme } from "@react-navigation/native";
import { colors } from "./theme";

// Without this, React Navigation flashes its default (light) background between screens.
export const navigationTheme: Theme = {
  ...DarkTheme,
  dark: true,
  colors: {
    ...DarkTheme.colors,
    primary: colors.accent,
    background: colors.bg,
    card: colors.bg,
    text: colors.text,
    border: colors.border,
    notification: colors.accent,
  },
};
