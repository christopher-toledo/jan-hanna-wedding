"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Eye,
  EyeOff,
  Trash2,
  Download,
  ImageIcon,
  ReplaceAllIcon as SelectAll,
  X,
  Loader2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

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

export function GalleryManager() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [bulkMode, setBulkMode] = useState(false);
  const [bulkLoading, setBulkLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await fetch("/api/admin/gallery");
      const data = await response.json();
      setImages(data.images || []);
    } catch (error) {
      console.error("Error fetching images:", error);
      toast({
        title: "Error",
        description: "Failed to fetch images.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleVisibility = async (imageId: string, visible: boolean) => {
    try {
      const response = await fetch(`/api/admin/gallery/${imageId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visible: !visible }),
      });

      if (response.ok) {
        // Update local state immediately for better UX
        setImages((prevImages) =>
          prevImages.map((img) =>
            img.id === imageId ? { ...img, visible: !visible } : img
          )
        );
      } else {
        throw new Error("Failed to update visibility");
      }
    } catch (error) {
      console.error("Error toggling visibility:", error);
      toast({
        title: "Error",
        description: "Failed to update image visibility.",
        variant: "destructive",
      });
    }
  };

  const deleteImage = async (imageId: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return;

    try {
      const response = await fetch(`/api/admin/gallery/${imageId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Remove from local state immediately
        setImages((prevImages) =>
          prevImages.filter((img) => img.id !== imageId)
        );
      } else {
        throw new Error("Failed to delete image");
      }
    } catch (error) {
      console.error("Error deleting image:", error);
      toast({
        title: "Error",
        description: "Failed to delete image.",
        variant: "destructive",
      });
    }
  };

  const exportImages = async () => {
    try {
      const response = await fetch("/api/admin/gallery/export");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "gallery-export.json";
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting images:", error);
      toast({
        title: "Error",
        description: "Failed to export images.",
        variant: "destructive",
      });
    }
  };

  const handleImageSelect = (imageId: string, checked: boolean) => {
    if (checked) {
      setSelectedImages([...selectedImages, imageId]);
    } else {
      setSelectedImages(selectedImages.filter((id) => id !== imageId));
    }
  };

  const selectAllImages = () => {
    setSelectedImages(images.map((img) => img.id));
  };

  const clearSelection = () => {
    setSelectedImages([]);
  };

  const bulkDelete = async () => {
    if (selectedImages.length === 0) return;

    if (
      !confirm(
        `Are you sure you want to delete ${selectedImages.length} selected images?`
      )
    )
      return;

    setBulkLoading(true);
    let successCount = 0;
    let failCount = 0;

    try {
      // Process deletions sequentially to avoid overwhelming the server
      for (const imageId of selectedImages) {
        try {
          const response = await fetch(`/api/admin/gallery/${imageId}`, {
            method: "DELETE",
          });

          if (response.ok) {
            successCount++;
            // Remove from local state immediately
            setImages((prevImages) =>
              prevImages.filter((img) => img.id !== imageId)
            );
          } else {
            failCount++;
            console.error(`Failed to delete image ${imageId}`);
          }
        } catch (error) {
          failCount++;
          console.error(`Error deleting image ${imageId}:`, error);
        }
      }

      if (successCount > 0) {
        toast({
          title: "Success",
          description: `${successCount} images deleted successfully.${
            failCount > 0 ? ` ${failCount} failed.` : ""
          }`,
        });
      }

      if (failCount > 0 && successCount === 0) {
        toast({
          title: "Error",
          description: "Failed to delete selected images.",
          variant: "destructive",
        });
      }

      setSelectedImages([]);
    } catch (error) {
      console.error("Error in bulk delete:", error);
      toast({
        title: "Error",
        description: "An error occurred during bulk delete.",
        variant: "destructive",
      });
    } finally {
      setBulkLoading(false);
    }
  };

  const bulkUpdateVisibility = async (visible: boolean) => {
    if (selectedImages.length === 0) return;

    setBulkLoading(true);
    let successCount = 0;
    let failCount = 0;

    try {
      // Process updates sequentially to avoid overwhelming the server
      for (const imageId of selectedImages) {
        try {
          const response = await fetch(`/api/admin/gallery/${imageId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ visible }),
          });

          if (response.ok) {
            successCount++;
            // Update local state immediately
            setImages((prevImages) =>
              prevImages.map((img) =>
                img.id === imageId ? { ...img, visible } : img
              )
            );
          } else {
            failCount++;
            console.error(`Failed to update visibility for image ${imageId}`);
          }
        } catch (error) {
          failCount++;
          console.error(
            `Error updating visibility for image ${imageId}:`,
            error
          );
        }
      }

      const action = visible ? "shown" : "hidden";

      if (successCount > 0) {
        toast({
          title: "Success",
          description: `${successCount} images ${action} successfully.${
            failCount > 0 ? ` ${failCount} failed.` : ""
          }`,
        });
      }

      if (failCount > 0 && successCount === 0) {
        toast({
          title: "Error",
          description: `Failed to ${
            visible ? "show" : "hide"
          } selected images.`,
          variant: "destructive",
        });
      }

      setSelectedImages([]);
    } catch (error) {
      console.error("Error in bulk visibility update:", error);
      toast({
        title: "Error",
        description: "An error occurred during bulk update.",
        variant: "destructive",
      });
    } finally {
      setBulkLoading(false);
    }
  };

  const bulkHide = () => bulkUpdateVisibility(false);
  const bulkShow = () => bulkUpdateVisibility(true);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="elegant-shadow">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="h-5 w-5" />
          Gallery Management
          <Badge variant="secondary">{images.length} images</Badge>
          {selectedImages.length > 0 && (
            <Badge variant="default">{selectedImages.length} selected</Badge>
          )}
        </CardTitle>
        <div className="flex gap-2">
          {!bulkMode ? (
            <>
              <Button
                variant="outline"
                onClick={() => setBulkMode(true)}
                disabled={images.length === 0}
              >
                Bulk Actions
              </Button>
              {images.length > 0 && (
                <Button variant="outline" onClick={exportImages}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              )}
            </>
          ) : (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={selectAllImages}
                disabled={bulkLoading}
              >
                <SelectAll className="h-4 w-4 mr-2" />
                Select All
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={clearSelection}
                disabled={bulkLoading}
              >
                <X className="h-4 w-4 mr-2" />
                Clear
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={bulkShow}
                disabled={selectedImages.length === 0 || bulkLoading}
              >
                {bulkLoading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Eye className="h-4 w-4 mr-2" />
                )}
                Show
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={bulkHide}
                disabled={selectedImages.length === 0 || bulkLoading}
              >
                {bulkLoading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <EyeOff className="h-4 w-4 mr-2" />
                )}
                Hide
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={bulkDelete}
                disabled={selectedImages.length === 0 || bulkLoading}
              >
                {bulkLoading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4 mr-2" />
                )}
                Delete
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setBulkMode(false);
                  clearSelection();
                }}
                disabled={bulkLoading}
              >
                Cancel
              </Button>
            </>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {images.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No images uploaded yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {images.map((image) => (
              <div
                key={image.id}
                className="relative group border rounded-lg overflow-hidden"
              >
                {bulkMode && (
                  <div className="absolute top-2 left-2 z-10">
                    <Checkbox
                      checked={selectedImages.includes(image.id)}
                      onCheckedChange={(checked) =>
                        handleImageSelect(image.id, checked as boolean)
                      }
                      onClick={(e) => e.stopPropagation()}
                      className="bg-white border-2"
                      disabled={bulkLoading}
                    />
                  </div>
                )}
                <div
                  className={`aspect-square relative ${
                    bulkMode ? "cursor-pointer" : ""
                  }`}
                  onClick={
                    bulkMode
                      ? () =>
                          handleImageSelect(
                            image.id,
                            !selectedImages.includes(image.id)
                          )
                      : undefined
                  }
                >
                  <Image
                    src={image.blobUrl}
                    alt={image.caption || `Photo by ${image.uploader}`}
                    fill
                    className="object-cover"
                  />
                  {!image.visible && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <Badge variant="secondary">Hidden</Badge>
                    </div>
                  )}
                  {bulkMode && selectedImages.includes(image.id) && (
                    <div className="absolute inset-0 bg-blue-500/20 border-2 border-blue-500 flex items-center justify-center">
                      <div className="bg-blue-500 text-white rounded-full p-1">
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <p className="font-medium text-sm">{image.uploader}</p>
                  {image.caption && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {image.caption}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(image.uploadedAt).toLocaleDateString()}
                  </p>
                </div>
                {!bulkMode && (
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => toggleVisibility(image.id, image.visible)}
                      className="h-8 w-8 p-0"
                    >
                      {image.visible ? (
                        <Eye className="h-3 w-3" />
                      ) : (
                        <EyeOff className="h-3 w-3" />
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteImage(image.id)}
                      className="h-8 w-8 p-0"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}