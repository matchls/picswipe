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
): { title: string; data: { label: string; photos: Asset[] }[] }[] {
  const groups: Record<string, Record<string, Asset[]>> = {};

  for (const photo of photos) {
    const date = new Date(photo.creationTime);
    const year = date.getFullYear().toString();
    const label = date.toLocaleDateString("fr-FR", {
      month: "long",
      year: "numeric",
    });
    if (!groups[year]) groups[year] = {};
    if (!groups[year][label]) groups[year][label] = [];
    groups[year][label].push(photo);
  }

  return Object.entries(groups)
    .sort(([a], [b]) => Number(b) - Number(a))
    .map(([year, months]) => ({
      title: year,
      data: Object.entries(months)
        .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
        .map(([label, photos]) => ({ label, photos })),
    }));
}
