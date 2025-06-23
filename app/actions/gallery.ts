"use server"

import { writeFile, readFile, mkdir } from "fs/promises"
import { existsSync } from "fs"
import path from "path"
import { v4 as uuidv4 } from "uuid"
import { put } from "@vercel/blob"

interface GalleryImage {
  id: string
  filename: string
  originalName: string
  uploader: string
  uploadedAt: string
  caption?: string
  visible: boolean
  blobUrl: string
}

export async function uploadImage(prevState: any, formData: FormData) {
  try {
    const uploader = formData.get("uploader") as string
    const caption = formData.get("caption") as string
    const images = formData.getAll("images") as File[]

    if (!uploader || images.length === 0) {
      return { error: "Please provide your name and select at least one image" }
    }

    // Create data directory for metadata storage
    const dataDir = path.join(process.cwd(), "data")
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

      // Generate unique filename with {uploader}_{timestamp}.{extension}
      const timestamp = new Date().toISOString().replace(/[:.-]/g, "_")
      const extension = path.extname(image.name).toLowerCase() || ".jpg"
      const uniqueFilename = `${uploader}_${timestamp}${extension}`

      try {
        // Upload to Vercel Blob Storage
        const blob = await put(uniqueFilename, image, {
          access: 'public',
          addRandomSuffix: false,
        })

        console.log("Blob upload response:", blob)

        uploadedImages.push({
          id: uuidv4(),
          filename: uniqueFilename,
          originalName: image.name,
          uploader,
          uploadedAt: new Date().toISOString(),
          caption: caption || "",
          visible: true,
          blobUrl: blob.url,
        })
      } catch (uploadError) {
        console.error("Error uploading to Vercel Blob:", uploadError)
        // Continue with other images if one fails
        continue
      }
    }

    if (uploadedImages.length === 0) {
      return { error: "Failed to upload any images. Please try again." }
    }

    // Save metadata to local JSON file
    galleryData.push(...uploadedImages)
    await writeFile(galleryFile, JSON.stringify(galleryData, null, 2))

    return { success: true, message: `Successfully uploaded ${uploadedImages.length} image(s)` }
  } catch (error) {
    console.error("Error uploading images:", error)
    return { error: "Failed to upload images. Please try again." }
  }
}