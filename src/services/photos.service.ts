import * as MediaLibrary from "expo-media-library";
import type { Asset } from "expo-media-library";

export async function getPhotosFromLibrary(): Promise<Asset[]> {
  try {
    const permission = await MediaLibrary.requestPermissionsAsync();

    if (permission.status !== "granted") {
      throw new Error("Photo library permission denied");
    }

    const result = await MediaLibrary.getAssetsAsync({
      first: 10000,
      mediaType: "photo",
      sortBy: MediaLibrary.SortBy.creationTime,
    });
    return result.assets;
  } catch (error) {
    console.error("Error getting photos", error);
    throw error;
  }
}

export async function getPhotoById(photoId: string) {
  try {
    const photo = await MediaLibrary.getAssetInfoAsync(photoId);
    return photo;
  } catch (error) {
    console.error("Error getting photo by ID:", error);
    throw error;
  }
}

export function groupPhotosByMonth(
  photos: Asset[],
): { label: string; photos: Asset[] }[] {
  const groups: Record<string, Asset[]> = {};
  for (const photo of photos) {
    const date = new Date(photo.creationTime);
    const label = date.toLocaleDateString("fr-FR", {
      month: "long",
      year: "numeric",
    });
    if (!groups[label]) groups[label] = [];
    groups[label].push(photo);
  }
  return Object.entries(groups).map(([label, photos]) => ({ label, photos }));
}
