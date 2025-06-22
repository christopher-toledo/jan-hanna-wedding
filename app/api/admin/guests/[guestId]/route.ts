import { readFile, writeFile } from "fs/promises"
import { existsSync } from "fs"
import path from "path"
import { NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"

export async function DELETE(request: Request, { params }: { params: { guestId: string } }) {
  try {
    const guestId = params.guestId
    const dataDir = path.join(process.cwd(), "data")
    const guestsFile = path.join(dataDir, "guests.json")
    const rsvpsFile = path.join(dataDir, "rsvps.json")
    const additionalGuestsFile = path.join(dataDir, "additional-guests.json")

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

    // Delete associated additional guests
    if (existsSync(additionalGuestsFile)) {
      const additionalGuestsContent = await readFile(additionalGuestsFile, "utf-8")
      let additionalGuests = JSON.parse(additionalGuestsContent)

      additionalGuests = additionalGuests.filter((guest: any) => guest.primaryGuestId !== guestId)
      await writeFile(additionalGuestsFile, JSON.stringify(additionalGuests, null, 2))
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
    const { name, email, phone, additionalGuests: newAdditionalGuests } = body

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 })
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
    const existingGuest = guests.find((g: any) => g.name.toLowerCase() === name.toLowerCase() && g.id !== guestId)
    if (existingGuest) {
      return NextResponse.json({ error: "A guest with this name already exists" }, { status: 400 })
    }

    // Update guest
    guests[guestIndex] = {
      ...guests[guestIndex],
      name,
      email,
      phone: phone || undefined,
    }

    await writeFile(guestsFile, JSON.stringify(guests, null, 2))

    // Handle additional guests if provided
    if (newAdditionalGuests && newAdditionalGuests.length > 0) {
      const additionalGuestsFile = path.join(dataDir, "additional-guests.json")
      let existingAdditionalGuests: any[] = []

      if (existsSync(additionalGuestsFile)) {
        const additionalFileContent = await readFile(additionalGuestsFile, "utf-8")
        existingAdditionalGuests = JSON.parse(additionalFileContent)
      }

      // Add new additional guests
      const additionalGuestRecords = newAdditionalGuests.map((guest: any) => ({
        id: uuidv4(),
        primaryGuestId: guestId,
        name: guest.name,
        email: guest.email || undefined,
        phone: guest.phone || undefined,
        rsvpStatus: "pending",
        createdAt: new Date().toISOString(),
      }))

      existingAdditionalGuests.push(...additionalGuestRecords)
      await writeFile(additionalGuestsFile, JSON.stringify(existingAdditionalGuests, null, 2))
    }

    return NextResponse.json({ success: true, guest: guests[guestIndex] })
  } catch (error) {
    console.error("Error updating guest:", error)
    return NextResponse.json({ error: "Failed to update guest" }, { status: 500 })
  }
}

export async function PATCH(request: Request, { params }: { params: { guestId: string } }) {
  try {
    const guestId = params.guestId
    const body = await request.json()

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

    // Update only the provided fields
    guests[guestIndex] = {
      ...guests[guestIndex],
      ...body,
    }

    await writeFile(guestsFile, JSON.stringify(guests, null, 2))

    return NextResponse.json({ success: true, guest: guests[guestIndex] })
  } catch (error) {
    console.error("Error updating guest:", error)
    return NextResponse.json({ error: "Failed to update guest" }, { status: 500 })
  }
}
