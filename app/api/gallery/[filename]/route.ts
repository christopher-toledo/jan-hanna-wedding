import { type NextRequest, NextResponse } from "next/server"
import { readFile } from "fs/promises"
import { existsSync } from "fs"
import path from "path"

export async function GET(request: NextRequest, { params }: { params: { filename: string } }) {
  try {
    const _params = await(params)

    const filename = _params.filename
    const filePath = path.join(process.cwd(), "public", "uploads", "gallery", filename)

    if (!existsSync(filePath)) {
      return new NextResponse("Image not found", { status: 404 })
    }

    const fileBuffer = await readFile(filePath)
    const fileExtension = path.extname(filename).toLowerCase()

    let contentType = "image/jpeg"
    if (fileExtension === ".png") contentType = "image/png"
    if (fileExtension === ".gif") contentType = "image/gif"
    if (fileExtension === ".webp") contentType = "image/webp"

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000",
      },
    })
  } catch (error) {
    console.error("Error serving image:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
