import { useEffect, useState } from "react";
import { getPhotosFromLibrary } from "../services/photos.service";
import type { Asset } from "expo-media-library";

export default function usePhotosLibrary() {
  const [photos, setPhotos] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Au démarrage de l'écran, charge les photos
    const loadPhotos = async () => {
      try {
        const result = await getPhotosFromLibrary();
        setPhotos(result);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
        console.error("Failed to load photos:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadPhotos();
  }, []);
  return { photos, isLoading, error };
}
