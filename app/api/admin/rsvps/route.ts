import { NextResponse } from "next/server"
import { readFile } from "fs/promises"
import { existsSync } from "fs"
import path from "path"

export async function GET() {
  try {
    const dataDir = path.join(process.cwd(), "data")
    const rsvpFile = path.join(dataDir, "rsvps.json")

    if (!existsSync(rsvpFile)) {
      return NextResponse.json({ rsvps: [] })
    }

    const fileContent = await readFile(rsvpFile, "utf-8")
    const rsvps = JSON.parse(fileContent)

    return NextResponse.json({ rsvps })
  } catch (error) {
    console.error("Error fetching RSVPs:", error)
    return NextResponse.json({ error: "Failed to fetch RSVPs" }, { status: 500 })
  }
}
