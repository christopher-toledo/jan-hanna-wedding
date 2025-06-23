"use server"

import { v4 as uuidv4 } from "uuid"
import { executeQuery } from "@/lib/db"

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

    if (!name) {
      return { error: "Name is required" }
    }

    // Check if guest already exists
    const existingGuest = await executeQuery("SELECT id FROM guests WHERE LOWER(name) = LOWER(?)", [name])

    if (existingGuest.rows.length > 0) {
      return { error: "A guest with this name already exists" }
    }

    // Create new guest
    const newGuest = {
      id: uuidv4(),
      name,
      email: email || "",
      phone: phone || "",
      rsvpStatus: "pending",
      createdAt: new Date().toISOString(),
    }

    await executeQuery(
      `INSERT INTO guests (id, name, email, phone, rsvp_status, invitation_sent, created_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [newGuest.id, newGuest.name, newGuest.email, newGuest.phone, newGuest.rsvpStatus, false, newGuest.createdAt],
    )

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

    // Check if guest exists
    const existingGuest = await executeQuery("SELECT id FROM guests WHERE id = ?", [guestId])

    if (existingGuest.rows.length === 0) {
      return { error: "Guest not found" }
    }

    // Update guest
    await executeQuery(
      `UPDATE guests 
       SET name = ?, email = ?, phone = ? 
       WHERE id = ?`,
      [name, email, phone || "", guestId],
    )

    return { success: true, message: "Guest updated successfully!" }
  } catch (error) {
    console.error("Error updating guest:", error)
    return { error: "Failed to update guest. Please try again." }
  }
}

export async function deleteGuest(guestId: string) {
  try {
    // Delete guest (CASCADE will handle related records)
    const result = await executeQuery("DELETE FROM guests WHERE id = ?", [guestId])

    if (result.rowsAffected === 0) {
      throw new Error("Guest not found")
    }

    return { success: true }
  } catch (error) {
    console.error("Error deleting guest:", error)
    throw error
  }
}
