"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, EyeOff, Trash2, Download, ImageIcon } from "lucide-react"
import Image from "next/image"

interface GalleryImage {
  id: string
  filename: string
  originalName: string
  uploader: string
  uploadedAt: string
  caption?: string
  visible: boolean
}

export function GalleryManager() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchImages()
  }, [])

  const fetchImages = async () => {
    try {
      const response = await fetch("/api/admin/gallery")
      const data = await response.json()
      setImages(data.images || [])
    } catch (error) {
      console.error("Error fetching images:", error)
    } finally {
      setLoading(false)
    }
  }

  const toggleVisibility = async (imageId: string, visible: boolean) => {
    try {
      const response = await fetch(`/api/admin/gallery/${imageId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visible: !visible }),
      })

      if (response.ok) {
        fetchImages()
      }
    } catch (error) {
      console.error("Error toggling visibility:", error)
    }
  }

  const deleteImage = async (imageId: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return

    try {
      const response = await fetch(`/api/admin/gallery/${imageId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        fetchImages()
      }
    } catch (error) {
      console.error("Error deleting image:", error)
    }
  }

  const exportImages = async () => {
    try {
      const response = await fetch("/api/admin/gallery/export")
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "gallery-export.json"
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error exporting images:", error)
    }
  }

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
    )
  }

  return (
    <Card className="elegant-shadow">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="h-5 w-5" />
          Gallery Management
          <Badge variant="secondary">{images.length} images</Badge>
        </CardTitle>
        {images.length > 0 && (
          <Button variant="outline" onClick={exportImages}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {images.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No images uploaded yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {images.map((image) => (
              <div key={image.id} className="relative group border rounded-lg overflow-hidden">
                <div className="aspect-square relative">
                  <Image
                    src={`/api/gallery/${image.filename}`}
                    alt={image.caption || `Photo by ${image.uploader}`}
                    fill
                    className="object-cover"
                  />
                  {!image.visible && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <Badge variant="secondary">Hidden</Badge>
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <p className="font-medium text-sm">{image.uploader}</p>
                  {image.caption && <p className="text-xs text-muted-foreground mt-1">{image.caption}</p>}
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(image.uploadedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => toggleVisibility(image.id, image.visible)}
                    className="h-8 w-8 p-0"
                  >
                    {image.visible ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => deleteImage(image.id)} className="h-8 w-8 p-0">
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
