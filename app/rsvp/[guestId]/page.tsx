import { RSVPForm } from "@/components/rsvp-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { notFound } from "next/navigation";
import { readFile } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

// Remove the mock guests object and replace with dynamic lookup
async function getGuest(guestId: string) {
  try {
    const dataDir = path.join(process.cwd(), "data");
    const guestsFile = path.join(dataDir, "guests.json");

    if (!existsSync(guestsFile)) {
      return null;
    }

    const fileContent = await readFile(guestsFile, "utf-8");
    const guests = JSON.parse(fileContent);

    return guests.find((guest: any) => guest.id === guestId) || null;
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
