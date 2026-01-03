import { createSignal } from "solid-js";

export const useImagePreloader = (imageUrls: string[]) => {
  const [imagesLoaded, setImagesLoaded] = createSignal(false);
  const [loadedCount, setLoadedCount] = createSignal(0);

  const preloadImages = () => {
    if (!imageUrls || imageUrls.length === 0) {
      setImagesLoaded(true);
      return;
    }

    let loaded = 0;
    const imagePromises = imageUrls.map((url) => {
      return new Promise<void>((resolve) => {
        const img = new Image();
        img.onload = () => {
          loaded++;
          setLoadedCount(loaded);
          resolve();
        };
        img.onerror = () => {
          loaded++;
          setLoadedCount(loaded);
          resolve();
        };
        img.src = url;
      });
    });

    Promise.all(imagePromises).then(() => {
      setImagesLoaded(true);
    });
  };

  return {
    imagesLoaded,
    loadedCount,
    totalImages: imageUrls.length,
    preloadImages,
  };
};
