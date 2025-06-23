import { NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"
import type { RSVPResponse } from "@/lib/types"

interface RSVPResponseDbRow {
  id: unknown
  guest_id: unknown
  guest_name: unknown
  attending: unknown
  dietary_restrictions: unknown
  message: unknown
  submitted_at: unknown
}

interface RSVPAdditionalGuestDbRow {
  name: unknown
  email: unknown
}

export async function GET() {
  try {
    // Get RSVP responses with additional guests
    const rsvpResult = await executeQuery<RSVPResponseDbRow>(
      `SELECT id, guest_id, guest_name, 
              attending, dietary_restrictions, 
              message, submitted_at
       FROM rsvp_responses
       ORDER BY submitted_at DESC`,
    )

    const rsvps: RSVPResponse[] = []

    for (const rsvpRow of rsvpResult.rows) {
      // Get additional guests for this RSVP
      const additionalGuestsResult = await executeQuery<RSVPAdditionalGuestDbRow>(
        `SELECT name, email 
         FROM rsvp_additional_guests 
         WHERE rsvp_response_id = ?
         ORDER BY created_at`,
        [rsvpRow.id],
      )

      // Create the complete RSVP response object
      const rsvp: RSVPResponse = {
        id: String(rsvpRow.id),
        guestId: String(rsvpRow.guest_id),
        guestName: String(rsvpRow.guest_name),
        attending: String(rsvpRow.attending) as "yes" | "no",
        dietaryRestrictions: rsvpRow.dietary_restrictions ? String(rsvpRow.dietary_restrictions) : undefined,
        message: rsvpRow.message ? String(rsvpRow.message) : undefined,
        submittedAt: String(rsvpRow.submitted_at),
        additionalGuests: additionalGuestsResult.rows.map((row) => ({
          name: String(row.name || ""),
          email: String(row.email || ""),
        })),
      }

      rsvps.push(rsvp)
    }

    return NextResponse.json({ rsvps })
  } catch (error) {
    console.error("Error fetching RSVPs:", error)
    return NextResponse.json({ error: "Failed to fetch RSVPs" }, { status: 500 })
  }
}
