"use client";

import type React from "react";

import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, X, ImageIcon, Loader2, AlertCircle } from "lucide-react";
import { uploadImage } from "@/app/actions/gallery";
import { useActionState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ImageUploadProps {
  onUploadSuccess?: () => void;
}

interface UploadSettings {
  enabled: boolean;
  maxPhotos: number;
  message?: string;
}

export function ImageUpload({ onUploadSuccess }: ImageUploadProps) {
  const [state, formAction, isPending] = useActionState(uploadImage, null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [uploadSettings, setUploadSettings] = useState<UploadSettings>({
    enabled: true,
    maxPhotos: 5,
  });
  const [loading, setLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [hasProcessedSuccess, setHasProcessedSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Fetch upload settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch("/api/admin/upload-settings");
        if (response.ok) {
          const settings = await response.json();
          setUploadSettings(settings);
        }
      } catch (error) {
        console.error("Error fetching upload settings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  // Handle successful upload
  useEffect(() => {
    if (state?.success && !hasProcessedSuccess) {
      setShowSuccess(true);
      setHasProcessedSuccess(true);
      // Call the callback to refresh gallery
      if (onUploadSuccess) {
        onUploadSuccess();
      }
    }
  }, [state?.success, hasProcessedSuccess, onUploadSuccess]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));

    if (imageFiles.length !== files.length) {
      alert("Please select only image files");
      return;
    }

    // Limit to maxPhotos
    if (imageFiles.length > uploadSettings.maxPhotos) {
      alert(
        `You can only upload up to ${uploadSettings.maxPhotos} photos at a time`
      );
      return;
    }

    setSelectedFiles(imageFiles);

    // Clean up old previews
    previews.forEach((preview) => URL.revokeObjectURL(preview));

    // Create new previews
    const newPreviews = imageFiles.map((file) => URL.createObjectURL(file));
    setPreviews(newPreviews);
  };

  const removeFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);

    // Revoke the URL to free memory
    URL.revokeObjectURL(previews[index]);

    setSelectedFiles(newFiles);
    setPreviews(newPreviews);
  };

  const resetForm = useCallback(() => {
    // Clean up all preview URLs
    previews.forEach((preview) => URL.revokeObjectURL(preview));

    // Reset all state
    setSelectedFiles([]);
    setPreviews([]);
    setShowSuccess(false);
    setHasProcessedSuccess(true);

    // Reset form elements
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    if (formRef.current) {
      formRef.current.reset();
    }
  }, [previews]);

  // Enhanced form action that includes selected files
  const enhancedFormAction = (formData: FormData) => {
    // Reset the processed success flag when starting a new upload
    setHasProcessedSuccess(false);

    // Add selected files to form data
    selectedFiles.forEach((file) => {
      formData.append("images", file);
    });

    // Call the original action
    return formAction(formData);
  };

  // Clean up previews on unmount
  useEffect(() => {
    return () => {
      previews.forEach((preview) => URL.revokeObjectURL(preview));
    };
  }, []);

  if (loading) {
    return (
      <div className="text-center py-8">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
        <p className="text-muted-foreground">Loading upload settings...</p>
      </div>
    );
  }

  if (!uploadSettings.enabled) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <Upload className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="font-header text-xl text-primary mb-2">
          Photo Uploads Disabled
        </h3>
        <p className="text-muted-foreground">
          {uploadSettings.message ||
            "Photo uploads are currently disabled. Please check back later."}
        </p>
      </div>
    );
  }

  if (showSuccess) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <ImageIcon className="h-8 w-8 text-green-600" />
        </div>
        <h3 className="font-header text-xl text-primary mb-2">
          Photos Uploaded!
        </h3>
        <p className="text-muted-foreground">
          Thank you for sharing your beautiful moments with us.
        </p>
        <div className="mt-4 text-sm text-muted-foreground">
          <p>Your photos will appear in the gallery shortly...</p>
        </div>
        <Button variant="outline" className="mt-4" onClick={resetForm}>
          Upload More Photos
        </Button>
      </div>
    );
  }

  return (
    <form ref={formRef} action={enhancedFormAction} className="space-y-6">
      {/* Upload Limit Notice */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          You can upload up to {uploadSettings.maxPhotos} photos at a time. Each
          photo should be under 10MB.
        </AlertDescription>
      </Alert>

      <div className="space-y-4">
        <div>
          <Label htmlFor="uploader" className="text-base font-medium">
            Your Name
          </Label>
          <Input
            id="uploader"
            name="uploader"
            placeholder="Enter your name"
            required
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="caption" className="text-base font-medium">
            Caption (Optional)
          </Label>
          <Textarea
            id="caption"
            name="caption"
            placeholder="Add a caption to your photos..."
            className="mt-2"
            rows={3}
          />
        </div>

        <div>
          <Label className="text-base font-medium">
            Select Photos (Max {uploadSettings.maxPhotos})
          </Label>
          <div className="mt-2">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-muted-foreground/25 rounded-lg cursor-pointer hover:border-primary/50 transition-colors"
            >
              <Upload className="h-8 w-8 text-muted-foreground mb-2" />
              <span className="text-sm text-muted-foreground">
                Click to select photos
              </span>
              <span className="text-xs text-muted-foreground mt-1">
                PNG, JPG, GIF up to 10MB each (Max {uploadSettings.maxPhotos}{" "}
                photos)
              </span>
            </label>
          </div>
        </div>

        {/* File Previews */}
        {selectedFiles.length > 0 && (
          <div className="space-y-4">
            <Label className="text-base font-medium">
              Selected Photos ({selectedFiles.length}/{uploadSettings.maxPhotos}
              )
            </Label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {previews.map((preview, index) => (
                <div key={index} className="relative group">
                  <img
                    src={preview || "/placeholder.svg"}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg border"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeFile(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                  <div className="absolute bottom-1 left-1 right-1 bg-black/50 text-white text-xs px-1 py-0.5 rounded text-center">
                    {selectedFiles[index].name.length > 15
                      ? `${selectedFiles[index].name.substring(0, 15)}...`
                      : selectedFiles[index].name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {state?.error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600 text-sm">{state.error}</p>
        </div>
      )}

      <Button
        type="submit"
        className="w-full bg-primary hover:bg-primary/90 text-white py-6 text-lg font-medium elegant-shadow"
        disabled={isPending || selectedFiles.length === 0}
      >
        {isPending ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Uploading...
          </>
        ) : (
          `Upload ${selectedFiles.length} Photo${
            selectedFiles.length !== 1 ? "s" : ""
          }`
        )}
      </Button>
    </form>
  );
}
