import HomePage from "@/components/home-page";

interface HomePageProps {
  params: {
    guestId: string;
  };
}

export default async function Page({ params }: HomePageProps) {
  const { guestId } = await params;
  return <HomePage guestId={guestId} />;
}
