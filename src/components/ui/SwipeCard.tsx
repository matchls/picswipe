import { Asset } from "expo-media-library";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";
import {
  useAnimatedStyle,
  interpolate,
  Extrapolation,
} from "react-native-reanimated";
import useSwipeGesture from "../../hooks/useSwipeGesture";
import useDecisionStore from "../../store/useDecisionStore";

interface Props {
  photo: Asset;
}

export default function SwipeCard({ photo }: Props) {
  const { addKeep, addDelete } = useDecisionStore();
  const { gesture, translateX } = useSwipeGesture(
    () => addKeep(photo.id),
    () => addDelete(photo.id),
  );
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      {
        rotate: `${interpolate(translateX.value, [-200, 0, 200], [-15, 0, 15])}deg`,
      },
    ],
  }));
  const keepLabelStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      translateX.value,
      [0, 150],
      [0, 1],
      Extrapolation.CLAMP,
    ),
  }));
  console.log(
    "toKeep:",
    useDecisionStore((s) => s.toKeep),
  );
  console.log(
    "toDelete:",
    useDecisionStore((s) => s.toDelete),
  );

  const deleteLabelStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      translateX.value,
      [-150, 0],
      [1, 0],
      Extrapolation.CLAMP,
    ),
  }));
  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={animatedStyle}>
        <View style={styles.card}>
          <View style={styles.imageContainer}>
            <Image source={{ uri: photo.uri }} style={styles.image} />
            <Animated.View
              style={[styles.label, styles.labelKeep, keepLabelStyle]}
            >
              <Text style={styles.labelText}>GARDER</Text>
            </Animated.View>
            <Animated.View
              style={[styles.label, styles.labelDelete, deleteLabelStyle]}
            >
              <Text style={styles.labelText}>SUPPRIMER</Text>
            </Animated.View>
          </View>
          <View style={styles.buttonsContainer}>
            <Pressable style={[styles.button, styles.deleteButton]}>
              <Text style={styles.buttonText}>Supprimer</Text>
            </Pressable>
            <Pressable style={[styles.button, styles.keepButton]}>
              <Text style={styles.buttonText}>Garder</Text>
            </Pressable>
          </View>
        </View>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    marginVertical: 10,
    position: "relative",
  },
  image: {
    width: 300,
    height: 400,
    borderRadius: 8,
  },
  imageContainer: {
    width: 300,
    height: 400,
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
  label: {
    position: "absolute",
    top: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 3,
  },
  labelKeep: {
    right: 20,
    borderColor: "#22c55e",
  },
  labelDelete: {
    left: 20,
    borderColor: "#ef4444",
  },
  labelText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
});
