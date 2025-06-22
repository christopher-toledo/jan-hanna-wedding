"use server"

import { writeFile, readFile, mkdir } from "fs/promises"
import { existsSync } from "fs"
import path from "path"
import { v4 as uuidv4 } from "uuid"

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

    const dataDir = path.join(process.cwd(), "data")
    if (!existsSync(dataDir)) {
      await mkdir(dataDir, { recursive: true })
    }

    // Update primary guest contact info
    const guestsFile = path.join(dataDir, "guests.json")
    if (existsSync(guestsFile)) {
      const guestsContent = await readFile(guestsFile, "utf-8")
      const guests: Guest[] = JSON.parse(guestsContent)

      const guestIndex = guests.findIndex((g) => g.id === guestId)
      if (guestIndex !== -1) {
        guests[guestIndex] = {
          ...guests[guestIndex],
          email: primaryGuestEmail || "", // Allow empty email
          phone: primaryGuestPhone || "", // Allow empty phone for non-attending
          rsvpStatus: attending === "yes" ? "attending" : "not-attending",
        }
        await writeFile(guestsFile, JSON.stringify(guests, null, 2))
      }
    }

    // Update additional guests - they can attend independently of primary guest
    const additionalGuestsFile = path.join(dataDir, "additional-guests.json")
    if (existsSync(additionalGuestsFile)) {
      const additionalContent = await readFile(additionalGuestsFile, "utf-8")
      const additionalGuests: AdditionalGuest[] = JSON.parse(additionalContent)

      // Update all additional guests for this primary guest based on selection
      const updatedAdditionalGuests = additionalGuests.map((guest) => {
        if (guest.primaryGuestId === guestId) {
          const isSelected = selectedAdditionalGuests.includes(guest.id)
          const guestDetails = additionalGuestDetails.find((d: any) => d.id === guest.id)

          return {
            ...guest,
            rsvpStatus: isSelected ? "attending" : "not-attending",
            email: guestDetails?.email || guest.email || "",
            phone: guestDetails?.phone || guest.phone || "",
          }
        }
        return guest
      })

      await writeFile(additionalGuestsFile, JSON.stringify(updatedAdditionalGuests, null, 2))
    }

    // Save RSVP response
    const rsvpsFile = path.join(dataDir, "rsvps.json")
    let rsvps: RSVPResponse[] = []

    if (existsSync(rsvpsFile)) {
      const rsvpsContent = await readFile(rsvpsFile, "utf-8")
      rsvps = JSON.parse(rsvpsContent)
    }

    // Remove existing RSVP for this guest if it exists
    rsvps = rsvps.filter((rsvp) => rsvp.guestId !== guestId)

    // Add new RSVP - include additional guest details regardless of primary attendance
    const newRSVP: RSVPResponse = {
      id: uuidv4(),
      guestId,
      guestName,
      attending: attending as "yes" | "no",
      additionalGuests: additionalGuestDetails.map((guest: any) => ({
        name: guest.name || "",
        email: guest.email || "",
      })),
      dietaryRestrictions:
        attending === "yes" || selectedAdditionalGuests.length > 0 ? dietaryRestrictions || undefined : undefined,
      message: message || undefined,
      submittedAt: new Date().toISOString(),
    }

    rsvps.push(newRSVP)
    await writeFile(rsvpsFile, JSON.stringify(rsvps, null, 2))

    return { success: true, message: "RSVP submitted successfully!" }
  } catch (error) {
    console.error("Error submitting RSVP:", error)
    return { error: "Failed to submit RSVP. Please try again." }
  }
}
