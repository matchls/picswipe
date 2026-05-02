import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  Image,
  StyleSheet,
  Alert,
  Pressable,
} from "react-native";
import useDecisionStore from "../../src/store/useDecisionStore";
import * as MediaLibrary from "expo-media-library";

export default function ReviewScreen() {
  const toDelete = useDecisionStore((s) => s.toDelete);
  const clearDelete = useDecisionStore((s) => s.clearDelete);
  async function handleDelete() {
    try {
      await MediaLibrary.deleteAssetsAsync(toDelete.map((p) => p.id));
      clearDelete();
    } catch (error) {
      Alert.alert("Erreur", String(error));
    }
  }
  return (
    <View style={styles.container}>
      <FlatList
        data={toDelete}
        keyExtractor={(item) => item.id}
        numColumns={3}
        renderItem={({ item }) => (
          <Image source={{ uri: item.uri }} style={styles.thumbnail} />
        )}
      ></FlatList>
      <Pressable onPress={handleDelete} style={styles.deleteButton}>
        <Text style={styles.deleteButtonText}>
          Supprimer {toDelete.length} photo(s)
        </Text>
      </Pressable>
    </View>
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
  },
  deleteButton: {
    backgroundColor: "#ef4444",
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
});
