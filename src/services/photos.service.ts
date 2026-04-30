import * as MediaLibrary from "expo-media-library";
import type { Asset } from "expo-media-library";

export async function getPhotosFromLibrary(): Promise<Asset[]> {
  try {
    const permission = await MediaLibrary.requestPermissionsAsync();

    if (permission.status !== "granted") {
      throw new Error("Photo library permission denied");
    }

    const result = await MediaLibrary.getAssetsAsync({
      first: 20,
      mediaType: "photo",
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
