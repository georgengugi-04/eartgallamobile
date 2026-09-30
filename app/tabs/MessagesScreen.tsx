import React from "react";
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { fetchConversations } from "../../api/endpoints";
import { RootScreenProps } from "../../types/navigation";
import { colors } from "../../constants/theme";

export default function MessagesScreen({ navigation }: RootScreenProps<"Messages">) {
  const { data: conversations, isLoading } = useQuery({
    queryKey: ["conversations"],
    queryFn: fetchConversations,
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
        data={conversations ?? []}
        keyExtractor={(item) => String(item.partner.id)}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        ListEmptyComponent={<Text style={styles.empty}>No conversations yet.</Text>}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.row}
            onPress={() =>
              navigation.navigate("ChatThread", {
                userId: item.partner.id,
                username: item.partner.username,
              })
            }
          >
            <Image
              source={{ uri: item.partner.avatarUrl || "https://via.placeholder.com/50" }}
              style={styles.avatar}
            />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.name}>{item.partner.username}</Text>
              <Text style={styles.preview} numberOfLines={1}>{item.lastMessage.content}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, paddingTop: 8 },
  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.bg },
  header: { fontSize: 24, fontWeight: "700", color: colors.text, paddingHorizontal: 16, marginBottom: 16 },
  row: { flexDirection: "row", alignItems: "center", paddingVertical: 12, borderBottomColor: colors.surface, borderBottomWidth: 1 },
  avatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: colors.elevated },
  name: { color: colors.text, fontWeight: "600" },
  preview: { color: colors.textSecondary, marginTop: 2 },
  empty: { color: colors.textSecondary, textAlign: "center", marginTop: 60 },
});
