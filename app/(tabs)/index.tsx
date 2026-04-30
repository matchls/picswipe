import {
  View,
  Text,
  Image,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { useEffect, useState } from "react";
import { getPhotosFromLibrary } from "../../src/services/photos.service";
import type { Asset } from "expo-media-library";
import usePhotoLibrary from "../../src/hooks/usePhotoLibrary";
import { FlatList } from "react-native-gesture-handler";
import SwipeCard from "../../src/components/ui/SwipeCard";

export default function SwiperScreen() {
  const { photos, isLoading, error } = usePhotoLibrary();
  // const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        {isLoading ? (
          <ActivityIndicator size="large" />
        ) : photos.length === 0 ? (
          <Text>Aucune photo trouvée</Text>
        ) : (
          <>
            <FlatList
              data={photos}
              keyExtractor={(photo) => photo.id}
              renderItem={({ item }) => <SwipeCard photo={item} />}
              onEndReached={() => {}}
              numColumns={1}
            />
            <Text style={{ marginTop: 10 }}>
              {/* Photo {currentPhotoIndex + 1} / {photos.length} */}
            </Text>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}
