import { NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"

interface CountResult {
  count: number
}

interface RSVPStatsResult {
  attending: number
  not_attending: number
  pending: number
}

export async function GET() {
  try {
    // Get primary guest stats
    const primaryGuestsResult = await executeQuery<CountResult>("SELECT COUNT(*) as count FROM guests")
    const primaryGuests = primaryGuestsResult.rows[0]?.count || 0

    // Get primary guest RSVP stats
    const primaryRSVPResult = await executeQuery<RSVPStatsResult>(
      `SELECT 
         SUM(CASE WHEN rsvp_status = 'attending' THEN 1 ELSE 0 END) as attending,
         SUM(CASE WHEN rsvp_status = 'not-attending' THEN 1 ELSE 0 END) as not_attending,
         SUM(CASE WHEN rsvp_status = 'pending' THEN 1 ELSE 0 END) as pending
       FROM guests`,
    )
    const primaryRSVP = primaryRSVPResult.rows[0] || { attending: 0, not_attending: 0, pending: 0 }

    // Get additional guest stats
    const additionalGuestsResult = await executeQuery<CountResult>("SELECT COUNT(*) as count FROM additional_guests")
    const additionalGuestsCount = additionalGuestsResult.rows[0]?.count || 0

    // Get additional guest RSVP stats
    const additionalRSVPResult = await executeQuery<RSVPStatsResult>(
      `SELECT 
         SUM(CASE WHEN rsvp_status = 'attending' THEN 1 ELSE 0 END) as attending,
         SUM(CASE WHEN rsvp_status = 'not-attending' THEN 1 ELSE 0 END) as not_attending,
         SUM(CASE WHEN rsvp_status = 'pending' THEN 1 ELSE 0 END) as pending
       FROM additional_guests`,
    )
    const additionalRSVP = additionalRSVPResult.rows[0] || { attending: 0, not_attending: 0, pending: 0 }

    // Get RSVP responses count
    const rsvpResponsesResult = await executeQuery<CountResult>("SELECT COUNT(*) as count FROM rsvp_responses")
    const rsvpResponses = rsvpResponsesResult.rows[0]?.count || 0

    // Get additional guests from RSVP responses
    const rsvpAdditionalGuestsResult = await executeQuery<CountResult>(
      "SELECT COUNT(*) as count FROM rsvp_additional_guests",
    )
    const additionalGuestsFromRSVP = rsvpAdditionalGuestsResult.rows[0]?.count || 0

    // Get gallery stats
    const galleryResult = await executeQuery<CountResult>("SELECT COUNT(*) as count FROM gallery_images")
    const totalImages = galleryResult.rows[0]?.count || 0

    // Calculate totals
    const totalGuests = Number(primaryGuests) + Number(additionalGuestsCount)
    const attendingGuests = Number(primaryRSVP.attending) + Number(additionalRSVP.attending)
    const notAttendingGuests = Number(primaryRSVP.not_attending) + Number(additionalRSVP.not_attending)
    const pendingGuests = Number(primaryRSVP.pending) + Number(additionalRSVP.pending)

    return NextResponse.json({
      totalGuests,
      attendingGuests,
      notAttendingGuests,
      pendingGuests,
      additionalGuests: Number(additionalGuestsFromRSVP), // Only RSVP additional guests for the card
      totalImages: Number(totalImages),
      rsvpResponses: Number(rsvpResponses),
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
