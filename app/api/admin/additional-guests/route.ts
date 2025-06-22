import { readFile, writeFile, mkdir } from "fs/promises"
import { existsSync } from "fs"
import path from "path"
import { NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"

interface AdditionalGuest {
  id: string
  primaryGuestId: string
  name: string
  email?: string
  phone?: string
  rsvpStatus: "pending" | "attending" | "not-attending"
  createdAt: string
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const primaryGuestId = searchParams.get("primaryGuestId")

    const dataDir = path.join(process.cwd(), "data")
    const additionalGuestsFile = path.join(dataDir, "additional-guests.json")

    if (!existsSync(additionalGuestsFile)) {
      return NextResponse.json({ additionalGuests: [] })
    }

    const fileContent = await readFile(additionalGuestsFile, "utf-8")
    let additionalGuests = JSON.parse(fileContent)

    // Filter by primary guest if specified
    if (primaryGuestId) {
      additionalGuests = additionalGuests.filter((guest: AdditionalGuest) => guest.primaryGuestId === primaryGuestId)
    }

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

    const dataDir = path.join(process.cwd(), "data")
    if (!existsSync(dataDir)) {
      await mkdir(dataDir, { recursive: true })
    }

    const additionalGuestsFile = path.join(dataDir, "additional-guests.json")
    let additionalGuests: AdditionalGuest[] = []

    if (existsSync(additionalGuestsFile)) {
      const fileContent = await readFile(additionalGuestsFile, "utf-8")
      additionalGuests = JSON.parse(fileContent)
    }

    const newAdditionalGuest: AdditionalGuest = {
      id: uuidv4(),
      primaryGuestId,
      name,
      email: email || undefined,
      phone: phone || undefined,
      rsvpStatus: "pending",
      createdAt: new Date().toISOString(),
    }

    additionalGuests.push(newAdditionalGuest)
    await writeFile(additionalGuestsFile, JSON.stringify(additionalGuests, null, 2))

    return NextResponse.json({ success: true, additionalGuest: newAdditionalGuest })
  } catch (error) {
    console.error("Error adding additional guest:", error)
    return NextResponse.json({ error: "Failed to add additional guest" }, { status: 500 })
  }
}
