import { useSharedValue } from "react-native-reanimated";
import { Gesture } from "react-native-gesture-handler";

export default function useSwipeGesture() {
  const translateX = useSharedValue(0);
  const gesture = Gesture.Pan().onUpdate((event) => {
    translateX.value = event.translationX;
  });
  return { gesture, translateX };
}
