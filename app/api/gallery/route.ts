import { NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"

export async function GET() {
  try {
    const result = await executeQuery(
      `SELECT id, filename, original_name as originalName, uploader, uploaded_at as uploadedAt, 
              caption, visible, blob_url as blobUrl
       FROM gallery_images 
       WHERE visible = 1
       ORDER BY uploaded_at DESC`,
    )

    const images = result.rows.map((row: any) => ({
      ...row,
      visible: Boolean(row.visible),
    }))

    return NextResponse.json({ images })
  } catch (error) {
    console.error("Error fetching gallery images:", error)
    return NextResponse.json({ error: "Failed to fetch images" }, { status: 500 })
  }
}
