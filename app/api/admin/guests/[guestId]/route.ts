import { NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"
import { executeQuery, executeTransaction } from "@/lib/db"
import { type GuestRow, transformGuestRow } from "@/lib/types"

export async function DELETE(request: Request, { params }: { params: { guestId: string } }) {
  try {
    const _params = await params
    const guestId = _params.guestId

    // Check if guest exists
    const guestResult = await executeQuery<{ id: string }>("SELECT id FROM guests WHERE id = ?", [guestId])

    if (guestResult.rows.length === 0) {
      return NextResponse.json({ error: "Guest not found" }, { status: 404 })
    }

    // Delete guest (CASCADE will handle related records)
    await executeQuery("DELETE FROM guests WHERE id = ?", [guestId])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting guest:", error)
    return NextResponse.json({ error: "Failed to delete guest" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { guestId: string } }) {
  try {
    const _params = await params
    const guestId = _params.guestId
    const body = await request.json()
    const { name, email, phone, additionalGuests: newAdditionalGuests } = body

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 })
    }

    // Check if guest exists
    const guestResult = await executeQuery<{ id: string }>("SELECT id FROM guests WHERE id = ?", [guestId])

    if (guestResult.rows.length === 0) {
      return NextResponse.json({ error: "Guest not found" }, { status: 404 })
    }

    // Check if name is already used by another guest
    const existingGuest = await executeQuery<{ id: string }>(
      "SELECT id FROM guests WHERE LOWER(name) = LOWER(?) AND id != ?",
      [name, guestId],
    )

    if (existingGuest.rows.length > 0) {
      return NextResponse.json({ error: "A guest with this name already exists" }, { status: 400 })
    }

    const queries = []

    // Update guest
    queries.push({
      sql: "UPDATE guests SET name = ?, email = ?, phone = ? WHERE id = ?",
      args: [name, email || "", phone || "", guestId],
    })

    // Handle additional guests if provided
    if (newAdditionalGuests && newAdditionalGuests.length > 0) {
      for (const guest of newAdditionalGuests) {
        queries.push({
          sql: `INSERT INTO additional_guests (id, primary_guest_id, name, email, phone, rsvp_status, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?)`,
          args: [
            uuidv4(),
            guestId,
            guest.name,
            guest.email || "",
            guest.phone || "",
            "pending",
            new Date().toISOString(),
          ],
        })
      }
    }

    await executeTransaction(queries)

    // Get updated guest
    const updatedGuestResult = await executeQuery<GuestRow>(
      `SELECT id, name, email, phone, rsvp_status, 
              invitation_sent, created_at
       FROM guests WHERE id = ?`,
      [guestId],
    )

    const updatedGuest = updatedGuestResult.rows[0] ? transformGuestRow(updatedGuestResult.rows[0]) : null

    return NextResponse.json({ success: true, guest: updatedGuest })
  } catch (error) {
    console.error("Error updating guest:", error)
    return NextResponse.json({ error: "Failed to update guest" }, { status: 500 })
  }
}

export async function PATCH(request: Request, { params }: { params: { guestId: string } }) {
  try {
    const _params = await params
    const guestId = _params.guestId
    const body = await request.json()

    // Check if guest exists
    const guestResult = await executeQuery<{ id: string }>("SELECT id FROM guests WHERE id = ?", [guestId])

    if (guestResult.rows.length === 0) {
      return NextResponse.json({ error: "Guest not found" }, { status: 404 })
    }

    // Build dynamic update query based on provided fields
    const updateFields = []
    const updateValues = []

    for (const [key, value] of Object.entries(body)) {
      const dbKey = key === "rsvpStatus" ? "rsvp_status" : key === "invitationSent" ? "invitation_sent" : key
      updateFields.push(`${dbKey} = ?`)
      updateValues.push(value)
    }

    if (updateFields.length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 })
    }

    updateValues.push(guestId)

    await executeQuery(`UPDATE guests SET ${updateFields.join(", ")} WHERE id = ?`, updateValues)

    // Get updated guest
    const updatedGuestResult = await executeQuery<GuestRow>(
      `SELECT id, name, email, phone, rsvp_status, 
              invitation_sent, created_at
       FROM guests WHERE id = ?`,
      [guestId],
    )

    const updatedGuest = updatedGuestResult.rows[0] ? transformGuestRow(updatedGuestResult.rows[0]) : null

    return NextResponse.json({ success: true, guest: updatedGuest })
  } catch (error) {
    console.error("Error updating guest:", error)
    return NextResponse.json({ error: "Failed to update guest" }, { status: 500 })
  }
}
