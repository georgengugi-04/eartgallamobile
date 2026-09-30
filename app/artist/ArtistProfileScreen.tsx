import React, { useState } from "react";
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { fetchUserProfile, fetchArtworksByArtist, followUserRequest, unfollowUserRequest } from "../../api/endpoints";
import { RootScreenProps } from "../../types/navigation";
import { colors } from "../../constants/theme";

export default function ArtistProfileScreen({ route, navigation }: RootScreenProps<"ArtistProfile">) {
  const { id } = route.params;
  const [isFollowing, setIsFollowing] = useState(false);

  const { data: artist, isLoading } = useQuery({
    queryKey: ["artist", id],
    queryFn: () => fetchUserProfile(id),
  });

  const { data: artworks } = useQuery({
    queryKey: ["artistArtworks", id],
    queryFn: () => fetchArtworksByArtist(id),
  });

  const toggleFollow = async () => {
    try {
      if (isFollowing) {
        await unfollowUserRequest(id);
      } else {
        await followUserRequest(id);
      }
      setIsFollowing(!isFollowing);
    } catch {}
  };

  if (isLoading || !artist) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.accent} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Image source={{ uri: artist.avatarUrl || "https://via.placeholder.com/80" }} style={styles.avatar} />
        <View style={{ marginLeft: 16, flex: 1 }}>
          <Text style={styles.username}>{artist.username}</Text>
          <Text style={styles.followStats}>
            {artist._count?.followedBy ?? 0} followers · {artist._count?.artworks ?? 0} artworks
          </Text>
        </View>
      </View>

      {artist.bio && <Text style={styles.bio}>{artist.bio}</Text>}

      <TouchableOpacity style={styles.followButton} onPress={toggleFollow}>
        <Text style={styles.followText}>{isFollowing ? "Following" : "Follow"}</Text>
      </TouchableOpacity>

      <FlatList
        data={artworks ?? []}
        keyExtractor={(item) => String(item.id)}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate("ArtworkDetail", { id: item.id })}>
            <Image source={{ uri: item.imageUrl }} style={styles.gridImage} />
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, paddingTop: 8, paddingHorizontal: 16 },
  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.bg },
  headerRow: { flexDirection: "row", alignItems: "center", marginBottom: 14 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: colors.elevated },
  username: { color: colors.text, fontSize: 20, fontWeight: "700" },
  followStats: { color: colors.textSecondary, marginTop: 4 },
  bio: { color: colors.textSecondary, marginBottom: 16 },
  followButton: { backgroundColor: colors.accent, borderRadius: 12, padding: 14, alignItems: "center", marginBottom: 20 },
  followText: { color: colors.onAccent, fontWeight: "700" },
  gridImage: { width: "48%", height: 150, marginBottom: 12, borderRadius: 10, backgroundColor: colors.elevated },
});
