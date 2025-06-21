import { readFile } from "fs/promises"
import { existsSync } from "fs"
import path from "path"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const dataDir = path.join(process.cwd(), "data")
    const galleryFile = path.join(dataDir, "gallery.json")

    if (!existsSync(galleryFile)) {
      return NextResponse.json({ error: "No gallery found" }, { status: 404 })
    }

    const fileContent = await readFile(galleryFile, "utf-8")
    const gallery = JSON.parse(fileContent)

    if (gallery.length === 0) {
      return NextResponse.json({ error: "No images to export" }, { status: 404 })
    }

    // Return metadata as JSON for now (simpler approach)
    const metadata = gallery.map((img: any) => ({
      filename: img.originalName,
      uploader: img.uploaderName,
      uploadedAt: img.uploadedAt,
      caption: img.caption || "",
      visible: img.visible,
      downloadUrl: `/api/gallery/${img.filename}`,
    }))

    return NextResponse.json(
      {
        images: metadata,
        totalImages: gallery.length,
        exportDate: new Date().toISOString(),
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Content-Disposition": `attachment; filename="wedding-gallery-metadata-${new Date().toISOString().split("T")[0]}.json"`,
        },
      },
    )
  } catch (error) {
    console.error("Error exporting gallery:", error)
    return NextResponse.json({ error: "Failed to export gallery" }, { status: 500 })
  }
}
