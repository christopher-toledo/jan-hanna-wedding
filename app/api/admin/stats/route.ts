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

    let primaryGuests = 0
    let additionalGuestsCount = 0
    let attendingGuests = 0
    let notAttendingGuests = 0
    let pendingGuests = 0
    let additionalGuestsFromRSVP = 0
    let totalImages = 0
    let rsvpResponses = 0

    // Get primary guest stats
    if (existsSync(guestsFile)) {
      const guestsContent = await readFile(guestsFile, "utf-8")
      const guests = JSON.parse(guestsContent)

      primaryGuests = guests.length
      attendingGuests = guests.filter((g: any) => g.rsvpStatus === "attending").length
      notAttendingGuests = guests.filter((g: any) => g.rsvpStatus === "not-attending").length
      pendingGuests = guests.filter((g: any) => g.rsvpStatus === "pending").length
    }

    // Get additional guests count from additional-guests.json
    const additionalGuestsFile = path.join(dataDir, "additional-guests.json")
    if (existsSync(additionalGuestsFile)) {
      const additionalGuestsContent = await readFile(additionalGuestsFile, "utf-8")
      const additionalGuests = JSON.parse(additionalGuestsContent)
      additionalGuestsCount = additionalGuests.length

      // Add their RSVP statuses to the totals
      attendingGuests += additionalGuests.filter((g: any) => g.rsvpStatus === "attending").length
      notAttendingGuests += additionalGuests.filter((g: any) => g.rsvpStatus === "not-attending").length
      pendingGuests += additionalGuests.filter((g: any) => g.rsvpStatus === "pending").length
    }

    // Get RSVP stats for additional guests brought via RSVP form
    if (existsSync(rsvpsFile)) {
      const rsvpsContent = await readFile(rsvpsFile, "utf-8")
      const rsvps = JSON.parse(rsvpsContent)

      rsvpResponses = rsvps.length

      // Count additional guests from RSVP responses
      additionalGuestsFromRSVP = rsvps.reduce((total: number, rsvp: any) => {
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
      totalImages = gallery.length || 0
    }

    // Calculate total guests (primary + additional from admin + additional from RSVP)
    const totalGuests = primaryGuests + additionalGuestsCount + additionalGuestsFromRSVP

    return NextResponse.json({
      totalGuests,
      attendingGuests,
      notAttendingGuests,
      pendingGuests,
      additionalGuests: additionalGuestsFromRSVP, // Only RSVP additional guests for the card
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
