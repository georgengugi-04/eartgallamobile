import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useCartStore } from "../../store/cartStore";
import { createOrderRequest } from "../../api/endpoints";
import { RootScreenProps } from "../../types/navigation";
import { getErrorMessage } from "../../utils/errors";
import { colors } from "../../constants/theme";

export default function CartScreen({ navigation }: RootScreenProps<"Cart">) {
  const { items, removeItem, total, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleCheckout = async () => {
    if (items.length === 0) return;
    if (!phoneNumber.match(/^2547\d{8}$/)) {
      Alert.alert("Invalid phone number", "Enter your M-Pesa number as 2547XXXXXXXX");
      return;
    }
    setLoading(true);
    try {
      const order = await createOrderRequest(
        items.map((i) => ({ artworkId: i.id })),
        phoneNumber
      );
      clearCart();
      Alert.alert(
        "Check your phone",
        `An M-Pesa prompt was sent to ${phoneNumber}. Order #${order.id} — KSh ${order.total.toLocaleString()}. Complete payment on your phone to confirm.`
      );
      navigation.navigate("Orders");
    } catch (err) {
      Alert.alert("Checkout failed", getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>

      <FlatList
        data={items}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        ListEmptyComponent={<Text style={styles.empty}>Your cart is empty.</Text>}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Image source={{ uri: item.imageUrl }} style={styles.thumb} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
              <Text style={styles.price}>KSh {item.price.toLocaleString()}</Text>
            </View>
            <TouchableOpacity onPress={() => removeItem(item.id)}>
              <Text style={styles.remove}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {items.length > 0 && (
        <View style={styles.footer}>
          <Text style={styles.totalText}>Total: KSh {total().toLocaleString()}</Text>
          <TextInput
            style={styles.phoneInput}
            placeholder="M-Pesa number e.g. 254712345678"
            placeholderTextColor={colors.textSecondary}
            keyboardType="phone-pad"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />
          <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout} disabled={loading}>
            {loading ? <ActivityIndicator color={colors.text} /> : <Text style={styles.checkoutText}>Pay with M-Pesa</Text>}
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, paddingTop: 8 },
  header: { fontSize: 24, fontWeight: "700", color: colors.text, paddingHorizontal: 16, marginBottom: 16 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
  },
  thumb: { width: 56, height: 56, borderRadius: 8, backgroundColor: colors.elevated },
  title: { color: colors.text, fontWeight: "600" },
  price: { color: colors.accent, marginTop: 4 },
  remove: { color: colors.danger, fontSize: 13 },
  empty: { color: colors.textSecondary, textAlign: "center", marginTop: 60 },
  footer: { padding: 16, borderTopWidth: 1, borderTopColor: colors.surface },
  totalText: { color: colors.text, fontSize: 18, fontWeight: "700", marginBottom: 12 },
  phoneInput: {
    backgroundColor: colors.surface,
    color: colors.text,
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  checkoutButton: { backgroundColor: colors.accent, borderRadius: 12, padding: 16, alignItems: "center" },
  checkoutText: { color: colors.onAccent, fontWeight: "700", fontSize: 16 },
});
