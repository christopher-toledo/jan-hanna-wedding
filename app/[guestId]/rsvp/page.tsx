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
            <img
              src="/images/rsvp-background.png"
              alt="RSVP background"
              className="absolute inset-0 object-cover z-0 pointer-events-none select-none"
              style={{ minHeight: 600, height: "100%", maxHeight: "none" }}
              draggable="false"
            />
            {/* <img
              src="/images/rsvp-background-2.png"
              alt="RSVP header background"
              className="absolute left-0 right-0 top-0 w-full object-cover z-0 pointer-events-none select-none"
              style={{ width: "100%", height: "50%" }}
              draggable="false"
            /> */}
            <div className="relative z-10">
              <CardHeader className="text-center pb-6 relative">
                {/* <img
                  src="/images/rsvp-header.png"
                  alt="RSVP header background"
                  className="absolute left-0 right-0 top-0 w-full h-full object-cover z-0 pointer-events-none select-none"
                  style={{ width: "100%", height: "100%" }}
                  draggable="false"
                /> */}
                <div className="relative z-10">
                  <CardTitle className="font-cormorant font-normal text-7xl md:text-8xl text-slateBlue mb-8">
                    RSVP
                  </CardTitle>
                  <p
                    className="font-westonia text-6xl md:text-7xl my-2"
                    style={{ color: "#3f3e3e" }}
                  >
                    Hi {guest.name}!
                  </p>
                </div>
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
