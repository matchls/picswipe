import { useEffect, useState } from "react";
import { getPhotosPage } from "../services/photos.service";
import type { Asset } from "expo-media-library";

export default function usePhotosLibrary() {
  const [photos, setPhotos] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPhotos = async () => {
      try {
        // Load first page — user sees folders immediately after this
        const firstPage = await getPhotosPage();
        setPhotos(firstPage.assets);
        setIsLoading(false);
        let cursor = firstPage.endCursor;
        let hasMore = firstPage.hasNextPage;
        while (hasMore) {
          const nextPage = await getPhotosPage(cursor);
          setPhotos((prev) => [...prev, ...nextPage.assets]);
          cursor = nextPage.endCursor;
          hasMore = nextPage.hasNextPage;
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
        setIsLoading(false);
      }
    };
    loadPhotos();
  }, []);

  return { photos, isLoading, error };
}
