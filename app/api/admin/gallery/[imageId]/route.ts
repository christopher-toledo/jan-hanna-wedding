import { type NextRequest, NextResponse } from "next/server"
import { del } from "@vercel/blob"
import { executeQuery } from "@/lib/db"
import { type GalleryImageRow, transformGalleryImageRow } from "@/lib/types"

export async function PATCH(request: NextRequest, { params }: { params: { imageId: string } }) {
  try {
    const _params = await params
    const { visible } = await request.json()
    const imageId = _params.imageId

    // Update visibility
    const result = await executeQuery("UPDATE gallery_images SET visible = ? WHERE id = ?", [visible, imageId])

    if (result.rowsAffected === 0) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 })
    }

    // Get updated image
    const imageResult = await executeQuery<GalleryImageRow>(
      `SELECT id, filename, original_name, uploader, uploaded_at, 
              caption, visible, blob_url
       FROM gallery_images WHERE id = ?`,
      [imageId],
    )

    const image = imageResult.rows[0] ? transformGalleryImageRow(imageResult.rows[0]) : null

    return NextResponse.json({ success: true, image })
  } catch (error) {
    console.error("Error updating image:", error)
    return NextResponse.json({ error: "Failed to update image" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { imageId: string } }) {
  try {
    const _params = await params
    const imageId = _params.imageId

    // Get image details before deletion
    const imageResult = await executeQuery<{ blob_url: string }>("SELECT blob_url FROM gallery_images WHERE id = ?", [
      imageId,
    ])

    if (imageResult.rows.length === 0) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 })
    }

    const imageToDelete = imageResult.rows[0]

    try {
      // Delete from Vercel Blob Storage
      if (imageToDelete.blob_url) {
        await del(imageToDelete.blob_url)
      }
    } catch (deleteError) {
      console.error("Error deleting from Vercel Blob:", deleteError)
      // Continue with database deletion even if blob deletion fails
    }

    // Delete from database
    await executeQuery("DELETE FROM gallery_images WHERE id = ?", [imageId])

    return NextResponse.json({ success: true, message: "Image deleted successfully" })
  } catch (error) {
    console.error("Error deleting image:", error)
    return NextResponse.json({ error: "Failed to delete image" }, { status: 500 })
  }
}
