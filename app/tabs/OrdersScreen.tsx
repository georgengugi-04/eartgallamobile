import React from "react";
import { View, Text, FlatList, Image, StyleSheet, ActivityIndicator } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { fetchMyOrders } from "../../api/endpoints";
import { colors } from "../../constants/theme";

export default function OrdersScreen() {
  const { data: orders, isLoading } = useQuery({
    queryKey: ["myOrders"],
    queryFn: fetchMyOrders,
  });

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.accent} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={orders ?? []}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        ListEmptyComponent={<Text style={styles.empty}>No orders yet.</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.orderId}>Order #{item.id}</Text>
              <Text style={[styles.status, statusStyle(item.status)]}>{item.status}</Text>
            </View>
            {item.items.map((orderItem) => (
              <View key={orderItem.id} style={styles.itemRow}>
                <Image source={{ uri: orderItem.artwork.imageUrl }} style={styles.thumb} />
                <Text style={styles.itemTitle} numberOfLines={1}>{orderItem.artwork.title}</Text>
                <Text style={styles.itemPrice}>KSh {orderItem.price.toLocaleString()}</Text>
              </View>
            ))}
            <Text style={styles.total}>Total: KSh {item.total.toLocaleString()}</Text>
          </View>
        )}
      />
    </View>
  );
}

function statusStyle(status: string) {
  switch (status) {
    case "paid":
    case "completed":
      return { color: colors.success };
    case "failed":
      return { color: colors.danger };
    default:
      return { color: colors.warning };
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, paddingTop: 8 },
  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.bg },
  header: { fontSize: 24, fontWeight: "700", color: colors.text, paddingHorizontal: 16, marginBottom: 16 },
  card: { backgroundColor: colors.surface, borderRadius: 14, padding: 14, marginBottom: 14 },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },
  orderId: { color: colors.text, fontWeight: "700" },
  status: { fontWeight: "700", textTransform: "capitalize" },
  itemRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  thumb: { width: 40, height: 40, borderRadius: 6, backgroundColor: colors.elevated },
  itemTitle: { color: colors.textSecondary, flex: 1, marginLeft: 10 },
  itemPrice: { color: colors.textSecondary },
  total: { color: colors.accent, fontWeight: "700", marginTop: 6, textAlign: "right" },
  empty: { color: colors.textSecondary, textAlign: "center", marginTop: 60 },
});
