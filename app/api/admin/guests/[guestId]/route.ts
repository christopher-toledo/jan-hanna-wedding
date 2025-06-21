import { readFile, writeFile } from "fs/promises"
import { existsSync } from "fs"
import path from "path"
import { NextResponse } from "next/server"

export async function DELETE(request: Request, { params }: { params: { guestId: string } }) {
  try {
    const guestId = params.guestId
    const dataDir = path.join(process.cwd(), "data")
    const guestsFile = path.join(dataDir, "guests.json")
    const rsvpsFile = path.join(dataDir, "rsvps.json")

    // Delete guest
    if (!existsSync(guestsFile)) {
      return NextResponse.json({ error: "No guests found" }, { status: 404 })
    }

    const guestsContent = await readFile(guestsFile, "utf-8")
    let guests = JSON.parse(guestsContent)

    const guestExists = guests.find((g: any) => g.id === guestId)
    if (!guestExists) {
      return NextResponse.json({ error: "Guest not found" }, { status: 404 })
    }

    guests = guests.filter((g: any) => g.id !== guestId)
    await writeFile(guestsFile, JSON.stringify(guests, null, 2))

    // Delete associated RSVP records
    if (existsSync(rsvpsFile)) {
      const rsvpsContent = await readFile(rsvpsFile, "utf-8")
      let rsvps = JSON.parse(rsvpsContent)

      rsvps = rsvps.filter((rsvp: any) => rsvp.guestId !== guestId)
      await writeFile(rsvpsFile, JSON.stringify(rsvps, null, 2))
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting guest:", error)
    return NextResponse.json({ error: "Failed to delete guest" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { guestId: string } }) {
  try {
    const guestId = params.guestId
    const body = await request.json()
    const { name, email, phone } = body

    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 })
    }

    const dataDir = path.join(process.cwd(), "data")
    const guestsFile = path.join(dataDir, "guests.json")

    if (!existsSync(guestsFile)) {
      return NextResponse.json({ error: "No guests found" }, { status: 404 })
    }

    const fileContent = await readFile(guestsFile, "utf-8")
    const guests = JSON.parse(fileContent)

    const guestIndex = guests.findIndex((g: any) => g.id === guestId)
    if (guestIndex === -1) {
      return NextResponse.json({ error: "Guest not found" }, { status: 404 })
    }

    // Check if email is already used by another guest
    const existingGuest = guests.find((g: any) => g.email.toLowerCase() === email.toLowerCase() && g.id !== guestId)
    if (existingGuest) {
      return NextResponse.json({ error: "A guest with this email already exists" }, { status: 400 })
    }

    // Update guest
    guests[guestIndex] = {
      ...guests[guestIndex],
      name,
      email,
      phone: phone || undefined,
    }

    await writeFile(guestsFile, JSON.stringify(guests, null, 2))

    return NextResponse.json({ success: true, guest: guests[guestIndex] })
  } catch (error) {
    console.error("Error updating guest:", error)
    return NextResponse.json({ error: "Failed to update guest" }, { status: 500 })
  }
}
