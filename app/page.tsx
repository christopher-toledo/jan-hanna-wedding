import HomePage from "@/components/home-page";

export default function Page(props: { searchParams?: { guestId?: string } }) {
  const guestId = props.searchParams?.guestId;
  return <HomePage guestId={guestId} />;
}
