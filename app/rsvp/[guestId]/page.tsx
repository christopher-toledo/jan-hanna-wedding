import { RSVPForm } from "@/components/rsvp-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { notFound } from "next/navigation";
import { executeQuery } from "@/lib/db";

interface GuestResult {
  id: string;
  name: string;
  email: string;
  phone: string;
}

// Get guest from database
async function getGuest(guestId: string) {
  try {
    const result = await executeQuery<GuestResult>(
      "SELECT id, name, email, phone FROM guests WHERE id = ?",
      [guestId]
    );

    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    console.error("Error fetching guest:", error);
    return null;
  }
}

interface RSVPPageProps {
  params: {
    guestId: string;
  };
}

export default async function RSVPPage({ params }: RSVPPageProps) {
  const { guestId } = await params;
  const guest = await getGuest(guestId);

  if (!guest) {
    notFound();
  }

  return (
    <div className="min-h-screen elegant-gradient py-12 mt-12">
      <div className="container mx-auto px-6">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="font-serif text-5xl text-primary mb-4">RSVP</h1>
            <p className="text-lg text-muted-foreground">
              We can't wait to celebrate with you!
            </p>
            <div className="w-24 h-px bg-primary/30 mx-auto mt-4"></div>
          </div>

          <Card className="elegant-shadow elegant-border">
            <CardHeader className="text-center pb-6">
              <CardTitle className="font-serif text-2xl text-primary">
                Hello, {guest.name}!
              </CardTitle>
              <p className="text-muted-foreground">
                Please let us know if you'll be joining us
              </p>
            </CardHeader>
            <CardContent className="px-8 pb-8">
              <RSVPForm guestId={guestId} guestName={guest.name} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
