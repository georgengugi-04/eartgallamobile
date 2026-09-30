import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, View, useWindowDimensions } from "react-native";
import { Search } from "lucide-react-native";
import { AppText, ArtworkCard, BrandMark, Chip, EmptyState, ErrorState, Screen, SearchBar, Skeleton } from "../../components/ui";
import { CATEGORIES } from "../../constants/categories";
import { colors, radius, spacing } from "../../constants/theme";
import { useArtworks } from "../../hooks/useArtworks";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";
import { TabScreenProps } from "../../types/navigation";

const GAP = spacing.lg;
const FILTERS = ["All", ...CATEGORIES];

export default function ExploreScreen({ navigation, route }: TabScreenProps<"Explore">) {
  const { width } = useWindowDimensions();
  const cellWidth = (width - spacing.screen * 2 - GAP) / 2;

  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const debounced = useDebouncedValue(search.trim());

  // Home's category chips arrive as a route param.
  const incoming = route.params?.category;
  useEffect(() => {
    if (incoming) setCategory(incoming);
  }, [incoming]);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError, refetch, isRefetching } =
    useArtworks(category === "All" ? undefined : category, debounced || undefined);

  const artworks = useMemo(() => data?.pages.flatMap((p) => p.data) ?? [], [data]);

  const header = (
    <View style={styles.header}>
      <BrandMark />
      <AppText variant="title1" accessibilityRole="header" style={styles.title}>
        Explore
      </AppText>
      <SearchBar value={search} onChangeText={setSearch} />
      <FlatList
        horizontal
        data={FILTERS}
        keyExtractor={(c) => c}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chips}
        renderItem={({ item }) => <Chip label={item} selected={item === category} onPress={() => setCategory(item)} />}
      />
    </View>
  );

  return (
    <Screen safeTop>
      <FlatList
        data={isLoading || isError ? [] : artworks}
        keyExtractor={(a) => String(a.id)}
        numColumns={2}
        columnWrapperStyle={styles.column}
        contentContainerStyle={styles.content}
        ListHeaderComponent={header}
        renderItem={({ item }) => (
          <ArtworkCard artwork={item} width={cellWidth} onPress={() => navigation.navigate("ArtworkDetail", { id: item.id })} />
        )}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) fetchNextPage();
        }}
        onEndReachedThreshold={0.6}
        refreshControl={<RefreshControl refreshing={isRefetching && !isFetchingNextPage} onRefresh={refetch} tintColor={colors.accent} />}
        ListEmptyComponent={
          isLoading ? (
            <GridSkeleton cellWidth={cellWidth} />
          ) : isError ? (
            <ErrorState onRetry={() => refetch()} />
          ) : (
            <EmptyState
              icon={Search}
              title="Nothing found."
              message="Try a different search or category."
              actionLabel={search || category !== "All" ? "Clear filters" : undefined}
              onAction={() => {
                setSearch("");
                setCategory("All");
              }}
            />
          )
        }
        ListFooterComponent={isFetchingNextPage ? <ActivityIndicator color={colors.accent} style={styles.footer} /> : null}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
        initialNumToRender={6}
        windowSize={7}
      />
    </Screen>
  );
}

function GridSkeleton({ cellWidth }: { cellWidth: number }) {
  return (
    <View style={styles.skeletonGrid}>
      {Array.from({ length: 6 }).map((_, i) => (
        <View key={i} style={{ width: cellWidth }}>
          <Skeleton height={cellWidth * 1.25} borderRadius={radius.sm} />
          <Skeleton height={14} width="70%" style={styles.skeletonLine} />
          <Skeleton height={12} width="45%" style={styles.skeletonLineSmall} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingTop: spacing.lg, paddingBottom: spacing.xl, gap: spacing.md },
  title: { marginBottom: spacing.sm },
  chips: { gap: spacing.sm, paddingVertical: spacing.xs },
  content: { paddingHorizontal: spacing.screen, paddingBottom: spacing.xxxl },
  column: { gap: GAP, marginBottom: spacing.xl },
  footer: { paddingVertical: spacing.xl },
  skeletonGrid: { flexDirection: "row", flexWrap: "wrap", gap: GAP },
  skeletonLine: { marginTop: spacing.md },
  skeletonLineSmall: { marginTop: spacing.sm },
});
