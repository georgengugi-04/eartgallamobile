import React from "react";
import { RefreshControlProps, ScrollView, StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../../constants/theme";

interface Props {
  children: React.ReactNode;
  scroll?: boolean;
  // Tab screens have no native header, so they need the status-bar inset.
  safeTop?: boolean;
  refreshControl?: React.ReactElement<RefreshControlProps>;
  contentContainerStyle?: StyleProp<ViewStyle>;
}

export function Screen({ children, scroll, safeTop = false, refreshControl, contentContainerStyle }: Props) {
  const insets = useSafeAreaInsets();
  const top = safeTop ? insets.top : 0;

  if (scroll) {
    return (
      <ScrollView
        style={styles.root}
        contentContainerStyle={[{ paddingTop: top }, contentContainerStyle]}
        showsVerticalScrollIndicator={false}
        refreshControl={refreshControl}
      >
        {children}
      </ScrollView>
    );
  }
  return <View style={[styles.root, { paddingTop: top }]}>{children}</View>;
}

const styles = StyleSheet.create({ root: { flex: 1, backgroundColor: colors.bg } });
