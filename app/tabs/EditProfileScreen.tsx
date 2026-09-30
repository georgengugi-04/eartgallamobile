import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useAuthStore } from "../../store/authStore";
import api from "../../api/client";
import { RootScreenProps } from "../../types/navigation";
import { getErrorMessage } from "../../utils/errors";
import { imageFile } from "../../utils/upload";
import { colors } from "../../constants/theme";

export default function EditProfileScreen({ navigation }: RootScreenProps<"EditProfile">) {
  const user = useAuthStore((s) => s.user);
  const [username, setUsername] = useState(user?.username ?? "");
  const [bio, setBio] = useState(user?.bio ?? "");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.8,
      allowsEditing: true,
      aspect: [1, 1],
    });
    if (!result.canceled) setImageUri(result.assets[0].uri);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("bio", bio);
      if (imageUri) {
        formData.append("avatar", imageFile(imageUri, "avatar.jpg"));
      }
      await api.put("/users/me", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      Alert.alert("Saved", "Your profile was updated.");
      navigation.goBack();
    } catch (err) {
      Alert.alert("Update failed", getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>

      <TouchableOpacity onPress={pickImage} style={styles.avatarWrap}>
        <Image
          source={{ uri: imageUri || user?.avatarUrl || "https://via.placeholder.com/100" }}
          style={styles.avatar}
        />
        <Text style={styles.changePhoto}>Change photo</Text>
      </TouchableOpacity>

      <TextInput style={styles.input} placeholder="Username" value={username} onChangeText={setUsername} />
      <TextInput
        style={[styles.input, { height: 100 }]}
        placeholder="Bio"
        multiline
        value={bio}
        onChangeText={setBio}
      />

      <TouchableOpacity style={styles.button} onPress={handleSave} disabled={loading}>
        {loading ? <ActivityIndicator color={colors.text} /> : <Text style={styles.buttonText}>Save Changes</Text>}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, paddingTop: 8, paddingHorizontal: 16 },
  header: { fontSize: 22, fontWeight: "700", color: colors.text, marginBottom: 24 },
  avatarWrap: { alignItems: "center", marginBottom: 24 },
  avatar: { width: 100, height: 100, borderRadius: 50, backgroundColor: colors.elevated },
  changePhoto: { color: colors.accent, marginTop: 8, fontWeight: "600" },
  input: { backgroundColor: colors.surface, color: colors.text, borderRadius: 12, padding: 14, marginBottom: 14 },
  button: { backgroundColor: colors.accent, borderRadius: 12, padding: 16, alignItems: "center" },
  buttonText: { color: colors.onAccent, fontWeight: "700" },
});
