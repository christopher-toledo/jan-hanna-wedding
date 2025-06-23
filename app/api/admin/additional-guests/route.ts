import { NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"
import { executeQuery } from "@/lib/db"
import { type AdditionalGuestRow, transformAdditionalGuestRow } from "@/lib/types"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const primaryGuestId = searchParams.get("primaryGuestId")

    let query = `SELECT id, primary_guest_id, name, email, phone, 
                        rsvp_status, created_at
                 FROM additional_guests`
    const params: any[] = []

    // Filter by primary guest if specified
    if (primaryGuestId) {
      query += " WHERE primary_guest_id = ?"
      params.push(primaryGuestId)
    }

    query += " ORDER BY created_at DESC"

    const result = await executeQuery<AdditionalGuestRow>(query, params)
    const additionalGuests = result.rows.map(transformAdditionalGuestRow)

    return NextResponse.json({ additionalGuests })
  } catch (error) {
    console.error("Error fetching additional guests:", error)
    return NextResponse.json({ error: "Failed to fetch additional guests" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { primaryGuestId, name, email, phone } = await request.json()

    if (!primaryGuestId || !name) {
      return NextResponse.json({ error: "Primary guest ID and name are required" }, { status: 400 })
    }

    // Check if primary guest exists
    const primaryGuestResult = await executeQuery<{ id: string }>("SELECT id FROM guests WHERE id = ?", [
      primaryGuestId,
    ])

    if (primaryGuestResult.rows.length === 0) {
      return NextResponse.json({ error: "Primary guest not found" }, { status: 400 })
    }

    const newAdditionalGuest = {
      id: uuidv4(),
      primaryGuestId,
      name,
      email: email || "",
      phone: phone || "",
      rsvpStatus: "pending" as const,
      createdAt: new Date().toISOString(),
    }

    await executeQuery(
      `INSERT INTO additional_guests (id, primary_guest_id, name, email, phone, rsvp_status, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        newAdditionalGuest.id,
        newAdditionalGuest.primaryGuestId,
        newAdditionalGuest.name,
        newAdditionalGuest.email,
        newAdditionalGuest.phone,
        newAdditionalGuest.rsvpStatus,
        newAdditionalGuest.createdAt,
      ],
    )

    return NextResponse.json({ success: true, additionalGuest: newAdditionalGuest })
  } catch (error) {
    console.error("Error adding additional guest:", error)
    return NextResponse.json({ error: "Failed to add additional guest" }, { status: 500 })
  }
}
