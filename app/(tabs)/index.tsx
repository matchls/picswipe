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
  const { photos, isLoading, error, isAllLoaded } = usePhotoLibrary();
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
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.green.light }}>
      <AppHeader />
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: colors.green.background,
        }}
      >
        {selectedFolder === null && (
          <View style={styles.statsRow}>
            <View style={styles.statsCard}>
              <Ionicons
                name="images-outline"
                size={20}
                style={{ marginRight: 8 }}
              ></Ionicons>
              {!isAllLoaded ? (
                <ActivityIndicator size="small" color={colors.green.text} />
              ) : (
                <Text style={styles.statText}> {photos.length} photos</Text>
              )}
            </View>
            <View style={styles.statsCard}>
              <Ionicons
                name="trash-outline"
                size={20}
                style={{ marginRight: 8 }}
              ></Ionicons>
              <View style={styles.statsTextContainer}>
                <Text style={styles.statText}>{deletedCount} supprimées</Text>
                <Text style={styles.statText}>
                  {formatBytes(deletedSize)} récupérés
                </Text>
              </View>
            </View>
          </View>
        )}
        {isLoading ? (
          <ActivityIndicator size="large" />
        ) : photos.length === 0 ? (
          <Text>Aucune photo trouvée</Text>
        ) : selectedFolder === null ? (
          <>
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
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-around",
                width: "90%",
              }}
            >
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
    backgroundColor: colors.green.light,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginVertical: 10,
  },
  returnButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 15,
  },
  undoButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.gray.medium,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginVertical: 10,
  },
  undoButtonDisabled: {
    opacity: 0.4,
  },
  undoButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  statsRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statsCard: {
    flexDirection: "row",
    flex: 1,
    padding: 16,
    alignItems: "center",
  },
  statsTextContainer: {
    flex: 1,
    flexDirection: "column",
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
});
