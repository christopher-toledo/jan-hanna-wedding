import { RSVPForm } from "@/components/rsvp-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { redirect } from "next/navigation";
import { getGuest } from "@/lib/db";

export interface RSVPPageProps {
  params: {
    guestId: string;
  };
}

export default async function RSVPPage({ params }: RSVPPageProps) {
  const { guestId } = await params;
  const guest = await getGuest(guestId);

  if (!guest) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-linen py-12 mt-12">
      <div className="container mx-auto px-6">
        <div className="max-w-2xl mx-auto">
          <Card className="elegant-shadow elegant-border relative overflow-hidden">
            {/* RSVP Background Image */}
            <div className="absolute inset-0 w-full h-full z-0">
              <img
                src="/images/rsvp-background.png"
                alt="RSVP background"
                className="object-cover w-full h-full opacity-100"
                draggable="false"
              />
            </div>
            <div className="relative z-10">
              <CardHeader className="text-center pb-6">
                <CardTitle className="font-cormorant text-6xl md:text-7xl text-slateBlue">
                  RSVP
                </CardTitle>
                <p
                  className="font-pinyon_script text-5xl md:text-6xl mt-2 mb-2"
                  style={{ color: "#3f3e3e" }}
                >
                  Hi {guest.name}!
                </p>
              </CardHeader>
              <CardContent className="px-8 pb-8">
                <RSVPForm guestId={guestId} guestName={guest.name} />
              </CardContent>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
