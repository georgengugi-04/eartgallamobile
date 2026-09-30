import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { uploadArtwork } from "../../api/endpoints";
import { useAuthStore } from "../../store/authStore";
import { RootScreenProps } from "../../types/navigation";
import { getErrorMessage } from "../../utils/errors";
import { imageFile } from "../../utils/upload";
import { colors } from "../../constants/theme";

const CATEGORIES = ["Cards", "Illustration", "Portrait", "Abstract"];

export default function UploadScreen({ navigation }: RootScreenProps<"Upload">) {
  const user = useAuthStore((s) => s.user);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!user?.isArtist) {
    return (
      <View style={styles.center}>
        <Text style={styles.notArtist}>Only artist accounts can upload artwork.</Text>
      </View>
    );
  }

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.8,
    });
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleUpload = async () => {
    if (!title || !price || !imageUri) {
      Alert.alert("Missing fields", "Title, price, and image are required.");
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("image", imageFile(imageUri, "artwork.jpg"));

      await uploadArtwork(formData);
      Alert.alert("Success", "Your artwork has been uploaded!");
      setTitle("");
      setDescription("");
      setPrice("");
      setImageUri(null);
      navigation.goBack();
    } catch (err) {
      Alert.alert("Upload failed", getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16, paddingTop: 8 }}>

      <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.preview} />
        ) : (
          <Text style={styles.imagePickerText}>Tap to select image</Text>
        )}
      </TouchableOpacity>

      <TextInput style={styles.input} placeholder="Title" value={title} onChangeText={setTitle} />
      <TextInput
        style={[styles.input, { height: 90 }]}
        placeholder="Description"
        multiline
        value={description}
        onChangeText={setDescription}
      />
      <TextInput
        style={styles.input}
        placeholder="Price (KSh)"
        keyboardType="numeric"
        value={price}
        onChangeText={setPrice}
      />

      <View style={styles.categoryRow}>
        {CATEGORIES.map((c) => (
          <TouchableOpacity
            key={c}
            style={[styles.chip, category === c && styles.chipActive]}
            onPress={() => setCategory(c)}
          >
            <Text style={[styles.chipText, category === c && styles.chipTextActive]}>{c}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.button} onPress={handleUpload} disabled={loading}>
        {loading ? <ActivityIndicator color={colors.text} /> : <Text style={styles.buttonText}>Publish Artwork</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.bg, padding: 20 },
  notArtist: { color: colors.textSecondary, textAlign: "center" },
  header: { fontSize: 24, fontWeight: "700", color: colors.text, marginBottom: 20 },
  imagePicker: {
    height: 200,
    backgroundColor: colors.surface,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    overflow: "hidden",
  },
  imagePickerText: { color: colors.textSecondary },
  preview: { width: "100%", height: "100%" },
  input: {
    backgroundColor: colors.surface,
    color: colors.text,
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
    fontSize: 15,
  },
  categoryRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 20 },
  chip: { backgroundColor: colors.surface, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 18 },
  chipActive: { backgroundColor: colors.accent },
  chipText: { color: colors.textSecondary, fontSize: 13 },
  chipTextActive: { color: colors.onAccent, fontWeight: "600" },
  button: { backgroundColor: colors.accent, borderRadius: 12, padding: 16, alignItems: "center", marginBottom: 30 },
  buttonText: { color: colors.onAccent, fontWeight: "700", fontSize: 16 },
});
