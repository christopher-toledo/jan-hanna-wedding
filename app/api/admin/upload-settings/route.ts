import { NextResponse } from "next/server"
import { readFile, writeFile, mkdir } from "fs/promises"
import { existsSync } from "fs"
import path from "path"

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

async function getSettingsFilePath() {
  const dataDir = path.join(process.cwd(), "data")
  if (!existsSync(dataDir)) {
    await mkdir(dataDir, { recursive: true })
  }
  return path.join(dataDir, "upload-settings.json")
}

async function readSettings(): Promise<UploadSettings> {
  try {
    const settingsFile = await getSettingsFilePath()
    if (!existsSync(settingsFile)) {
      return defaultSettings
    }

    const fileContent = await readFile(settingsFile, "utf-8")
    const settings = JSON.parse(fileContent)

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

    return { ...defaultSettings, ...settings }
  } catch (error) {
    console.error("Error reading upload settings:", error)
    return defaultSettings
  }
}

async function writeSettings(settings: UploadSettings): Promise<void> {
  try {
    const settingsFile = await getSettingsFilePath()
    await writeFile(settingsFile, JSON.stringify(settings, null, 2))
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
      maxPhotos: Math.max(1, Math.min(20, body.maxPhotos ?? defaultSettings.maxPhotos)), // Limit between 1-20
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
