import { readFile, writeFile } from "fs/promises"
import { existsSync } from "fs"
import path from "path"
import { NextResponse } from "next/server"

export async function PUT(request: Request, { params }: { params: { guestId: string } }) {
  try {
    const guestId = params.guestId
    const { name, email, phone } = await request.json()

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 })
    }

    const dataDir = path.join(process.cwd(), "data")
    const additionalGuestsFile = path.join(dataDir, "additional-guests.json")

    if (!existsSync(additionalGuestsFile)) {
      return NextResponse.json({ error: "No additional guests found" }, { status: 404 })
    }

    const fileContent = await readFile(additionalGuestsFile, "utf-8")
    const additionalGuests = JSON.parse(fileContent)

    const guestIndex = additionalGuests.findIndex((g: any) => g.id === guestId)
    if (guestIndex === -1) {
      return NextResponse.json({ error: "Additional guest not found" }, { status: 404 })
    }

    additionalGuests[guestIndex] = {
      ...additionalGuests[guestIndex],
      name,
      email: email || undefined,
      phone: phone || undefined,
    }

    await writeFile(additionalGuestsFile, JSON.stringify(additionalGuests, null, 2))

    return NextResponse.json({ success: true, additionalGuest: additionalGuests[guestIndex] })
  } catch (error) {
    console.error("Error updating additional guest:", error)
    return NextResponse.json({ error: "Failed to update additional guest" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { guestId: string } }) {
  try {
    const guestId = params.guestId
    const dataDir = path.join(process.cwd(), "data")
    const additionalGuestsFile = path.join(dataDir, "additional-guests.json")

    if (!existsSync(additionalGuestsFile)) {
      return NextResponse.json({ error: "No additional guests found" }, { status: 404 })
    }

    const fileContent = await readFile(additionalGuestsFile, "utf-8")
    let additionalGuests = JSON.parse(fileContent)

    additionalGuests = additionalGuests.filter((g: any) => g.id !== guestId)
    await writeFile(additionalGuestsFile, JSON.stringify(additionalGuests, null, 2))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting additional guest:", error)
    return NextResponse.json({ error: "Failed to delete additional guest" }, { status: 500 })
  }
}
