import { NextResponse } from "next/server"
import { executeQuery, executeTransaction } from "@/lib/db"
import path from "path"
import { existsSync } from "fs"
import { mkdir } from "fs/promises"

interface PreviewSettings {
  count: number
  selectedImages: string[]
  useLatest: boolean
}

const defaultSettings: PreviewSettings = {
  count: 10,
  selectedImages: [],
  useLatest: true,
}

async function getSettingsFilePath() {
  const dataDir = path.join(process.cwd(), "data")
  if (!existsSync(dataDir)) {
    await mkdir(dataDir, { recursive: true })
  }
  return path.join(dataDir, "preview-settings.json")
}

async function readSettings(): Promise<PreviewSettings> {
  try {
    const settingsResult = await executeQuery("SELECT count, use_latest FROM preview_settings WHERE id = 1")

    if (settingsResult.rows.length === 0) {
      return defaultSettings
    }

    const settings = settingsResult.rows[0]

    // Get selected images
    const selectedImagesResult = await executeQuery("SELECT image_id FROM preview_selected_images ORDER BY created_at")

    return {
      count: Number(settings.count),
      useLatest: Boolean(settings.use_latest),
      selectedImages: selectedImagesResult.rows.map((row: any) => row.image_id),
    }
  } catch (error) {
    console.error("Error reading preview settings:", error)
    return defaultSettings
  }
}

async function writeSettings(settings: PreviewSettings): Promise<void> {
  try {
    const queries = []

    // Update or insert settings
    queries.push({
      sql: `INSERT OR REPLACE INTO preview_settings (id, count, use_latest, updated_at) 
            VALUES (1, ?, ?, ?)`,
      args: [settings.count, settings.useLatest, new Date().toISOString()],
    })

    // Clear existing selected images
    queries.push({
      sql: "DELETE FROM preview_selected_images",
      args: [],
    })

    // Insert new selected images
    for (const imageId of settings.selectedImages) {
      queries.push({
        sql: `INSERT INTO preview_selected_images (image_id, created_at) 
              VALUES (?, ?)`,
        args: [imageId, new Date().toISOString()],
      })
    }

    await executeTransaction(queries)
  } catch (error) {
    console.error("Error writing preview settings:", error)
    throw error
  }
}

export async function GET() {
  try {
    const settings = await readSettings()
    return NextResponse.json(settings)
  } catch (error) {
    console.error("Error fetching preview settings:", error)
    return NextResponse.json({ error: "Failed to fetch preview settings" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const settings: PreviewSettings = {
      count: Math.max(1, Math.min(50, body.count ?? defaultSettings.count)), // Limit between 1-50
      selectedImages: Array.isArray(body.selectedImages) ? body.selectedImages : [],
      useLatest: body.useLatest ?? defaultSettings.useLatest,
    }

    await writeSettings(settings)
    return NextResponse.json(settings)
  } catch (error) {
    console.error("Error updating preview settings:", error)
    return NextResponse.json({ error: "Failed to update preview settings" }, { status: 500 })
  }
}
