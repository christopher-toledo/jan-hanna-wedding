"use client";

import React, {
  useRef,
  useState,
  useEffect,
  startTransition,
  FormEvent,
} from "react";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, X, ImageIcon, Loader2 } from "lucide-react";
import { uploadImage } from "@/app/actions/gallery";

interface ImageUploadProps {
  onUploadSuccess?: () => void;
}

export function ImageUpload({ onUploadSuccess }: ImageUploadProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const [state, formAction, isPending] = useActionState(uploadImage, null);

  useEffect(() => {
    if (state?.success) {
      alert("Successfully Uploaded");
      setShowSuccess(true);
      onUploadSuccess?.();
      setTimeout(() => {
        resetForm();
      }, 2000);
    }

    if (state?.error) {
      alert("Upload failed: " + state.error);
    }
  }, [state]);

  const resetForm = () => {
    setSelectedFiles([]);
    setPreviews([]);
    setShowSuccess(false);
    formRef.current?.reset();
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));

    if (imageFiles.length !== files.length) {
      alert("Please select only image files");
      return;
    }

    setSelectedFiles(imageFiles);
    const newPreviews = imageFiles.map((file) => URL.createObjectURL(file));
    setPreviews(newPreviews);
  };

  const removeFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    URL.revokeObjectURL(previews[index]);
    setSelectedFiles(newFiles);
    setPreviews(newPreviews);
  };

  const confirmAndSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedFiles.length) return;

    const confirmed = confirm("Are you sure you want to upload these photos?");
    if (!confirmed) return;

    const formData = new FormData(e.currentTarget);
    selectedFiles.forEach((file) => formData.append("images", file));

    startTransition(() => {
      formAction(formData);
    });
  };

  if (showSuccess) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <ImageIcon className="h-8 w-8 text-green-600" />
        </div>
        <h3 className="font-serif text-xl text-primary mb-2">
          Photos Uploaded!
        </h3>
        <p className="text-muted-foreground">
          Thank you for sharing your beautiful moments with us.
        </p>
        <div className="mt-4 text-sm text-muted-foreground">
          <p>Your photos will appear in the gallery below shortly...</p>
        </div>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      action={formAction}
      onSubmit={confirmAndSubmit}
      className="space-y-6"
    >
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
          <Label className="text-base font-medium">Select Photos</Label>
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
                PNG, JPG, GIF up to 10MB each
              </span>
            </label>
          </div>
        </div>

        {selectedFiles.length > 0 && (
          <div className="space-y-4">
            <Label className="text-base font-medium">
              Selected Photos ({selectedFiles.length})
            </Label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {previews.map((preview, index) => (
                <div key={index} className="relative group">
                  <img
                    src={preview}
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
