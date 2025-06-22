"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Save, Eye, ImageIcon } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { motion } from "framer-motion";

interface GalleryImage {
  id: string;
  filename: string;
  originalName: string;
  uploader: string;
  uploadedAt: string;
  caption?: string;
  visible: boolean;
}

interface PreviewSettings {
  count: number;
  selectedImages: string[];
  useLatest: boolean;
}

export function GalleryPreviewManager() {
  const [settings, setSettings] = useState<PreviewSettings>({
    count: 10,
    selectedImages: [],
    useLatest: true,
  });
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [settingsResponse, imagesResponse] = await Promise.all([
        fetch("/api/admin/preview-settings"),
        fetch("/api/admin/gallery"),
      ]);

      if (settingsResponse.ok) {
        const settingsData = await settingsResponse.json();
        setSettings(settingsData);
      }

      if (imagesResponse.ok) {
        const imagesData = await imagesResponse.json();
        // Sort by upload date, newest first
        const sortedImages = (imagesData.images || []).sort(
          (a: GalleryImage, b: GalleryImage) =>
            new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
        );
        setImages(sortedImages);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load preview settings");
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      const response = await fetch("/api/admin/preview-settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        toast.success("Preview settings saved successfully");
      } else {
        throw new Error("Failed to save settings");
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to save preview settings");
    } finally {
      setSaving(false);
    }
  };

  const toggleImageSelection = (imageId: string) => {
    setSettings((prev) => ({
      ...prev,
      selectedImages: prev.selectedImages.includes(imageId)
        ? prev.selectedImages.filter((id) => id !== imageId)
        : [...prev.selectedImages, imageId],
    }));
  };

  const selectLatestImages = () => {
    const latestImages = images.slice(0, settings.count).map((img) => img.id);
    setSettings((prev) => ({
      ...prev,
      selectedImages: latestImages,
    }));
  };

  const clearSelection = () => {
    setSettings((prev) => ({
      ...prev,
      selectedImages: [],
    }));
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  const visibleImages = images.filter((img) => img.visible);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-5 w-5" />
          Home Page Gallery Preview
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Configure which photos appear in the gallery preview on the home page
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Preview Count */}
        <div className="space-y-2">
          <Label htmlFor="preview-count" className="text-base font-medium">
            Number of Preview Photos
          </Label>
          <Input
            id="preview-count"
            type="number"
            min="1"
            max="50"
            value={settings.count}
            onChange={(e) =>
              setSettings((prev) => ({
                ...prev,
                count: Number.parseInt(e.target.value) || 10,
              }))
            }
            className="w-32"
          />
          <p className="text-sm text-muted-foreground">
            Show 1-50 photos in the home page preview
          </p>
        </div>

        {/* Use Latest Toggle */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label htmlFor="use-latest" className="text-base font-medium">
              Use Latest Photos
            </Label>
            <p className="text-sm text-muted-foreground">
              Automatically show the most recent photos, or manually select
              specific photos below
            </p>
          </div>
          <Switch
            id="use-latest"
            checked={settings.useLatest}
            onCheckedChange={(checked) =>
              setSettings((prev) => ({ ...prev, useLatest: checked }))
            }
          />
        </div>

        {/* Manual Selection */}
        {!settings.useLatest && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium">
                Select Photos for Preview
              </Label>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={selectLatestImages}
                >
                  Select Latest {settings.count}
                </Button>
                <Button variant="outline" size="sm" onClick={clearSelection}>
                  Clear All
                </Button>
              </div>
            </div>

            <p className="text-sm text-muted-foreground">
              Selected: {settings.selectedImages.length} of {settings.count}{" "}
              photos
            </p>

            {visibleImages.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <ImageIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No photos available for selection</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 max-h-96 overflow-y-auto border rounded-lg p-4">
                {visibleImages.map((image) => (
                  <motion.div
                    key={image.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative group cursor-pointer"
                    onClick={() => toggleImageSelection(image.id)}
                  >
                    <div
                      className={`relative rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                        settings.selectedImages.includes(image.id)
                          ? "border-primary ring-2 ring-primary/20"
                          : "border-transparent hover:border-primary/50"
                      }`}
                    >
                      <Image
                        src={`/api/gallery/${image.filename}`}
                        alt={image.caption || `Photo by ${image.uploader}`}
                        width={150}
                        height={150}
                        className="w-full h-24 object-cover"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200" />
                      <div className="absolute top-2 right-2">
                        <Checkbox
                          checked={settings.selectedImages.includes(image.id)}
                          onChange={() => toggleImageSelection(image.id)}
                          className="bg-white/90 border-white"
                        />
                      </div>
                    </div>
                    <p
                      className="text-xs text-center mt-1 truncate"
                      title={image.uploader}
                    >
                      {image.uploader}
                    </p>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Save Button */}
        <div className="flex justify-end pt-4">
          <Button onClick={saveSettings} disabled={saving} className="min-w-32">
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Settings
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
