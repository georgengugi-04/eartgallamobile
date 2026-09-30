import React, { useMemo } from "react";
import { FlatList, RefreshControl, StyleSheet, View } from "react-native";
import { MessageCircle, ShoppingBag, Sparkles } from "lucide-react-native";
import {
  AppText,
  ArtworkCard,
  BrandMark,
  Chip,
  EmptyState,
  ErrorState,
  FeaturedArtwork,
  IconButton,
  Screen,
  SearchBar,
  SectionHeader,
  Skeleton,
} from "../../components/ui";
import { CATEGORIES } from "../../constants/categories";
import { colors, radius, spacing } from "../../constants/theme";
import { useArtworks } from "../../hooks/useArtworks";
import { useAuthStore } from "../../store/authStore";
import { useCartStore } from "../../store/cartStore";
import { TabScreenProps } from "../../types/navigation";
import { greeting } from "../../utils/format";

const RAIL_WIDTH = 168;

export default function HomeScreen({ navigation }: TabScreenProps<"Home">) {
  const user = useAuthStore((s) => s.user);
  const cartCount = useCartStore((s) => s.items.length);
  const { data, isLoading, isError, refetch, isRefetching } = useArtworks();

  // Only real data: the newest piece is the hero, the rest fill the rail.
  const artworks = useMemo(() => data?.pages[0]?.data ?? [], [data]);
  const hero = artworks[0];
  const recent = artworks.slice(1, 9);

  const open = (id: number) => navigation.navigate("ArtworkDetail", { id });

  return (
    <Screen
      scroll
      safeTop
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={colors.accent} />}
    >
      <View style={styles.top}>
        <View style={styles.flex}>
          <BrandMark />
          <AppText variant="title1" accessibilityRole="header" style={styles.greeting}>
            {greeting()}
            {user ? `, ${user.username}.` : "."}
          </AppText>
          <AppText variant="body" color="secondary">
            Discover something worth looking at.
          </AppText>
        </View>
        <View style={styles.actions}>
          <IconButton icon={MessageCircle} onPress={() => navigation.navigate("Messages")} accessibilityLabel="Messages" />
          <IconButton icon={ShoppingBag} onPress={() => navigation.navigate("Cart")} accessibilityLabel="Cart" badgeCount={cartCount} />
        </View>
      </View>

      <View style={styles.search}>
        <SearchBar onPress={() => navigation.navigate("Explore")} />
      </View>

      {isLoading ? (
        <HomeSkeleton />
      ) : isError ? (
        <View style={styles.state}>
          <ErrorState onRetry={() => refetch()} />
        </View>
      ) : !hero ? (
        <View style={styles.state}>
          <EmptyState icon={Sparkles} title="No artwork yet." message="New pieces will appear here as artists upload them." />
        </View>
      ) : (
        <>
          <FeaturedArtwork artwork={hero} eyebrow="New arrival" onPress={() => open(hero.id)} />

          <View style={styles.section}>
            <SectionHeader title="Explore by category" />
            <FlatList
              horizontal
              data={CATEGORIES}
              keyExtractor={(c) => c}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.chips}
              renderItem={({ item }) => <Chip label={item} onPress={() => navigation.navigate("Explore", { category: item })} />}
            />
          </View>

          {recent.length > 0 ? (
            <View style={styles.section}>
              <SectionHeader
                title="Recently added"
                actionLabel="See all"
                onActionPress={() => navigation.navigate("Explore")}
              />
              <FlatList
                horizontal
                data={recent}
                keyExtractor={(a) => String(a.id)}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.rail}
                renderItem={({ item }) => <ArtworkCard artwork={item} width={RAIL_WIDTH} onPress={() => open(item.id)} />}
              />
            </View>
          ) : null}
        </>
      )}
    </Screen>
  );
}

function HomeSkeleton() {
  return (
    <View style={styles.skeleton}>
      <Skeleton height={460} borderRadius={radius.sm} />
      <Skeleton height={20} width="40%" style={styles.skeletonLine} />
      <Skeleton height={14} width="70%" style={styles.skeletonLine} />
    </View>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: spacing.xxxl },
  flex: { flex: 1 },
  top: { flexDirection: "row", paddingHorizontal: spacing.screen, paddingTop: spacing.lg, gap: spacing.md },
  greeting: { marginTop: spacing.md, marginBottom: spacing.xs },
  actions: { flexDirection: "row", marginRight: -spacing.sm },
  search: { paddingHorizontal: spacing.screen, marginTop: spacing.xl, marginBottom: spacing.xl },
  section: { marginTop: spacing.xxl },
  chips: { paddingHorizontal: spacing.screen, gap: spacing.sm },
  rail: { paddingHorizontal: spacing.screen, gap: spacing.lg },
  state: { minHeight: 320 },
  skeleton: { paddingHorizontal: spacing.screen },
  skeletonLine: { marginTop: spacing.lg },
});
