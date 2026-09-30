import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Bell, Bookmark } from "lucide-react-native";
import {
  AppText,
  ArtistCard,
  ArtworkCard,
  ArtworkMetadata,
  Avatar,
  Badge,
  BrandMark,
  Chip,
  EmptyState,
  IconButton,
  ListGroup,
  ListRow,
  PrimaryButton,
  SaveButton,
  Screen,
  SearchBar,
  SecondaryButton,
  SectionHeader,
  Skeleton,
  TextField,
} from "../../components/ui";
import { colors, spacing, type, TypeVariant } from "../../constants/theme";
import type { Artwork } from "../../types";

// Development-only gallery of every building block, so the look can be reviewed
// on a real device in one place. Sample artwork here is a clearly fake fixture.
const SAMPLE: Artwork = {
  id: 0,
  title: "Sample artwork title",
  price: 45000,
  category: "Abstract",
  imageUrl: "https://picsum.photos/seed/eartgalla/700/900",
  artistId: 0,
  artist: { id: 0, username: "sample_artist" },
  createdAt: "2026-01-01T00:00:00.000Z",
};

export default function DesignSystemScreen() {
  const [saved, setSaved] = useState(false);
  const [chip, setChip] = useState("Abstract");
  const [text, setText] = useState("");

  return (
    <Screen scroll contentContainerStyle={styles.content}>
      <Block title="Colours">
        <View style={styles.swatches}>
          {(["bg", "surface", "elevated", "text", "textSecondary", "muted", "accent", "kenyaRed", "kenyaGreen", "danger"] as const).map((k) => (
            <View key={k} style={styles.swatch}>
              <View style={[styles.chipColor, { backgroundColor: colors[k] }]} />
              <AppText variant="caption" color="secondary">
                {k}
              </AppText>
            </View>
          ))}
        </View>
      </Block>

      <Block title="Typography">
        {(Object.keys(type) as TypeVariant[]).map((v) => (
          <AppText key={v} variant={v} style={styles.typeRow} numberOfLines={1}>
            {v} — African art
          </AppText>
        ))}
      </Block>

      <Block title="Buttons">
        <PrimaryButton label="Enquire" onPress={() => undefined} />
        <PrimaryButton label="Collect" tone="accent" onPress={() => undefined} />
        <SecondaryButton label="Collect" onPress={() => undefined} />
        <PrimaryButton label="Loading" onPress={() => undefined} loading />
        <PrimaryButton label="Disabled" onPress={() => undefined} disabled />
      </Block>

      <Block title="Icon buttons, save, badges">
        <View style={styles.row}>
          <IconButton icon={Bell} onPress={() => undefined} accessibilityLabel="Notifications" badgeCount={3} />
          <IconButton icon={Bookmark} variant="overlay" onPress={() => undefined} accessibilityLabel="Bookmark" />
          <SaveButton saved={saved} onToggle={() => setSaved((s) => !s)} />
          <SaveButton saved={saved} onToggle={() => setSaved((s) => !s)} variant="plain" />
        </View>
        <View style={styles.row}>
          <Badge label="Available" />
          <Badge label="Sold" tone="outline" />
          <Badge label="Verified" tone="accent" />
          <BrandMark />
        </View>
      </Block>

      <Block title="Inputs and chips">
        <SearchBar value={text} onChangeText={setText} />
        <TextField label="Email" value={text} onChangeText={setText} placeholder="you@example.com" />
        <TextField label="Password" value="" onChangeText={() => undefined} secure error="Use at least 8 characters." />
        <View style={styles.row}>
          {["Cards", "Abstract", "Portrait"].map((c) => (
            <Chip key={c} label={c} selected={c === chip} onPress={() => setChip(c)} />
          ))}
        </View>
      </Block>

      <Block title="Cards">
        <View style={styles.row}>
          <View style={styles.half}>
            <ArtworkCard artwork={SAMPLE} onPress={() => undefined} saved={saved} onToggleSave={() => setSaved((s) => !s)} />
          </View>
          <View style={styles.half}>
            <ArtworkCard artwork={{ ...SAMPLE, title: "A sold piece", availability: "sold" }} onPress={() => undefined} />
          </View>
        </View>
        <View style={styles.row}>
          <ArtistCard name="sample_artist" artworkCount={12} verified onPress={() => undefined} />
          <ArtistCard name="new_artist" artworkCount={1} onPress={() => undefined} />
          <Avatar name="Amina" size={56} />
        </View>
      </Block>

      <Block title="Metadata, rows, loading, empty">
        <ArtworkMetadata
          items={[
            { label: "Medium", value: "Acrylic on canvas" },
            { label: "Year", value: "2025" },
            { label: "Edition", value: null },
            { label: "Availability", value: "Available" },
          ]}
        />
        <ListGroup>
          <ListRow icon={Bell} label="Notifications" value="On" onPress={() => undefined} />
          <ListRow icon={Bookmark} label="Sign out" onPress={() => undefined} destructive />
        </ListGroup>
        <Skeleton height={120} />
        <View style={styles.empty}>
          <EmptyState icon={Bookmark} title="No saved artwork yet." message="Follow artists to discover new work." />
        </View>
      </Block>

      <SectionHeader title="Section header" eyebrow="Eyebrow" actionLabel="See all" onActionPress={() => undefined} />
    </Screen>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.block}>
      <AppText variant="label" color="accent" style={styles.blockTitle}>
        {title}
      </AppText>
      <View style={styles.blockBody}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: spacing.xxxl * 2 },
  block: { paddingHorizontal: spacing.screen, marginTop: spacing.xxl },
  blockTitle: { marginBottom: spacing.lg },
  blockBody: { gap: spacing.md },
  swatches: { flexDirection: "row", flexWrap: "wrap", gap: spacing.md },
  swatch: { width: 72, gap: 4 },
  chipColor: { height: 40, borderRadius: 4, borderWidth: 1, borderColor: colors.borderStrong },
  typeRow: { marginBottom: spacing.xs },
  row: { flexDirection: "row", alignItems: "center", gap: spacing.md, flexWrap: "wrap" },
  half: { width: "47%" },
  empty: { height: 260 },
});
