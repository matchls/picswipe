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
import { colors } from "../../src/theme/colors";
import { AppHeader } from "../../src/components/ui/AppHeader";

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
  const undoLast = useDecisionStore((s) => s.undoLast);
  const lastDecision = useDecisionStore((s) => s.lastDecision);

  const folders = useMemo(() => groupPhotosByMonth(photos), [photos]);
  const gridFolders = useMemo(
    () =>
      folders.map((section) => ({
        title: section.title,
        data: chunk(section.data, 4),
      })),
    [folders],
  );
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <AppHeader />
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
            >
              <View style={styles.returnButton}>
                <Ionicons name="arrow-back" size={18} color="white" />
                <Text style={styles.returnButtonText}>Retour</Text>
              </View>
            </Pressable>
          </>
        ) : (
          <>
            <Pressable
              onPress={() => {
                setSelectedFolder(null);
                setCurrentIndex(0);
              }}
            >
              <View style={styles.returnButton}>
                <Ionicons name="arrow-back" size={18} color="white" />
                <Text style={styles.returnButtonText}>Retour</Text>
              </View>
            </Pressable>
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
            <Pressable
              onPress={() => {
                undoLast();
                setCurrentIndex((i) => Math.max(0, i - 1));
              }}
              disabled={!lastDecision}
              style={[
                styles.undoButton,
                !lastDecision && styles.undoButtonDisabled,
              ]}
            >
              <Ionicons name="arrow-undo" size={18} color="white" />
              <Text style={styles.undoButtonText}>Annuler</Text>
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
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.green.light,
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
    backgroundColor: colors.green.background,
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.green.border,
  },
  statText: {
    fontSize: 14,
    color: colors.green.text,
    marginVertical: 2,
  },
  yearHeader: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    width: "100%",
    margin: "auto",
    padding: 10,
    backgroundColor: colors.green.light,
    textAlign: "center",
  },
  folderRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingHorizontal: 8,
  },
  folderItem: {
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
    color: colors.gray.medium,
  },
  folderThumbnail: {
    width: 64,
    height: 64,
    borderRadius: 8,
  },
  progressBarContainer: {
    width: "90%",
    height: 6,
    backgroundColor: colors.gray.light,
    borderRadius: 3,
    marginBottom: 12,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: colors.green.primary,
    borderRadius: 3,
  },
  undoButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.gray.medium,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginTop: 12,
  },
  undoButtonDisabled: {
    opacity: 0.4,
  },
  undoButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
});
