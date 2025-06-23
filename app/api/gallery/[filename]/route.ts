import { type NextRequest, NextResponse } from "next/server"
import { readFile } from "fs/promises"
import { existsSync } from "fs"
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

export async function GET(request: NextRequest, { params }: { params: { filename: string } }) {
  try {
    const _params = await(params)
    const filename = _params.filename

    // Read gallery metadata to find the blob URL
    const dataDir = path.join(process.cwd(), "data")
    const galleryFile = path.join(dataDir, "gallery.json")

    if (!existsSync(galleryFile)) {
      return new NextResponse("Gallery not found", { status: 404 })
    }

    const fileContent = await readFile(galleryFile, "utf-8")
    const gallery: GalleryImage[] = JSON.parse(fileContent)

    // Find the image by filename
    const image = gallery.find(img => img.filename === filename)

    if (!image || !image.blobUrl) {
      return new NextResponse("Image not found", { status: 404 })
    }

    // Redirect to the Vercel Blob URL
    return NextResponse.redirect(image.blobUrl)
  } catch (error) {
    console.error("Error serving image:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}