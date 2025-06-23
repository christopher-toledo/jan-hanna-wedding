import { NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"
import { executeQuery, executeTransaction } from "@/lib/db"
import { type GuestRow, transformGuestRow } from "@/lib/types"

export async function GET() {
  try {
    const result = await executeQuery<GuestRow>(
      `SELECT id, name, email, phone, rsvp_status, 
              invitation_sent, created_at
       FROM guests 
       ORDER BY created_at DESC`,
    )

    const guests = result.rows.map(transformGuestRow)

    return NextResponse.json({ guests })
  } catch (error) {
    console.error("Error fetching guests:", error)
    return NextResponse.json({ error: "Failed to fetch guests" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { name, email, phone, additionalGuests } = await request.json()

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 })
    }

    // Check if guest already exists
    const existingGuest = await executeQuery<{ id: string }>("SELECT id FROM guests WHERE LOWER(name) = LOWER(?)", [
      name,
    ])

    if (existingGuest.rows.length > 0) {
      return NextResponse.json({ error: "A guest with this name already exists" }, { status: 400 })
    }

    // Create new guest
    const newGuest = {
      id: uuidv4(),
      name,
      email: email || "",
      phone: phone || "",
      rsvpStatus: "pending" as const,
      invitationSent: false,
      createdAt: new Date().toISOString(),
    }

    const queries = []

    // Add primary guest
    queries.push({
      sql: `INSERT INTO guests (id, name, email, phone, rsvp_status, invitation_sent, created_at) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
      args: [
        newGuest.id,
        newGuest.name,
        newGuest.email,
        newGuest.phone,
        newGuest.rsvpStatus,
        newGuest.invitationSent,
        newGuest.createdAt,
      ],
    })

    // Add additional guests if provided
    if (additionalGuests && additionalGuests.length > 0) {
      for (const guest of additionalGuests) {
        queries.push({
          sql: `INSERT INTO additional_guests (id, primary_guest_id, name, email, phone, rsvp_status, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?)`,
          args: [
            uuidv4(),
            newGuest.id,
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

    return NextResponse.json({ success: true, guest: newGuest })
  } catch (error) {
    console.error("Error adding guest:", error)
    return NextResponse.json({ error: "Failed to add guest" }, { status: 500 })
  }
}
