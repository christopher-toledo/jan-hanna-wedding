import { readFile, writeFile, unlink } from "fs/promises"
import { existsSync } from "fs"
import path from "path"
import { type NextRequest, NextResponse } from "next/server"

interface GalleryImage {
  id: string
  filename: string
  originalName: string
  uploaderName: string
  uploadedAt: string
  caption?: string
  visible: boolean
}

export async function PATCH(request: NextRequest, { params }: { params: { imageId: string } }) {
  try {
    const { visible } = await request.json()
    const imageId = params.imageId

    const dataDir = path.join(process.cwd(), "data")
    const galleryFile = path.join(dataDir, "gallery.json")

    if (!existsSync(galleryFile)) {
      return NextResponse.json({ error: "Gallery not found" }, { status: 404 })
    }

    const fileContent = await readFile(galleryFile, "utf-8")
    const gallery: GalleryImage[] = JSON.parse(fileContent)

    const imageIndex = gallery.findIndex((img) => img.id === imageId)
    if (imageIndex === -1) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 })
    }

    // Update visibility
    gallery[imageIndex].visible = visible

    // Save updated gallery
    await writeFile(galleryFile, JSON.stringify(gallery, null, 2))

    return NextResponse.json({ success: true, image: gallery[imageIndex] })
  } catch (error) {
    console.error("Error updating image:", error)
    return NextResponse.json({ error: "Failed to update image" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { imageId: string } }) {
  try {
    const imageId = params.imageId

    const dataDir = path.join(process.cwd(), "data")
    const galleryFile = path.join(dataDir, "gallery.json")
    const uploadsDir = path.join(process.cwd(), "public", "uploads", "gallery")

    if (!existsSync(galleryFile)) {
      return NextResponse.json({ error: "Gallery not found" }, { status: 404 })
    }

    const fileContent = await readFile(galleryFile, "utf-8")
    const gallery: GalleryImage[] = JSON.parse(fileContent)

    const imageIndex = gallery.findIndex((img) => img.id === imageId)
    if (imageIndex === -1) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 })
    }

    const imageToDelete = gallery[imageIndex]

    // Delete physical file
    const imagePath = path.join(uploadsDir, imageToDelete.filename)
    if (existsSync(imagePath)) {
      await unlink(imagePath)
    }

    // Remove from gallery array
    gallery.splice(imageIndex, 1)

    // Save updated gallery
    await writeFile(galleryFile, JSON.stringify(gallery, null, 2))

    return NextResponse.json({ success: true, message: "Image deleted successfully" })
  } catch (error) {
    console.error("Error deleting image:", error)
    return NextResponse.json({ error: "Failed to delete image" }, { status: 500 })
  }
}
