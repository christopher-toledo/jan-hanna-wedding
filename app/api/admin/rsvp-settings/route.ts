import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"

interface RSVPSettings {
  enabled: boolean
  deadline?: string // ISO string in UTC
  customMessage?: string
}

// Utility functions for Philippine time (UTC+8)
function convertToPhilippineTime(utcDate: Date): Date {
  return new Date(utcDate.setHours(utcDate.getUTCHours() + 8))
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
    const result = await executeQuery("SELECT enabled, deadline, custom_message FROM rsvp_settings WHERE id = 1")

    let settings: RSVPSettings = {
      enabled: true,
      deadline: undefined,
      customMessage: "RSVP submissions are currently closed.",
    }

    if (result.rows.length > 0) {
      const row = result.rows[0]
      settings = {
        enabled: Boolean(row.enabled),
        deadline: row.deadline || undefined,
        customMessage: row.custom_message || "RSVP submissions are currently closed.",
      }
    }

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

    const settings: RSVPSettings = {
      enabled: Boolean(enabled),
      deadline: deadline,
      customMessage: customMessage || "RSVP submissions are currently closed.",
    }

    await executeQuery(
      `INSERT OR REPLACE INTO rsvp_settings (id, enabled, deadline, custom_message, updated_at) 
       VALUES (1, ?, ?, ?, ?)`,
      [settings.enabled, settings.deadline, settings.customMessage, new Date().toISOString()],
    )

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
