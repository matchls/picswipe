import { Asset } from "expo-media-library";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
interface Props {
  photo: Asset;
}
export default function SwipeCard({ photo }: Props) {
  return (
    <View style={styles.card}>
      <Image source={{ uri: photo.uri }} style={styles.image} />
      <View style={styles.buttonsContainer}>
        <Pressable style={[styles.button, styles.deleteButton]}>
          <Text style={styles.buttonText}>Supprimer</Text>
        </Pressable>
        <Pressable style={[styles.button, styles.keepButton]}>
          <Text style={styles.buttonText}>Garder</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    marginVertical: 10,
  },
  image: {
    width: 300,
    height: 400,
    borderRadius: 8,
  },
  buttonsContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 20,
    marginTop: 20,
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
    width: "40%",
    alignItems: "center",
  },
  keepButton: {
    backgroundColor: "#22c55e",
  },
  deleteButton: {
    backgroundColor: "#ef4444",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
