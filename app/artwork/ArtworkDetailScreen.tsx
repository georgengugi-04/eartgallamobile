import React from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import { fetchArtworkById } from "../../api/endpoints";
import { useCartStore } from "../../store/cartStore";
import { useAuthStore } from "../../store/authStore";
import { RootScreenProps } from "../../types/navigation";
import { colors } from "../../constants/theme";

export default function ArtworkDetailScreen({ route, navigation }: RootScreenProps<"ArtworkDetail">) {
  const { id } = route.params;
  const addItem = useCartStore((s) => s.addItem);
  const user = useAuthStore((s) => s.user);

  const { data: artwork, isLoading } = useQuery({
    queryKey: ["artwork", id],
    queryFn: () => fetchArtworkById(id),
  });

  if (isLoading || !artwork) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.accent} />
      </View>
    );
  }

  const handleAddToCart = () => {
    addItem(artwork);
    Alert.alert("Added to cart", `${artwork.title} added to your cart.`);
  };

  const handleMessageArtist = () => {
    navigation.navigate("ChatThread", {
      userId: artwork.artist.id,
      username: artwork.artist.username,
    });
  };

  const isOwnArtwork = user?.id === artwork.artist.id;

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: artwork.imageUrl }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.title}>{artwork.title}</Text>
        <TouchableOpacity onPress={() => navigation.navigate("ArtistProfile", { id: artwork.artist.id })}>
          <Text style={styles.artist}>by {artwork.artist.username}</Text>
        </TouchableOpacity>

        <Text style={styles.price}>KSh {artwork.price.toLocaleString()}</Text>
        <Text style={styles.category}>{artwork.category}</Text>

        {artwork.description && <Text style={styles.description}>{artwork.description}</Text>}

        {!isOwnArtwork && (
          <View style={styles.actions}>
            <TouchableOpacity style={styles.primaryButton} onPress={handleAddToCart}>
              <Text style={styles.primaryButtonText}>Add to Cart</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryButton} onPress={handleMessageArtist}>
              <Text style={styles.secondaryButtonText}>Message Artist</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.bg },
  image: { width: "100%", height: 380, backgroundColor: colors.elevated },
  content: { padding: 20 },
  title: { color: colors.text, fontSize: 24, fontWeight: "700" },
  artist: { color: colors.accent, fontSize: 15, marginTop: 6 },
  price: { color: colors.text, fontSize: 22, fontWeight: "700", marginTop: 14 },
  category: { color: colors.textSecondary, fontSize: 13, marginTop: 4, textTransform: "uppercase" },
  description: { color: colors.textSecondary, fontSize: 15, lineHeight: 22, marginTop: 16 },
  actions: { marginTop: 28, gap: 12 },
  primaryButton: { backgroundColor: colors.accent, borderRadius: 12, padding: 16, alignItems: "center" },
  primaryButtonText: { color: colors.onAccent, fontWeight: "700", fontSize: 16 },
  secondaryButton: {
    borderColor: colors.accent,
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  secondaryButtonText: { color: colors.accent, fontWeight: "600", fontSize: 16 },
});
