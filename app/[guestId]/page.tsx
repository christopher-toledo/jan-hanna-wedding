import HomePage from "@/components/home-page";
import { getGuest } from "@/lib/db";
import { redirect } from "next/navigation";

interface HomePageProps {
  params: {
    guestId: string;
  };
}

export default async function GuestHomePage({ params }: HomePageProps) {
  const { guestId } = params;
  const guest = await getGuest(guestId);

  if (!guest) {
    redirect("/");
  }
  return <HomePage guestId={guestId} />;
}
