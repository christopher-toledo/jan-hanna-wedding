import { NextResponse } from "next/server"
import { readFile, writeFile, mkdir } from "fs/promises"
import { existsSync } from "fs"
import path from "path"

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
    const settingsFile = await getSettingsFilePath()
    if (!existsSync(settingsFile)) {
      return defaultSettings
    }

    const fileContent = await readFile(settingsFile, "utf-8")
    const settings = JSON.parse(fileContent)
    return { ...defaultSettings, ...settings }
  } catch (error) {
    console.error("Error reading preview settings:", error)
    return defaultSettings
  }
}

async function writeSettings(settings: PreviewSettings): Promise<void> {
  try {
    const settingsFile = await getSettingsFilePath()
    await writeFile(settingsFile, JSON.stringify(settings, null, 2))
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
