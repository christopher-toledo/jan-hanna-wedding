import { NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"

interface UploadSettings {
  enabled: boolean
  maxPhotos: number
  message?: string
  scheduleStart?: string
  scheduleEnd?: string
}

const defaultSettings: UploadSettings = {
  enabled: true,
  maxPhotos: 5,
  message: "",
}

async function readSettings(): Promise<UploadSettings> {
  try {
    const result = await executeQuery(
      `SELECT enabled, max_photos, message, schedule_start, schedule_end 
       FROM upload_settings WHERE id = 1`,
    )

    if (result.rows.length === 0) {
      return defaultSettings
    }

    const row = result.rows[0]
    const settings: UploadSettings = {
      enabled: Boolean(row.enabled),
      maxPhotos: Number(row.max_photos),
      message: row.message || "",
      scheduleStart: row.schedule_start || undefined,
      scheduleEnd: row.schedule_end || undefined,
    }

    // Check if uploads are scheduled
    if (settings.scheduleStart && settings.scheduleEnd) {
      const now = new Date()
      const start = new Date(settings.scheduleStart)
      const end = new Date(settings.scheduleEnd)

      if (now < start || now > end) {
        return {
          ...settings,
          enabled: false,
          message: settings.message || "Photo uploads are currently outside the scheduled time window.",
        }
      }
    }

    return settings
  } catch (error) {
    console.error("Error reading upload settings:", error)
    return defaultSettings
  }
}

async function writeSettings(settings: UploadSettings): Promise<void> {
  try {
    await executeQuery(
      `INSERT OR REPLACE INTO upload_settings (id, enabled, max_photos, message, schedule_start, schedule_end, updated_at) 
       VALUES (1, ?, ?, ?, ?, ?, ?)`,
      [
        settings.enabled,
        settings.maxPhotos,
        settings.message || "",
        settings.scheduleStart || null,
        settings.scheduleEnd || null,
        new Date().toISOString(),
      ],
    )
  } catch (error) {
    console.error("Error writing upload settings:", error)
    throw error
  }
}

export async function GET() {
  try {
    const settings = await readSettings()
    return NextResponse.json(settings)
  } catch (error) {
    console.error("Error fetching upload settings:", error)
    return NextResponse.json({ error: "Failed to fetch upload settings" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const settings: UploadSettings = {
      enabled: body.enabled ?? defaultSettings.enabled,
      maxPhotos: Math.max(1, Math.min(body.maxPhotos ?? defaultSettings.maxPhotos)),
      message: body.message || "",
      scheduleStart: body.scheduleStart || undefined,
      scheduleEnd: body.scheduleEnd || undefined,
    }

    await writeSettings(settings)
    return NextResponse.json(settings)
  } catch (error) {
    console.error("Error updating upload settings:", error)
    return NextResponse.json({ error: "Failed to update upload settings" }, { status: 500 })
  }
}
