import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { guestId: string } }) {
  try {
    const _params = await(params)
    const guestId = _params.guestId
    const { searchParams } = new URL(request.url)
    const baseUrl = searchParams.get("baseUrl") || "http://localhost:3000"

    const rsvpUrl = `${baseUrl}/rsvp/${guestId}`

    // Generate QR code using a simple QR code API service
    const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(rsvpUrl)}`

    return NextResponse.json({
      qrCodeUrl: qrApiUrl,
      rsvpUrl: rsvpUrl,
    })
  } catch (error) {
    console.error("Error generating QR code:", error)
    return NextResponse.json({ error: "Failed to generate QR code" }, { status: 500 })
  }
}
