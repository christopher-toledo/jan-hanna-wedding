"use client"

import { GalleryGrid } from "@/components/gallery-grid"
import { ImageUpload } from "@/components/image-upload"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"
import Image from "next/image"

export default function GalleryPage() {
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
            <h1 className="font-serif text-5xl md:text-6xl text-primary mb-6">Wedding Gallery</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Share your favorite moments with us and create lasting memories together
            </p>
            <div className="w-24 h-px bg-primary/30 mx-auto mt-6"></div>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-6 pb-24">
        <Tabs defaultValue="gallery" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-12">
            <TabsTrigger value="gallery" className="text-base">
              View Gallery
            </TabsTrigger>
            <TabsTrigger value="upload" className="text-base">
              Upload Photos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="gallery" className="mt-8">
            <GalleryGrid />
          </TabsContent>

          <TabsContent value="upload" className="mt-8">
            <Card className="max-w-2xl mx-auto elegant-shadow elegant-border">
              <CardHeader>
                <CardTitle className="font-serif text-2xl text-primary text-center">Share Your Photos</CardTitle>
                <p className="text-center text-muted-foreground">
                  Help us capture every beautiful moment of our special day
                </p>
              </CardHeader>
              <CardContent>
                <ImageUpload />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
