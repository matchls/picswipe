import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  Alert,
  Pressable,
  ActivityIndicator,
} from "react-native";
import useDecisionStore from "../../src/store/useDecisionStore";
import { colors } from "../../src/theme/colors";
import * as MediaLibrary from "expo-media-library";
import { SafeAreaView } from "react-native-safe-area-context";

import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";

export default function ReviewScreen() {
  const toDelete = useDecisionStore((s) => s.toDelete);
  const clearDelete = useDecisionStore((s) => s.clearDelete);
  const removeFromDelete = useDecisionStore((s) => s.removeFromDelete);
  const addDeletedStats = useDecisionStore((s) => s.addDeletedStats);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    Alert.alert(
      "Confirmer la suppression",
      `Supprimer ${toDelete.length} photo(s) définitivement ?`,
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: async () => {
            try {
              setIsDeleting(true);
              const assetsInfo = await Promise.all(
                toDelete.map((p) => MediaLibrary.getAssetInfoAsync(p.id)),
              );
              const totalSize = assetsInfo.reduce(
                (sum, info) => sum + ((info as any).fileSize ?? 3_000_000),
                0,
              );
              await MediaLibrary.deleteAssetsAsync(toDelete.map((p) => p.id));
              addDeletedStats(toDelete.length, totalSize);
              clearDelete();
            } catch (error) {
              Alert.alert("Erreur", String(error));
            } finally {
              setIsDeleting(false);
            }
          },
        },
      ],
    );
  }
  if (toDelete.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="checkmark-circle-outline" size={80} color={colors.green.primary} />
        <Text style={styles.emptyText}>Aucune photo à supprimer</Text>
      </View>
    );
  }
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <FlatList
          data={toDelete}
          keyExtractor={(item) => item.id}
          numColumns={3}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => removeFromDelete(item.id)}
              style={styles.thumbnail}
            >
              <Image source={{ uri: item.uri }} style={styles.thumbnailImage} />
              <View style={styles.removeIcon}>
                <Text style={{ color: "white", fontWeight: "bold" }}>✕</Text>
              </View>
            </Pressable>
          )}
        ></FlatList>
        <Pressable
          onPress={handleDelete}
          style={styles.deleteButton}
          disabled={isDeleting}
        >
          {isDeleting ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.deleteButtonText}>
              Supprimer {toDelete.length} photo(s)
            </Text>
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  thumbnail: {
    width: "33%",
    aspectRatio: 1,
    padding: 2,
    position: "relative",
  },
  thumbnailImage: {
    width: "100%",
    height: "100%",
  },
  removeIcon: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  deleteButton: {
    backgroundColor: colors.red.primary,
    padding: 16,
    margin: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  deleteButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  emptyText: {
    fontSize: 18,
    color: colors.gray.medium,
  },
});
