import {
  View,
  Text,
  ActivityIndicator,
  Pressable,
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

function chunk<T>(arr: T[], size: number): T[][] {
  return Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, i * size + size),
  );
}

export default function SwiperScreen() {
  const { photos, isLoading, error } = usePhotoLibrary();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedFolder, setSelectedFolder] = useState<Asset[] | null>(null);

  const folders = groupPhotosByMonth(photos);
  const gridFolders = folders.map((section) => ({
    title: section.title,
    data: chunk(section.data, 2),
  }));
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        {isLoading ? (
          <ActivityIndicator size="large" />
        ) : photos.length === 0 ? (
          <Text>Aucune photo trouvée</Text>
        ) : selectedFolder === null ? (
          <SectionList
            sections={gridFolders}
            keyExtractor={(row) => row.map((f) => f.label).join("-")}
            renderSectionHeader={({ section }) => (
              <Text style={styles.yearHeader}>{section.title}</Text>
            )}
            renderItem={({ item: row }) => (
              <View style={styles.folderRow}>
                {row.map((folder) => (
                  <Pressable
                    key={folder.label}
                    onPress={() => setSelectedFolder(folder.photos)}
                    style={styles.folderItem}
                  >
                    <Ionicons name="folder" size={48} color="#82d37dff" />
                    <Text style={styles.folderLabel}>{folder.label}</Text>
                    <Text style={styles.folderCount}>
                      {folder.photos.length} photos
                    </Text>
                  </Pressable>
                ))}
              </View>
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
    fontWeight: "bold",
    backgroundColor: "#82d37dff",
    padding: 16,
    margin: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  yearHeader: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    width: "90%",
    margin: "auto",
    padding: 10,
    backgroundColor: "#5ca056ff",
    borderRadius: 5,
    textAlign: "center",
  },
  folderRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingHorizontal: 8,
  },
  folderItem: {
    width: "50%",
    alignItems: "center",
    padding: 12,
    gap: 6,
  },
  folderLabel: {
    fontSize: 13,
    textAlign: "center",
    textTransform: "capitalize",
  },
  folderCount: {
    fontSize: 11,
    color: "#6b7280",
  },
});
