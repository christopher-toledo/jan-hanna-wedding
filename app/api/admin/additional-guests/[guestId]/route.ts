import { NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"
import { type AdditionalGuestRow, transformAdditionalGuestRow } from "@/lib/types"

export async function PUT(request: Request, { params }: { params: { guestId: string } }) {
  try {
    const _params = await params
    const guestId = _params.guestId
    const { name, email, phone } = await request.json()

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 })
    }

    // Update additional guest
    const result = await executeQuery(
      `UPDATE additional_guests 
       SET name = ?, email = ?, phone = ? 
       WHERE id = ?`,
      [name, email || "", phone || "", guestId],
    )

    if (result.rowsAffected === 0) {
      return NextResponse.json({ error: "Additional guest not found" }, { status: 404 })
    }

    // Get updated guest
    const updatedGuestResult = await executeQuery<AdditionalGuestRow>(
      `SELECT id, primary_guest_id, name, email, phone, 
              rsvp_status, created_at
       FROM additional_guests WHERE id = ?`,
      [guestId],
    )

    const additionalGuest = updatedGuestResult.rows[0] ? transformAdditionalGuestRow(updatedGuestResult.rows[0]) : null

    return NextResponse.json({ success: true, additionalGuest })
  } catch (error) {
    console.error("Error updating additional guest:", error)
    return NextResponse.json({ error: "Failed to update additional guest" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { guestId: string } }) {
  try {
    const _params = await params
    const guestId = _params.guestId

    const result = await executeQuery("DELETE FROM additional_guests WHERE id = ?", [guestId])

    if (result.rowsAffected === 0) {
      return NextResponse.json({ error: "Additional guest not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting additional guest:", error)
    return NextResponse.json({ error: "Failed to delete additional guest" }, { status: 500 })
  }
}
