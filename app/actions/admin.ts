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

export async function addGuest(prevState: any, formData: FormData) {
  try {
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const phone = formData.get("phone") as string

    if (!name || !email) {
      return { error: "Name and email are required" }
    }

    const dataDir = path.join(process.cwd(), "data")
    if (!existsSync(dataDir)) {
      await mkdir(dataDir, { recursive: true })
    }

    // Read existing guests
    const guestsFile = path.join(dataDir, "guests.json")
    let guests: Guest[] = []

    if (existsSync(guestsFile)) {
      const fileContent = await readFile(guestsFile, "utf-8")
      guests = JSON.parse(fileContent)
    }

    // Check if guest already exists
    const existingGuest = guests.find((g) => g.email.toLowerCase() === email.toLowerCase())
    if (existingGuest) {
      return { error: "A guest with this email already exists" }
    }

    // Create new guest
    const newGuest: Guest = {
      id: uuidv4(),
      name,
      email,
      phone: phone || undefined,
      rsvpStatus: "pending",
      createdAt: new Date().toISOString(),
    }

    guests.push(newGuest)

    // Save to file
    await writeFile(guestsFile, JSON.stringify(guests, null, 2))

    return { success: true, message: "Guest added successfully!" }
  } catch (error) {
    console.error("Error adding guest:", error)
    return { error: "Failed to add guest. Please try again." }
  }
}

export async function updateGuest(prevState: any, formData: FormData) {
  try {
    const guestId = formData.get("guestId") as string
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const phone = formData.get("phone") as string

    if (!guestId || !name || !email) {
      return { error: "Guest ID, name and email are required" }
    }

    const dataDir = path.join(process.cwd(), "data")
    const guestsFile = path.join(dataDir, "guests.json")

    if (!existsSync(guestsFile)) {
      return { error: "No guests found" }
    }

    const fileContent = await readFile(guestsFile, "utf-8")
    const guests: Guest[] = JSON.parse(fileContent)

    const guestIndex = guests.findIndex((g) => g.id === guestId)
    if (guestIndex === -1) {
      return { error: "Guest not found" }
    }

    // Update guest
    guests[guestIndex] = {
      ...guests[guestIndex],
      name,
      email,
      phone: phone || undefined,
    }

    // Save to file
    await writeFile(guestsFile, JSON.stringify(guests, null, 2))

    return { success: true, message: "Guest updated successfully!" }
  } catch (error) {
    console.error("Error updating guest:", error)
    return { error: "Failed to update guest. Please try again." }
  }
}

export async function deleteGuest(guestId: string) {
  try {
    const dataDir = path.join(process.cwd(), "data")
    const guestsFile = path.join(dataDir, "guests.json")

    if (!existsSync(guestsFile)) {
      throw new Error("No guests found")
    }

    const fileContent = await readFile(guestsFile, "utf-8")
    let guests: Guest[] = JSON.parse(fileContent)

    guests = guests.filter((g) => g.id !== guestId)

    // Save to file
    await writeFile(guestsFile, JSON.stringify(guests, null, 2))

    return { success: true }
  } catch (error) {
    console.error("Error deleting guest:", error)
    throw error
  }
}
