import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 to-pink-50">
      <div className="text-center space-y-6 px-4">
        <Heart className="h-16 w-16 text-rose-500 mx-auto" />
        <h1 className="text-4xl font-light text-gray-800">Page Not Found</h1>
        <p className="text-lg text-gray-600">The page you're looking for doesn't exist or the RSVP link is invalid.</p>
        <Button asChild className="bg-rose-500 hover:bg-rose-600">
          <Link href="/">Return Home</Link>
        </Button>
      </div>
    </div>
  )
}
