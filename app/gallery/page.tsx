"use client";

import { GalleryGrid } from "@/components/gallery-grid";
import { ImageUpload } from "@/components/image-upload";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import Image from "next/image";
import { useState, useCallback, useEffect } from "react";
import { Camera } from "lucide-react";

interface UploadSettings {
  enabled: boolean;
  maxPhotos: number;
  message?: string;
}

export default function GalleryPage() {
  const [galleryRefreshTrigger, setGalleryRefreshTrigger] = useState(0);
  const [uploadSettings, setUploadSettings] = useState<UploadSettings>({
    enabled: true,
    maxPhotos: 5,
  });
  const [settingsLoading, setSettingsLoading] = useState(true);

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
        setSettingsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleUploadSuccess = useCallback(() => {
    // Trigger gallery refresh
    setGalleryRefreshTrigger((prev) => prev + 1);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50/50">
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
            alt="Wedding gallery background"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-white/90"></div>
        </div>

        <div className="relative z-10 container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="font-serif text-5xl md:text-6xl text-primary mb-6">
              Wedding Gallery
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              {uploadSettings.enabled
                ? "Share your favorite moments with us and create lasting memories together"
                : "Browse through all the wonderful memories from our special day"}
            </p>
            <div className="w-24 h-px bg-primary/30 mx-auto mt-6"></div>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-6 py-24">
        {/* Upload Section - Only show when enabled */}
        {!settingsLoading && uploadSettings.enabled && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-2xl mx-auto mb-16"
          >
            <Card className="elegant-shadow elegant-border">
              <CardHeader>
                <CardTitle className="font-serif text-2xl text-primary text-center flex items-center justify-center gap-2">
                  <Camera className="h-6 w-6" />
                  Share Your Photos
                </CardTitle>
                <p className="text-center text-muted-foreground">
                  Help us capture every beautiful moment of our special day
                </p>
              </CardHeader>
              <CardContent>
                <ImageUpload onUploadSuccess={handleUploadSuccess} />
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Gallery Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            delay: uploadSettings.enabled ? 0.4 : 0.2,
          }}
        >
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl text-primary mb-4">
              All Photos
            </h2>
            <p className="text-lg text-muted-foreground">
              Browse through all the wonderful memories shared by our guests
            </p>
            <div className="w-16 h-px bg-primary/30 mx-auto mt-4"></div>
          </div>

          <GalleryGrid refreshTrigger={galleryRefreshTrigger} />
        </motion.div>
      </div>
    </div>
  );
}
