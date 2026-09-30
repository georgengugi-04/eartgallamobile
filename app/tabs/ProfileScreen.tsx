import React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { Image } from "expo-image";
import { LogOut, MessageCircle, Package, Palette, Pencil, ShoppingBag, Upload } from "lucide-react-native";
import { AppText, Avatar, Badge, BrandMark, ListGroup, ListRow, PressableScale, Screen, SectionHeader } from "../../components/ui";
import { colors, radius, spacing } from "../../constants/theme";
import { useAuthStore } from "../../store/authStore";
import { useCartStore } from "../../store/cartStore";
import { fetchArtworksByArtist, fetchMyOrders } from "../../api/endpoints";
import { TabScreenProps } from "../../types/navigation";
import { sizedImage } from "../../utils/image";

export default function ProfileScreen({ navigation }: TabScreenProps<"Profile">) {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const cartCount = useCartStore((s) => s.items.length);

  const { data: myArtworks } = useQuery({
    queryKey: ["myArtworks", user?.id],
    queryFn: () => fetchArtworksByArtist(user!.id),
    enabled: !!user?.isArtist,
  });

  const { data: myOrders } = useQuery({ queryKey: ["myOrders"], queryFn: fetchMyOrders });

  if (!user) return null;

  return (
    <Screen scroll safeTop contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <BrandMark />
        <View style={styles.identity}>
          <Avatar uri={user.avatarUrl} name={user.username} size={72} />
          <View style={styles.identityText}>
            <AppText variant="title2" numberOfLines={1} accessibilityRole="header">
              {user.username}
            </AppText>
            <AppText variant="bodySmall" color="secondary" numberOfLines={1}>
              {user.email}
            </AppText>
            {user.isArtist ? <Badge label="Artist" tone="accent" icon={Palette} /> : null}
          </View>
        </View>
        {user.bio ? (
          <AppText variant="body" color="secondary" style={styles.bio}>
            {user.bio}
          </AppText>
        ) : null}
      </View>

      <View style={styles.stats}>
        {user.isArtist ? <Stat value={myArtworks?.length ?? 0} label="Artworks" /> : null}
        <Stat value={myOrders?.length ?? 0} label="Orders" />
      </View>

      <ListGroup>
        <ListRow icon={Pencil} label="Edit profile" onPress={() => navigation.navigate("EditProfile")} />
        <ListRow icon={MessageCircle} label="Messages" onPress={() => navigation.navigate("Messages")} />
        <ListRow
          icon={ShoppingBag}
          label="Cart"
          value={cartCount ? String(cartCount) : undefined}
          onPress={() => navigation.navigate("Cart")}
        />
        <ListRow icon={Package} label="Order history" onPress={() => navigation.navigate("Orders")} />
        {user.isArtist ? <ListRow icon={Upload} label="Upload artwork" onPress={() => navigation.navigate("Upload")} /> : null}
        {__DEV__ ? <ListRow icon={Palette} label="Design system (dev)" onPress={() => navigation.navigate("DesignSystem")} /> : null}
        <ListRow icon={LogOut} label="Log out" onPress={logout} destructive />
      </ListGroup>

      {user.isArtist && myArtworks && myArtworks.length > 0 ? (
        <View style={styles.works}>
          <SectionHeader title="My artworks" />
          <FlatList
            data={myArtworks}
            keyExtractor={(a) => String(a.id)}
            numColumns={3}
            scrollEnabled={false}
            contentContainerStyle={styles.grid}
            columnWrapperStyle={styles.gridRow}
            renderItem={({ item }) => (
              <PressableScale
                style={styles.cell}
                onPress={() => navigation.navigate("ArtworkDetail", { id: item.id })}
                accessibilityRole="button"
                accessibilityLabel={item.title}
              >
                <Image source={{ uri: sizedImage(item.imageUrl, 400) }} style={styles.thumb} contentFit="cover" transition={250} cachePolicy="memory-disk" />
              </PressableScale>
            )}
          />
        </View>
      ) : null}
    </Screen>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <View style={styles.stat}>
      <AppText variant="title2">{value}</AppText>
      <AppText variant="label" color="secondary">
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: spacing.xxxl },
  header: { paddingHorizontal: spacing.screen, paddingTop: spacing.lg, gap: spacing.lg },
  identity: { flexDirection: "row", alignItems: "center", gap: spacing.lg },
  identityText: { flex: 1, gap: spacing.xs },
  bio: { marginTop: -spacing.xs },
  stats: { flexDirection: "row", gap: spacing.xxl, paddingHorizontal: spacing.screen, paddingVertical: spacing.xl },
  stat: { gap: 2 },
  works: { marginTop: spacing.xxl },
  grid: { paddingHorizontal: spacing.screen },
  gridRow: { gap: spacing.xs, marginBottom: spacing.xs },
  cell: { flex: 1 / 3 },
  thumb: { width: "100%", aspectRatio: 1, borderRadius: radius.sm, backgroundColor: colors.elevated },
});
