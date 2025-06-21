import { readFile } from "fs/promises"
import { existsSync } from "fs"
import path from "path"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const dataDir = path.join(process.cwd(), "data")
    const galleryFile = path.join(dataDir, "gallery.json")

    if (!existsSync(galleryFile)) {
      return NextResponse.json({ images: [] })
    }

    const fileContent = await readFile(galleryFile, "utf-8")
    const gallery = JSON.parse(fileContent)

    // Sort by upload date, newest first
    gallery.sort((a: any, b: any) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())

    return NextResponse.json({ images: gallery })
  } catch (error) {
    console.error("Error fetching gallery:", error)
    return NextResponse.json({ error: "Failed to fetch gallery" }, { status: 500 })
  }
}
