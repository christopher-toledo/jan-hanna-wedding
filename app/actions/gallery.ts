"use server"

import { v4 as uuidv4 } from "uuid"
import { put } from "@vercel/blob"
import { executeQuery } from "@/lib/db"
import path from "path"

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
        const blob = await put("gallery/" + uniqueFilename, image, {
          access: "public",
          addRandomSuffix: false,
        })

        console.log("Blob upload response:", blob)

        const newImage = {
          id: uuidv4(),
          filename: uniqueFilename,
          originalName: image.name,
          uploader,
          uploadedAt: new Date().toISOString(),
          caption: caption || "",
          visible: true,
          blobUrl: blob.url,
        }

        // Save metadata to database
        await executeQuery(
          `INSERT INTO gallery_images (id, filename, original_name, uploader, uploaded_at, caption, visible, blob_url)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            newImage.id,
            newImage.filename,
            newImage.originalName,
            newImage.uploader,
            newImage.uploadedAt,
            newImage.caption,
            newImage.visible,
            newImage.blobUrl,
          ],
        )

        uploadedImages.push(newImage)
      } catch (uploadError) {
        console.error("Error uploading to Vercel Blob:", uploadError)
        // Continue with other images if one fails
        continue
      }
    }

    if (uploadedImages.length === 0) {
      return { error: "Failed to upload any images. Please try again." }
    }

    return { success: true, message: `Successfully uploaded ${uploadedImages.length} image(s)` }
  } catch (error) {
    console.error("Error uploading images:", error)
    return { error: "Failed to upload images. Please try again." }
  }
}
