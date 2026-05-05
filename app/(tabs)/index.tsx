import {
  View,
  Text,
  ActivityIndicator,
  Pressable,
  StyleSheet,
  SectionList,
  Image,
} from "react-native";
import usePhotoLibrary from "../../src/hooks/usePhotoLibrary";
import SwipeCard from "../../src/components/ui/SwipeCard";
import { useState, useMemo } from "react";
import { groupPhotosByMonth } from "../../src/services/photos.service";
import type { Asset } from "expo-media-library";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import useDecisionStore from "../../src/store/useDecisionStore";

function chunk<T>(arr: T[], size: number): T[][] {
  return Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, i * size + size),
  );
}
function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 o";
  const k = 1024;
  const sizes = ["o", "Ko", "Mo", "Go"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export default function SwiperScreen() {
  const { photos, isLoading, error } = usePhotoLibrary();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedFolder, setSelectedFolder] = useState<Asset[] | null>(null);
  const deletedCount = useDecisionStore((s) => s.deletedCount);
  const deletedSize = useDecisionStore((s) => s.deletedSize);

  const folders = useMemo(() => groupPhotosByMonth(photos), [photos]);
  const gridFolders = useMemo(
    () =>
      folders.map((section) => ({
        title: section.title,
        data: chunk(section.data, 3),
      })),
    [folders],
  );
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        {isLoading ? (
          <ActivityIndicator size="large" />
        ) : photos.length === 0 ? (
          <Text>Aucune photo trouvée</Text>
        ) : selectedFolder === null ? (
          <>
            <View style={styles.statsCard}>
              <Text style={styles.statText}>📷 {photos.length} photos</Text>
              <Text style={styles.statText}>
                🗑 {deletedCount} supprimées · {formatBytes(deletedSize)}{" "}
                récupérés
              </Text>
            </View>
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
                      <Image
                        source={{ uri: folder.photos[0].uri }}
                        style={styles.folderThumbnail}
                      />
                      <Text style={styles.folderLabel}>{folder.label}</Text>
                      <Text style={styles.folderCount}>
                        {folder.photos.length} photos
                      </Text>
                    </Pressable>
                  ))}
                </View>
              )}
            />
          </>
        ) : currentIndex >= selectedFolder.length ? (
          <>
            <Text>Plus de photos !</Text>
            <Pressable
              onPress={() => {
                setSelectedFolder(null);
                setCurrentIndex(0);
              }}
            ></Pressable>
            <View style={styles.returnButton}>
              <Ionicons name="arrow-back" size={18} color="white" />
              <Text style={styles.returnButtonText}>Retour</Text>
            </View>
          </>
        ) : (
          <>
            <Pressable
              onPress={() => {
                setSelectedFolder(null);
                setCurrentIndex(0);
              }}
            ></Pressable>
            <View style={styles.returnButton}>
              <Ionicons name="arrow-back" size={18} color="white" />
              <Text style={styles.returnButtonText}>Retour</Text>
            </View>
            <View style={styles.progressBarContainer}>
              <View
                style={[
                  styles.progressBarFill,
                  {
                    width: `${((currentIndex + 1) / selectedFolder.length) * 100}%`,
                  },
                ]}
              />
            </View>
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
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#82d37dff",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    margin: 16,
  },
  returnButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 15,
  },
  statsCard: {
    width: "100%",
    backgroundColor: "#f0fdf4",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#bbf7d0",
  },
  statText: {
    fontSize: 14,
    color: "#166534",
    marginVertical: 2,
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
    width: "33%",
    alignItems: "center",
    padding: 12,
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
  folderThumbnail: {
    width: 64,
    height: 64,
    borderRadius: 8,
  },
  progressBarContainer: {
    width: "90%",
    height: 6,
    backgroundColor: "#e5e7eb",
    borderRadius: 3,
    marginBottom: 12,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#22c55e",
    borderRadius: 3,
  },
});
