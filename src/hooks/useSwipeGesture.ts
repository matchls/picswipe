import {
  useSharedValue,
  withTiming,
  withSpring,
  runOnJS,
} from "react-native-reanimated";
import { Gesture } from "react-native-gesture-handler";
import * as Haptics from "expo-haptics";

export default function useSwipeGesture(
  onSwipeRight: () => void,
  onSwipeLeft: () => void,
  onSwipeComplete: () => void,
) {
  const translateX = useSharedValue(0);
  const hasFiredHaptic = useSharedValue(false);
  const gesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
      if (Math.abs(event.translationX) > 100 && !hasFiredHaptic.value) {
        hasFiredHaptic.value = true;
        runOnJS(Haptics.notificationAsync)(
          Haptics.NotificationFeedbackType.Success,
        );
      }
      if (Math.abs(event.translationX) <= 100) {
        hasFiredHaptic.value = false;
      }
    })
    .onEnd((event) => {
      if (Math.abs(event.translationX) > 100) {
        if (event.translationX > 0) {
          runOnJS(onSwipeRight)();
          translateX.value = withTiming(500, {}, () =>
            runOnJS(onSwipeComplete)(),
          );
        } else if (event.translationX < 0) {
          runOnJS(onSwipeLeft)();
          translateX.value = withTiming(-500, {}, () =>
            runOnJS(onSwipeComplete)(),
          );
        }
      } else {
        translateX.value = withSpring(0);
      }
      hasFiredHaptic.value = false;
    });
  return { gesture, translateX };
}
