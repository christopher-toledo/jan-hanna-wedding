import { type NextRequest, NextResponse } from "next/server"
import { readFile, writeFile, mkdir } from "fs/promises"
import { existsSync } from "fs"
import path from "path"

interface RSVPSettings {
  enabled: boolean
  deadline?: string // ISO string in UTC
  customMessage?: string
}

// Utility functions for Philippine time (UTC+8)
function convertToPhilippineTime(utcDate: Date): Date {
  return new Date(utcDate.setHours(utcDate.getUTCHours() + 8));
}
function isRSVPOpen(settings: RSVPSettings): boolean {
  if (!settings.enabled) return false

  if (settings.deadline) {
    const now = new Date()
    const philippineNow = convertToPhilippineTime(now)
    const deadlineDate = new Date(settings.deadline)

    return philippineNow <= deadlineDate
  }

  return true
}

export async function GET() {
  try {
    const dataDir = path.join(process.cwd(), "data")
    const settingsFile = path.join(dataDir, "rsvp-settings.json")

    if (!existsSync(settingsFile)) {
      // Return default settings
      const defaultSettings: RSVPSettings = {
        enabled: true,
        deadline: undefined,
        customMessage: "RSVP submissions are currently closed.",
      }
      return NextResponse.json({
        settings: defaultSettings,
        isOpen: isRSVPOpen(defaultSettings),
      })
    }

    const fileContent = await readFile(settingsFile, "utf-8")
    const settings: RSVPSettings = JSON.parse(fileContent)

    return NextResponse.json({
      settings,
      isOpen: isRSVPOpen(settings),
    })
  } catch (error) {
    console.error("Error fetching RSVP settings:", error)
    return NextResponse.json({ error: "Failed to fetch RSVP settings" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { enabled, deadline, customMessage } = body

    const dataDir = path.join(process.cwd(), "data")
    const settingsFile = path.join(dataDir, "rsvp-settings.json")

    // Ensure data directory exists
    if (!existsSync(dataDir)) {
      await mkdir(dataDir, { recursive: true })
    }

    // Convert deadline from Philippine time to UTC for storage

    const settings: RSVPSettings = {
      enabled: Boolean(enabled),
      deadline: deadline,
      customMessage: customMessage || "RSVP submissions are currently closed.",
    }

    await writeFile(settingsFile, JSON.stringify(settings, null, 2))

    return NextResponse.json({
      success: true,
      settings,
      isOpen: isRSVPOpen(settings),
    })
  } catch (error) {
    console.error("Error saving RSVP settings:", error)
    return NextResponse.json({ error: "Failed to save RSVP settings" }, { status: 500 })
  }
}
