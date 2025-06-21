"use server"

import { writeFile, readFile, mkdir } from "fs/promises"
import { existsSync } from "fs"
import path from "path"
import { v4 as uuidv4 } from "uuid"

interface GalleryImage {
  id: string
  filename: string
  originalName: string
  uploader: string
  uploadedAt: string
  caption?: string
  visible: boolean
}

export async function uploadImage(prevState: any, formData: FormData) {
  try {
    const uploader = formData.get("uploader") as string
    const caption = formData.get("caption") as string
    const images = formData.getAll("images") as File[]

    if (!uploader || images.length === 0) {
      return { error: "Please provide your name and select at least one image" }
    }

    // Create directories
    const uploadsDir = path.join(process.cwd(), "public", "uploads", "gallery")
    const dataDir = path.join(process.cwd(), "data")

    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true })
    }
    if (!existsSync(dataDir)) {
      await mkdir(dataDir, { recursive: true })
    }

    // Read existing gallery data
    const galleryFile = path.join(dataDir, "gallery.json")
    let galleryData: GalleryImage[] = []

    if (existsSync(galleryFile)) {
      const fileContent = await readFile(galleryFile, "utf-8")
      galleryData = JSON.parse(fileContent)
    }

    // Process each image
    const uploadedImages: GalleryImage[] = []

    for (const image of images) {
      if (!image.type.startsWith("image/")) {
        continue
      }

      // Generate unique filename
      const fileExtension = path.extname(image.name)
      const uniqueFilename = `${uuidv4()}${fileExtension}`
      const filePath = path.join(uploadsDir, uniqueFilename)

      // Convert file to buffer and save
      const bytes = await image.arrayBuffer()
      const buffer = Buffer.from(bytes)
      await writeFile(filePath, buffer)

      // Create image record
      const imageRecord: GalleryImage = {
        id: uuidv4(),
        filename: uniqueFilename,
        originalName: image.name,
        uploader,
        uploadedAt: new Date().toISOString(),
        caption: caption || undefined,
        visible: true,
      }

      uploadedImages.push(imageRecord)
    }

    // Add to gallery data
    galleryData.push(...uploadedImages)

    // Save gallery data
    await writeFile(galleryFile, JSON.stringify(galleryData, null, 2))

    return { success: true, message: `Successfully uploaded ${uploadedImages.length} image(s)` }
  } catch (error) {
    console.error("Error uploading images:", error)
    return { error: "Failed to upload images. Please try again." }
  }
}
