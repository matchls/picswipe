import { Asset } from "expo-media-library";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";
import {
  useAnimatedStyle,
  interpolate,
  Extrapolation,
} from "react-native-reanimated";
import useSwipeGesture from "../../hooks/useSwipeGesture";
import useDecisionStore from "../../store/useDecisionStore";
import { useMemo } from "react";

interface Props {
  photo: Asset;
  onSwipeComplete: () => void;
}

export default function SwipeCard({ photo, onSwipeComplete }: Props) {
  const { width, height } = useWindowDimensions();
  const CARD_WIDTH = width * 0.9;
  const CARD_HEIGHT = height * 0.65;
  const { addKeep, addDelete } = useDecisionStore();
  const { gesture, translateX } = useSwipeGesture(
    () => addKeep({ id: photo.id, uri: photo.uri }),
    () => addDelete({ id: photo.id, uri: photo.uri }),
    onSwipeComplete,
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

  const deleteLabelStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      translateX.value,
      [-150, 0],
      [1, 0],
      Extrapolation.CLAMP,
    ),
  }));

  const styles = useMemo(
    () =>
      StyleSheet.create({
        wrapper: {
          width: CARD_WIDTH,
          height: CARD_HEIGHT,
          position: "relative",
        },
        card: {
          alignItems: "center",
          position: "relative",
        },
        image: {
          width: CARD_WIDTH,
          height: CARD_HEIGHT,
          borderRadius: 16,
        },
        label: {
          position: "absolute",
          top: 30,
          paddingHorizontal: 16,
          paddingVertical: 8,
          borderRadius: 8,
          borderWidth: 4,
        },
        labelKeep: {
          right: 20,
          borderColor: "#22c55e",
          backgroundColor: "rgba(34, 197, 94, 0.25)",
          transform: [{ rotate: "15deg" }],
        },
        labelDelete: {
          left: 20,
          borderColor: "#ef4444",
          backgroundColor: "rgba(239, 68, 68, 0.25)",
          transform: [{ rotate: "-15deg" }],
        },
        labelText: {
          fontSize: 22,
          fontWeight: "bold",
          color: "white",
          letterSpacing: 2,
        },
      }),
    [CARD_WIDTH, CARD_HEIGHT],
  );
  return (
    <View style={styles.wrapper}>
      <GestureDetector gesture={gesture}>
        <Animated.View style={animatedStyle}>
          <View style={styles.card}>
            <View>
              <Image source={{ uri: photo.uri }} style={styles.image} />
            </View>
          </View>
        </Animated.View>
      </GestureDetector>
      <Animated.View style={[styles.label, styles.labelKeep, keepLabelStyle]}>
        <Text style={styles.labelText}>GARDER</Text>
      </Animated.View>
      <Animated.View
        style={[styles.label, styles.labelDelete, deleteLabelStyle]}
      >
        <Text style={styles.labelText}>SUPPRIMER</Text>
      </Animated.View>
    </View>
  );
}
