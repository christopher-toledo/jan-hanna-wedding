"use server"

import { writeFile, readFile, mkdir } from "fs/promises"
import { existsSync } from "fs"
import path from "path"
import { v4 as uuidv4 } from "uuid"
import { google } from "googleapis"
import { Readable } from "stream"

interface GalleryImage {
  id: string
  filename: string
  originalName: string
  uploader: string
  uploadedAt: string
  caption?: string
  visible: boolean
}

// Helper to get or create uploader subfolder
async function getOrCreateUploaderFolder(drive: any, parentId: string, uploader: string): Promise<string> {
  // Check if folder exists
  const listRes = await drive.files.list({
    q: `'${parentId}' in parents and name='${uploader}' and mimeType='application/vnd.google-apps.folder' and trashed=false`,
    fields: "files(id, name)",
    spaces: "drive",
  });
  if (listRes.data.files && listRes.data.files.length > 0) {
    return listRes.data.files[0].id!;
  }
  // Create folder if not exists
  const createRes = await drive.files.create({
    requestBody: {
      name: uploader,
      mimeType: "application/vnd.google-apps.folder",
      parents: [parentId],
    },
    fields: "id",
  });
  return createRes.data.id!;
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

    // Google Drive setup
    const serviceAccount = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON as string)
    const galleryFolderId = process.env.GOOGLE_DRIVE_GALLERY_FOLDER_ID as string;

    const jwtClient = new google.auth.JWT({
      email: serviceAccount.client_email,
      key: serviceAccount.private_key,
      scopes: ["https://www.googleapis.com/auth/drive.file"],
    })
    const drive = google.drive({ version: "v3", auth: jwtClient })

    // Get or create uploader subfolder
    const uploaderFolderId = await getOrCreateUploaderFolder(drive, galleryFolderId, uploader);

    // Process each image
    const uploadedImages: GalleryImage[] = []

    for (const image of images) {
      if (!image.type.startsWith("image/")) {
        continue
      }

      // Generate unique filename with {uploader}_{timestamp}.{extension}
      const timestamp = Date.now()
      const extension = path.extname(image.name)
      const uniqueFilename = `${uploader}_${timestamp}${extension}`

      // Convert File to Buffer and then to Readable stream
      const buffer = Buffer.from(await image.arrayBuffer())
      const stream = Readable.from(buffer)

      // Upload to Google Drive
      if (!uploaderFolderId) {
        throw new Error("Uploader folder ID is not set");
      }
      const driveRes = await drive.files.create({
        requestBody: {
          name: uniqueFilename,
          mimeType: image.type,
          parents: [uploaderFolderId], // <-- use uploader subfolder
          description: caption || "",
        },
        media: {
          mimeType: image.type,
          body: stream,
        },
        fields: "id,webViewLink,webContentLink",
      });

      console.log("Drive upload response:", driveRes.data);  
    
    }
    return { success: true, message: `Successfully uploaded ${uploadedImages.length} image(s)` }
  } catch (error) {
    console.error("Error uploading images:", error)
    return { error: "Failed to upload images. Please try again." }
  }
}
