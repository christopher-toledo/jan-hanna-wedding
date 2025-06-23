"use server"

import { v4 as uuidv4 } from "uuid"
import { executeTransaction } from "@/lib/db"

interface Guest {
  id: string
  name: string
  email: string
  phone?: string
  rsvpStatus: "pending" | "attending" | "not-attending"
  createdAt: string
}

interface AdditionalGuest {
  id: string
  primaryGuestId: string
  name: string
  email?: string
  phone?: string
  rsvpStatus: "pending" | "attending" | "not-attending"
  createdAt: string
}

interface RSVPResponse {
  id: string
  guestId: string
  guestName: string
  attending: "yes" | "no"
  additionalGuests: Array<{
    name: string
    email: string
  }>
  dietaryRestrictions?: string
  message?: string
  submittedAt: string
}

export async function submitRSVP(prevState: any, formData: FormData) {
  try {
    const guestId = formData.get("guestId") as string
    const guestName = formData.get("guestName") as string
    const attending = formData.get("attending") as string
    const primaryGuestEmail = formData.get("primaryGuestEmail") as string
    const primaryGuestPhone = formData.get("primaryGuestPhone") as string
    const selectedAdditionalGuests = JSON.parse((formData.get("selectedAdditionalGuests") as string) || "[]")
    const additionalGuestDetails = JSON.parse((formData.get("additionalGuestDetails") as string) || "[]")
    const dietaryRestrictions = formData.get("dietaryRestrictions") as string
    const message = formData.get("message") as string

    // Server-side validation
    if (!guestId || !guestName) {
      return { error: "Missing guest information" }
    }

    if (!attending) {
      return { error: "Please select whether you will be attending" }
    }

    // Only require phone if attending "yes"
    if (attending === "yes" && !primaryGuestPhone?.trim()) {
      return { error: "Phone number is required when attending" }
    }

    // Email is optional - only validate format if provided
    if (primaryGuestEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(primaryGuestEmail)) {
      return { error: "Please enter a valid email address" }
    }

    // Prepare transaction queries
    const queries = []

    // Update primary guest contact info and RSVP status
    queries.push({
      sql: `UPDATE guests 
            SET email = ?, phone = ?, rsvp_status = ? 
            WHERE id = ?`,
      args: [
        primaryGuestEmail || "",
        primaryGuestPhone || "",
        attending === "yes" ? "attending" : "not-attending",
        guestId,
      ],
    })

    // Update additional guests based on selection
    if (selectedAdditionalGuests.length > 0) {
      // First, set all additional guests for this primary guest to not-attending
      queries.push({
        sql: `UPDATE additional_guests 
              SET rsvp_status = 'not-attending' 
              WHERE primary_guest_id = ?`,
        args: [guestId],
      })

      // Then update selected ones to attending with their details
      for (const additionalGuestId of selectedAdditionalGuests) {
        const guestDetails = additionalGuestDetails.find((d: any) => d.id === additionalGuestId)
        queries.push({
          sql: `UPDATE additional_guests 
                SET rsvp_status = 'attending', email = ?, phone = ? 
                WHERE id = ? AND primary_guest_id = ?`,
          args: [guestDetails?.email || "", guestDetails?.phone || "", additionalGuestId, guestId],
        })
      }
    } else {
      // Set all additional guests to not-attending if none selected
      queries.push({
        sql: `UPDATE additional_guests 
              SET rsvp_status = 'not-attending' 
              WHERE primary_guest_id = ?`,
        args: [guestId],
      })
    }

    // Remove existing RSVP response for this guest
    queries.push({
      sql: "DELETE FROM rsvp_responses WHERE guest_id = ?",
      args: [guestId],
    })

    // Add new RSVP response
    const rsvpId = uuidv4()
    queries.push({
      sql: `INSERT INTO rsvp_responses (id, guest_id, guest_name, attending, dietary_restrictions, message, submitted_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
      args: [
        rsvpId,
        guestId,
        guestName,
        attending,
        attending === "yes" || selectedAdditionalGuests.length > 0 ? dietaryRestrictions || null : null,
        message || null,
        new Date().toISOString(),
      ],
    })

    // Add additional guests from RSVP response
    for (const guest of additionalGuestDetails) {
      if (guest.name) {
        queries.push({
          sql: `INSERT INTO rsvp_additional_guests (id, rsvp_response_id, name, email, created_at)
                VALUES (?, ?, ?, ?, ?)`,
          args: [uuidv4(), rsvpId, guest.name, guest.email || "", new Date().toISOString()],
        })
      }
    }

    // Execute all queries in a transaction
    await executeTransaction(queries)

    return { success: true, message: "RSVP submitted successfully!" }
  } catch (error) {
    console.error("Error submitting RSVP:", error)
    return { error: "Failed to submit RSVP. Please try again." }
  }
}
