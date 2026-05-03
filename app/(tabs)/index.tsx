import { View, Text, ActivityIndicator, SafeAreaView } from "react-native";
import usePhotoLibrary from "../../src/hooks/usePhotoLibrary";
import SwipeCard from "../../src/components/ui/SwipeCard";
import { useState } from "react";

export default function SwiperScreen() {
  const { photos, isLoading, error } = usePhotoLibrary();
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        {isLoading ? (
          <ActivityIndicator size="large" />
        ) : photos.length === 0 ? (
          <Text>Aucune photo trouvée</Text>
        ) : currentIndex >= photos.length ? (
          <Text>Plus de photos !</Text>
        ) : (
          <SwipeCard
            key={photos[currentIndex].id}
            photo={photos[currentIndex]}
            onSwipeComplete={() => setCurrentIndex((i) => i + 1)}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
