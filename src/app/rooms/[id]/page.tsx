import { notFound } from "next/navigation";
import PageHeader from "@/components/layout/PageHeader";
import ItemDetail from "@/components/detail/ItemDetail";
import { allRooms } from "@/data/rooms";

interface RoomDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function RoomDetailPage({ params }: RoomDetailPageProps) {
  const { id } = await params;
  const room = allRooms.find((item) => item.id === id);

  if (!room) {
    notFound();
  }

  const subtitle = `${room.location} · 침실4 · 욕실2 · 최대9인 · 한옥 숙소`;

  return (
    <PageHeader initialTab={0}>
      <ItemDetail item={room} backHref="/" backLabel="홈으로" categoryLabel="숙소" subtitle={subtitle} />
    </PageHeader>
  );
}
