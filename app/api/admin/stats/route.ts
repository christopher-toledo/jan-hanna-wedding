import { NextResponse } from "next/server"
import { readFile } from "fs/promises"
import { existsSync } from "fs"
import path from "path"

export async function GET() {
  try {
    const dataDir = path.join(process.cwd(), "data")
    const guestsFile = path.join(dataDir, "guests.json")
    const rsvpsFile = path.join(dataDir, "rsvps.json")
    const galleryFile = path.join(dataDir, "gallery.json")

    let totalGuests = 0
    let attendingGuests = 0
    let notAttendingGuests = 0
    let pendingGuests = 0
    let additionalGuests = 0
    let totalImages = 0
    let rsvpResponses = 0

    // Get guest stats
    if (existsSync(guestsFile)) {
      const guestsContent = await readFile(guestsFile, "utf-8")
      const guests = JSON.parse(guestsContent)

      totalGuests = guests.length
      attendingGuests = guests.filter((g: any) => g.rsvpStatus === "attending").length
      notAttendingGuests = guests.filter((g: any) => g.rsvpStatus === "not-attending").length
      pendingGuests = guests.filter((g: any) => g.rsvpStatus === "pending").length
    }

    // Get RSVP stats and additional guests
    if (existsSync(rsvpsFile)) {
      const rsvpsContent = await readFile(rsvpsFile, "utf-8")
      const rsvps = JSON.parse(rsvpsContent)

      rsvpResponses = rsvps.length

      // Count additional guests
      additionalGuests = rsvps.reduce((total: number, rsvp: any) => {
        if (rsvp.additionalGuests && Array.isArray(rsvp.additionalGuests)) {
          return total + rsvp.additionalGuests.length
        }
        return total
      }, 0)
    }

    // Get gallery stats
    if (existsSync(galleryFile)) {
      const galleryContent = await readFile(galleryFile, "utf-8")
      const gallery = JSON.parse(galleryContent)
      totalImages = gallery ? gallery.length : 0
    }

    return NextResponse.json({
      totalGuests,
      attendingGuests,
      notAttendingGuests,
      pendingGuests,
      additionalGuests,
      totalImages,
      rsvpResponses,
    })
  } catch (error) {
    console.error("Error fetching stats:", error)
    return NextResponse.json({
      totalGuests: 0,
      attendingGuests: 0,
      notAttendingGuests: 0,
      pendingGuests: 0,
      additionalGuests: 0,
      totalImages: 0,
      rsvpResponses: 0,
    })
  }
}
