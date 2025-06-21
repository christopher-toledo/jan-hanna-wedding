"use server"

import { readFile, writeFile, mkdir } from "fs/promises"
import { existsSync } from "fs"
import path from "path"

interface RSVPData {
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
    const attending = formData.get("attending") as "yes" | "no"
    const additionalGuestsJson = formData.get("additionalGuests") as string
    const dietaryRestrictions = formData.get("dietaryRestrictions") as string
    const message = formData.get("message") as string

    if (!guestId || !guestName || !attending) {
      return { error: "Missing required fields" }
    }

    let additionalGuests = []
    try {
      additionalGuests = additionalGuestsJson ? JSON.parse(additionalGuestsJson) : []
    } catch (e) {
      additionalGuests = []
    }

    // Filter out empty guests
    additionalGuests = additionalGuests.filter((guest: any) => guest.name && guest.name.trim())

    const dataDir = path.join(process.cwd(), "data")
    if (!existsSync(dataDir)) {
      await mkdir(dataDir, { recursive: true })
    }

    // Read existing RSVPs
    const rsvpFile = path.join(dataDir, "rsvps.json")
    let rsvps: RSVPData[] = []

    if (existsSync(rsvpFile)) {
      const fileContent = await readFile(rsvpFile, "utf-8")
      rsvps = JSON.parse(fileContent)
    }

    // Check if RSVP already exists
    const existingIndex = rsvps.findIndex((rsvp) => rsvp.guestId === guestId)

    const rsvpData: RSVPData = {
      id: existingIndex >= 0 ? rsvps[existingIndex].id : Date.now().toString(),
      guestId,
      guestName,
      attending,
      additionalGuests,
      dietaryRestrictions: dietaryRestrictions || undefined,
      message: message || undefined,
      submittedAt: new Date().toISOString(),
    }

    if (existingIndex >= 0) {
      rsvps[existingIndex] = rsvpData
    } else {
      rsvps.push(rsvpData)
    }

    // Save RSVPs
    await writeFile(rsvpFile, JSON.stringify(rsvps, null, 2))

    // Update guest status
    const guestsFile = path.join(dataDir, "guests.json")
    if (existsSync(guestsFile)) {
      const guestsContent = await readFile(guestsFile, "utf-8")
      const guests = JSON.parse(guestsContent)

      const guestIndex = guests.findIndex((g: any) => g.id === guestId)
      if (guestIndex >= 0) {
        guests[guestIndex].rsvpStatus = attending === "yes" ? "attending" : "not-attending"
        await writeFile(guestsFile, JSON.stringify(guests, null, 2))
      }
    }

    return { success: true }
  } catch (error) {
    console.error("Error submitting RSVP:", error)
    return { error: "Failed to submit RSVP. Please try again." }
  }
}
