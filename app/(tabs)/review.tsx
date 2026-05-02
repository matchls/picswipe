import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  Image,
  StyleSheet,
} from "react-native";
import useDecisionStore from "../../src/store/useDecisionStore";

export default function ReviewScreen() {
  const toDelete = useDecisionStore((s) => s.toDelete);
  return (
    <FlatList
      data={toDelete}
      keyExtractor={(item) => item.id}
      numColumns={3}
      renderItem={({ item }) => (
        <Image source={{ uri: item.uri }} style={styles.thumbnail} />
      )}
    ></FlatList>
  );
}

const styles = StyleSheet.create({
  thumbnail: {
    width: "33%",
    aspectRatio: 1,
    padding: 2,
  },
});
