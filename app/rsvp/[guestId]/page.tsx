import RSVPPage, { RSVPPageProps } from "@/app/[guestId]/rsvp/page";
import { getGuest } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function GuestRSVP({ params }: RSVPPageProps) {
  const { guestId } = await params;
  const guest = await getGuest(guestId);

  if (!guest) {
    redirect("/");
  }
  return <RSVPPage params={params} />;
}
