import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { fetchThread, sendMessageRequest } from "../../api/endpoints";
import { useAuthStore } from "../../store/authStore";
import { RootScreenProps } from "../../types/navigation";
import { colors } from "../../constants/theme";

export default function ChatThreadScreen({ route }: RootScreenProps<"ChatThread">) {
  const { userId } = route.params;
  const currentUser = useAuthStore((s) => s.user);
  const [text, setText] = useState("");
  const queryClient = useQueryClient();

  const { data: messages } = useQuery({
    queryKey: ["thread", userId],
    queryFn: () => fetchThread(userId),
    refetchInterval: 5000, // simple polling; swap for WebSocket/Pusher later
  });

  const sendMutation = useMutation({
    mutationFn: () => sendMessageRequest(userId, text),
    onSuccess: () => {
      setText("");
      queryClient.invalidateQueries({ queryKey: ["thread", userId] });
    },
  });

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <FlatList
        data={messages ?? []}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <View
            style={[
              styles.bubble,
              item.senderId === currentUser?.id ? styles.myBubble : styles.theirBubble,
            ]}
          >
            <Text style={styles.bubbleText}>{item.content}</Text>
          </View>
        )}
      />
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          placeholderTextColor={colors.textSecondary}
          value={text}
          onChangeText={setText}
        />
        <TouchableOpacity
          style={styles.sendButton}
          onPress={() => text.trim() && sendMutation.mutate()}
        >
          <Text style={styles.sendText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, paddingTop: 8 },
  header: { fontSize: 18, fontWeight: "700", color: colors.text, paddingHorizontal: 16, marginBottom: 10 },
  bubble: { padding: 12, borderRadius: 14, marginBottom: 8, maxWidth: "75%" },
  myBubble: { backgroundColor: colors.elevated, borderWidth: 1, borderColor: colors.accent, alignSelf: "flex-end" },
  theirBubble: { backgroundColor: colors.surface, alignSelf: "flex-start" },
  bubbleText: { color: colors.text },
  inputRow: { flexDirection: "row", padding: 12, borderTopColor: colors.surface, borderTopWidth: 1 },
  input: { flex: 1, backgroundColor: colors.surface, color: colors.text, borderRadius: 20, paddingHorizontal: 16 },
  sendButton: { justifyContent: "center", paddingHorizontal: 16 },
  sendText: { color: colors.accent, fontWeight: "700" },
});
