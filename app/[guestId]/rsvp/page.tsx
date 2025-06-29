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
  const { guestId } = params;
  const guest = await getGuest(guestId);

  if (!guest) {
    redirect("/");
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
              <CardTitle className="font-cormorant text-2xl md:text-3xl text-slateBlue">
                RSVP
              </CardTitle>
              <p
                className="font-pinyon_script text-3xl md:text-4xl mt-2 mb-2"
                style={{ color: "#3f3e3e" }}
              >
                Hi {guest.name}!
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
