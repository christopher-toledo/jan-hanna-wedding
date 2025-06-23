"use client";

import type React from "react";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Calendar, User, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GalleryImage {
  id: string;
  filename: string;
  originalName: string;
  uploader: string;
  uploadedAt: string;
  caption?: string;
  visible: boolean;
  blobUrl: string;
}

interface PreviewSettings {
  count: number;
  selectedImages: string[];
  useLatest: boolean;
}

interface GalleryGridProps {
  refreshTrigger?: number;
  limit?: number;
  isPreview?: boolean;
}

export function GalleryGrid({
  refreshTrigger,
  limit,
  isPreview = false,
}: GalleryGridProps) {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null
  );
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const fetchImages = useCallback(async () => {
    try {
      let visibleImages: GalleryImage[] = [];

      if (isPreview) {
        // Fetch preview settings and images for home page preview
        const [settingsResponse, imagesResponse] = await Promise.all([
          fetch("/api/admin/preview-settings"),
          fetch("/api/gallery"),
        ]);

        if (settingsResponse.ok && imagesResponse.ok) {
          const settings: PreviewSettings = await settingsResponse.json();
          const data = await imagesResponse.json();
          const allVisibleImages =
            data.images?.filter((img: GalleryImage) => img.visible) || [];

          if (settings.useLatest) {
            // Use latest photos
            allVisibleImages.sort(
              (a: GalleryImage, b: GalleryImage) =>
                new Date(b.uploadedAt).getTime() -
                new Date(a.uploadedAt).getTime()
            );
            visibleImages = allVisibleImages.slice(0, settings.count);
          } else {
            // Use manually selected photos
            visibleImages = allVisibleImages.filter((img: GalleryImage) =>
              settings.selectedImages.includes(img.id)
            );
            // Maintain the order of selection
            visibleImages.sort((a, b) => {
              const aIndex = settings.selectedImages.indexOf(a.id);
              const bIndex = settings.selectedImages.indexOf(b.id);
              return aIndex - bIndex;
            });
          }
        }
      } else {
        // Regular gallery view
        const response = await fetch("/api/gallery");
        const data = await response.json();
        visibleImages =
          data.images?.filter((img: GalleryImage) => img.visible) || [];

        // Sort by upload date, newest first
        visibleImages.sort(
          (a: GalleryImage, b: GalleryImage) =>
            new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
        );

        // Apply limit if specified
        if (limit && limit > 0) {
          visibleImages = visibleImages.slice(0, limit);
        }
      }

      setImages(visibleImages);
    } catch (error) {
      console.error("Error fetching images:", error);
    } finally {
      setLoading(false);
    }
  }, []); // Remove dependencies to prevent infinite loop

  useEffect(() => {
    fetchImages();
  }, [refreshTrigger]); // Only depend on refreshTrigger

  useEffect(() => {
    setLoading(true);
    fetchImages();
  }, [limit, isPreview]);

  const openModal = (index: number) => {
    setSelectedImageIndex(index);
  };

  const closeModal = () => {
    setSelectedImageIndex(null);
  };

  const goToPrevious = () => {
    if (selectedImageIndex !== null && selectedImageIndex > 0) {
      setSelectedImageIndex(selectedImageIndex - 1);
    }
  };

  const goToNext = () => {
    if (selectedImageIndex !== null && selectedImageIndex < images.length - 1) {
      setSelectedImageIndex(selectedImageIndex + 1);
    }
  };

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      goToNext();
    } else if (isRightSwipe) {
      goToPrevious();
    }
  };

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (selectedImageIndex === null) return;

      switch (e.key) {
        case "ArrowLeft":
          goToPrevious();
          break;
        case "ArrowRight":
          goToNext();
          break;
        case "Escape":
          closeModal();
          break;
      }
    },
    [selectedImageIndex]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  if (loading) {
    const skeletonCount = limit || (isPreview ? 10 : 8);
    return (
      <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-2 sm:gap-4 space-y-2 sm:space-y-4">
        {[...Array(skeletonCount)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="break-inside-avoid"
          >
            <div className="animate-pulse bg-gray-200 rounded-lg h-48 sm:h-64 mb-2 sm:mb-4"></div>
          </motion.div>
        ))}
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center py-12 sm:py-16 px-4"
      >
        <div className="w-16 h-16 sm:w-24 sm:h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
          <Calendar className="h-8 w-8 sm:h-12 sm:w-12 text-muted-foreground" />
        </div>
        <h3 className="font-serif text-xl sm:text-2xl text-primary mb-3 sm:mb-4">
          No Photos Yet
        </h3>
        <p className="text-muted-foreground text-sm sm:text-base max-w-md mx-auto leading-relaxed">
          {isPreview
            ? "No photos have been selected for the preview gallery yet."
            : "Be the first to share a beautiful moment from our special day! Upload your photos to get started."}
        </p>
      </motion.div>
    );
  }

  const selectedImage =
    selectedImageIndex !== null ? images[selectedImageIndex] : null;

  return (
    <>
      <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-2 sm:gap-4 space-y-2 sm:space-y-4">
        <AnimatePresence>
          {images.map((image, index) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, delay: index * 0.05 }}
              className="break-inside-avoid cursor-pointer group"
              onClick={() => openModal(index)}
            >
              <div className="relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-[1.02]">
                <Image
                  src={image.blobUrl}
                  alt={image.caption || `Photo by ${image.uploader}`}
                  width={400}
                  height={600}
                  className="w-full h-auto object-cover"
                  style={{ aspectRatio: "auto" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <div className="flex items-center gap-2 text-xs sm:text-sm">
                    <User className="h-3 w-3" />
                    <span className="truncate">{image.uploader}</span>
                  </div>
                  {image.caption && (
                    <p className="text-xs sm:text-sm mt-1 opacity-90 line-clamp-2">
                      {image.caption}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Mobile-Responsive Image Modal */}
      <Dialog open={selectedImageIndex !== null} onOpenChange={closeModal}>
        <DialogContent className="max-w-[100vw] max-h-[100vh] sm:max-w-[95vw] sm:max-h-[95vh] w-full h-full sm:w-auto sm:h-auto p-0 overflow-hidden bg-transparent border-none shadow-none m-0 sm:m-auto">
          {selectedImage && (
            <div
              className="relative bg-black/95 w-full h-full sm:rounded-lg overflow-hidden"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {/* Close Button */}
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 sm:top-4 sm:right-4 z-30 bg-black/50 hover:bg-black/70 text-white border-white/20 rounded-full w-8 h-8 sm:w-10 sm:h-10 p-0"
                onClick={closeModal}
              >
                <X className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>

              {/* Navigation Buttons - Hidden on small screens, shown on hover/tap */}
              {selectedImageIndex !== null && selectedImageIndex > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-30 bg-black/50 hover:bg-black/70 text-white border-white/20 rounded-full w-10 h-10 sm:w-12 sm:h-12 p-0 opacity-70 sm:opacity-100"
                  onClick={goToPrevious}
                >
                  <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
                </Button>
              )}

              {selectedImageIndex !== null &&
                selectedImageIndex < images.length - 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-30 bg-black/50 hover:bg-black/70 text-white border-white/20 rounded-full w-10 h-10 sm:w-12 sm:h-12 p-0 opacity-70 sm:opacity-100"
                    onClick={goToNext}
                  >
                    <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
                  </Button>
                )}

              {/* Image Counter */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 sm:top-4 z-30 bg-black/60 text-white px-3 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium">
                {selectedImageIndex !== null && selectedImageIndex + 1} of{" "}
                {images.length}
              </div>

              {/* Main Image Container */}
              <div className="relative w-full h-full flex items-center justify-center">
                <motion.div
                  key={selectedImage.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center justify-center w-full h-full p-2 sm:p-4"
                >
                  <Image
                    src={selectedImage.blobUrl}
                    alt={
                      selectedImage.caption ||
                      `Photo by ${selectedImage.uploader}`
                    }
                    width={1200}
                    height={800}
                    className="max-w-full max-h-full w-auto h-auto object-contain"
                    style={{
                      maxWidth: "100%",
                      maxHeight: "calc(100vh - 120px)",
                      width: "auto",
                      height: "auto",
                    }}
                    priority
                    unoptimized
                  />
                </motion.div>

                {/* Mobile-Optimized Image Details Overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-3 sm:p-6">
                  <div className="flex items-start justify-between gap-2 sm:gap-4">
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-white text-sm sm:text-lg truncate">
                          {selectedImage.uploader}
                        </p>
                        <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-white/80">
                          <Calendar className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                          <span className="truncate">
                            {new Date(
                              selectedImage.uploadedAt
                            ).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year:
                                window.innerWidth > 640 ? "numeric" : "2-digit",
                              ...(window.innerWidth > 640 && {
                                hour: "2-digit",
                                minute: "2-digit",
                              }),
                            })}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Swipe Hint for Mobile */}
                    <div className="block sm:hidden text-xs text-white/60 text-right flex-shrink-0">
                      <div>← Swipe →</div>
                    </div>

                    {/* Keyboard Shortcuts Hint for Desktop */}
                    <div className="hidden sm:block text-xs text-white/60 text-right flex-shrink-0">
                      <div>← → Navigate</div>
                      <div>ESC Close</div>
                    </div>
                  </div>

                  {selectedImage.caption && (
                    <div className="mt-3 sm:mt-4 bg-white/10 rounded-lg p-3 sm:p-4 backdrop-blur-sm">
                      <p className="text-white text-sm sm:text-base leading-relaxed italic">
                        "{selectedImage.caption}"
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}