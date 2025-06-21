import { readFile, writeFile, mkdir } from "fs/promises"
import { existsSync } from "fs"
import path from "path"
import { NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"

interface Guest {
  id: string
  name: string
  email: string
  phone?: string
  rsvpStatus: "pending" | "attending" | "not-attending"
  createdAt: string
}

export async function GET() {
  try {
    const dataDir = path.join(process.cwd(), "data")
    const guestsFile = path.join(dataDir, "guests.json")

    if (!existsSync(guestsFile)) {
      return NextResponse.json({ guests: [] })
    }

    const fileContent = await readFile(guestsFile, "utf-8")
    const guests = JSON.parse(fileContent)

    // Sort by creation date, newest first
    guests.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    return NextResponse.json({ guests })
  } catch (error) {
    console.error("Error fetching guests:", error)
    return NextResponse.json({ error: "Failed to fetch guests" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { name, email, phone } = await request.json()

    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 })
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
      return NextResponse.json({ error: "A guest with this email already exists" }, { status: 400 })
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

    return NextResponse.json({ success: true, guest: newGuest })
  } catch (error) {
    console.error("Error adding guest:", error)
    return NextResponse.json({ error: "Failed to add guest "+error }, { status: 500 })
  }
}
