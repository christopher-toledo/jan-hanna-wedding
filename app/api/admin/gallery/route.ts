import { NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"
import { type GalleryImageRow, transformGalleryImageRow } from "@/lib/types"

export async function GET() {
  try {
    const result = await executeQuery<GalleryImageRow>(
      `SELECT id, filename, original_name, uploader, uploaded_at, 
              caption, visible, blob_url
       FROM gallery_images 
       ORDER BY uploaded_at DESC`,
    )

    const images = result.rows.map(transformGalleryImageRow)

    return NextResponse.json({ images })
  } catch (error) {
    console.error("Error fetching gallery:", error)
    return NextResponse.json({ error: "Failed to fetch gallery" }, { status: 500 })
  }
}
