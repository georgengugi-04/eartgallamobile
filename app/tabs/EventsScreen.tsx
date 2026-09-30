import React from "react";
import { View } from "react-native";
import { CalendarDays } from "lucide-react-native";
import { AppText, BrandMark, EmptyState, Screen } from "../../components/ui";
import { spacing } from "../../constants/theme";

// Events need an events API (Phase 4). No fabricated listings in the meantime.
export default function EventsScreen() {
  return (
    <Screen safeTop>
      <View style={{ paddingHorizontal: spacing.screen, paddingTop: spacing.lg, gap: spacing.md }}>
        <BrandMark />
        <AppText variant="title1" accessibilityRole="header">
          Events
        </AppText>
      </View>
      <EmptyState
        icon={CalendarDays}
        title="No upcoming events."
        message="Exhibitions, workshops and gatherings from E-ArtGalla will appear here."
      />
    </Screen>
  );
}
