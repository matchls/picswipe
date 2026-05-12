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
import { colors } from "../../theme/colors";
import { LinearGradient } from "expo-linear-gradient";

interface Props {
  photo: Asset;
  onSwipeComplete: () => void;
}

export default function SwipeCard({ photo, onSwipeComplete }: Props) {
  const { width, height } = useWindowDimensions();
  const CARD_WIDTH = width * 0.95;
  const CARD_HEIGHT = height * 0.75;
  const { addKeep, addDelete } = useDecisionStore();
  const { gesture, translateX } = useSwipeGesture(
    () => addKeep({ id: photo.id, uri: photo.uri }),
    () => addDelete({ id: photo.id, uri: photo.uri }),
    onSwipeComplete,
  );
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
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
          borderRadius: 8,
        },
        labelText: {
          fontSize: 30,
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
      <Animated.View
        style={[
          keepLabelStyle,
          {
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
          },
        ]}
      >
        <LinearGradient
          colors={["rgba(34,197,94,0)", "rgba(34,197,94,0.95)"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            right: -(width - CARD_WIDTH) / 2,
            width: 200,
          }}
        >
          <View
            style={{
              flexDirection: "column",
              flex: 1,
              alignItems: "flex-end",
              justifyContent: "center",
              margin: 12,
            }}
          >
            {"GARDER".split("").map((letter, index) => (
              <Text key={index} style={styles.labelText}>
                {letter}
              </Text>
            ))}
          </View>
        </LinearGradient>
      </Animated.View>
      <Animated.View
        style={[
          deleteLabelStyle,
          {
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
          },
        ]}
      >
        <LinearGradient
          colors={["rgba(239,68,68,0.95)", "rgba(239,68,68,0)"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: -(width - CARD_WIDTH) / 2,
            width: 200,
          }}
        >
          <View
            style={{
              flexDirection: "column",
              flex: 1,
              margin: 12,
              alignItems: "flex-start",
              justifyContent: "center",
            }}
          >
            {"SUPPRIMER".split("").map((letter, index) => (
              <Text key={index} style={styles.labelText}>
                {letter}
              </Text>
            ))}
          </View>
        </LinearGradient>
      </Animated.View>
    </View>
  );
}
