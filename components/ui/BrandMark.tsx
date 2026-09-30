import React from "react";
import { StyleSheet, View } from "react-native";
import { colors } from "../../constants/theme";

// A small nod to the Kenyan flag: red, a hairline of white, green. Used sparingly.
export function BrandMark({ width = 28 }: { width?: number }) {
  const seg = (width - 2) / 2;
  return (
    <View style={styles.row} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      <View style={{ width: seg, height: 3, backgroundColor: colors.kenyaRed }} />
      <View style={{ width: 2, height: 3, backgroundColor: colors.text }} />
      <View style={{ width: seg, height: 3, backgroundColor: colors.kenyaGreen }} />
    </View>
  );
}

const styles = StyleSheet.create({ row: { flexDirection: "row" } });
