import {
  View,
  Text,
  ActivityIndicator,
  Pressable,
  FlatList,
  StyleSheet,
  SectionList,
} from "react-native";
import usePhotoLibrary from "../../src/hooks/usePhotoLibrary";
import SwipeCard from "../../src/components/ui/SwipeCard";
import { useState } from "react";
import { groupPhotosByMonth } from "../../src/services/photos.service";
import type { Asset } from "expo-media-library";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

export default function SwiperScreen() {
  const { photos, isLoading, error } = usePhotoLibrary();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedFolder, setSelectedFolder] = useState<Asset[] | null>(null);

  const folders = groupPhotosByMonth(photos);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        {isLoading ? (
          <ActivityIndicator size="large" />
        ) : photos.length === 0 ? (
          <Text>Aucune photo trouvée</Text>
        ) : selectedFolder === null ? (
          <SectionList
            sections={folders}
            keyExtractor={(item) => item.label}
            renderSectionHeader={({ section }) => (
              <Text style={styles.yearHeader}>{section.title}</Text>
            )}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => setSelectedFolder(item.photos)}
                style={styles.folderItem}
              >
                <Ionicons name="folder" size={32} color="f59e0b" />
                <Text>{item.label}</Text>
                <Text>{item.photos.length} photos</Text>
              </Pressable>
            )}
          />
        ) : currentIndex >= selectedFolder.length ? (
          <Text>Plus de photos !</Text>
        ) : (
          <>
            <Pressable
              onPress={() => {
                setSelectedFolder(null);
                setCurrentIndex(0);
              }}
            >
              <Text style={styles.returnButton}>Retour</Text>
            </Pressable>
            <SwipeCard
              key={selectedFolder[currentIndex].id}
              photo={selectedFolder[currentIndex]}
              onSwipeComplete={() => setCurrentIndex((i) => i + 1)}
            />
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  returnButton: {
    width: 200,
    fontWeight: "bold",
    backgroundColor: "#58b452ff",
  },
  yearHeader: {
    fontSize: 20,
    fontWeight: "bold",
    padding: 10,
    backgroundColor: "#f0f0f0",
  },
  folderItem: {
    flexDirection: "column",
    alignItems: "center",
    gap: 10,
    padding: 12,
  },
});
