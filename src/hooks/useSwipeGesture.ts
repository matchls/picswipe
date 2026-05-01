import {
  useSharedValue,
  withTiming,
  withSpring,
} from "react-native-reanimated";
import { Gesture } from "react-native-gesture-handler";

export default function useSwipeGesture() {
  const translateX = useSharedValue(0);
  const gesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
    })
    .onEnd((event) => {
      if (Math.abs(event.translationX) > 150) {
        if (event.translationX > 0) {
          translateX.value = withTiming(500);
        } else if (event.translationX < 0) {
          translateX.value = withTiming(-500);
        }
      } else {
        translateX.value = withSpring(0);
      }
    });
  return { gesture, translateX };
}
