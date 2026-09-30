import React from "react";
import { View } from "react-native";
import { Bookmark } from "lucide-react-native";
import { AppText, BrandMark, EmptyState, Screen } from "../../components/ui";
import { spacing } from "../../constants/theme";

// Collections need the saved-artwork and collection APIs, which don't exist yet.
// Until they do, this screen is honest about it instead of showing fake data.
export default function CollectionsScreen() {
  return (
    <Screen safeTop>
      <View style={{ paddingHorizontal: spacing.screen, paddingTop: spacing.lg, gap: spacing.md }}>
        <BrandMark />
        <AppText variant="title1" accessibilityRole="header">
          Collections
        </AppText>
      </View>
      <EmptyState
        icon={Bookmark}
        title="No saved artwork yet."
        message="Soon you'll be able to save pieces you love and arrange them into your own collections."
      />
    </Screen>
  );
}
