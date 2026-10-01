import { notFound } from "next/navigation";
import PageHeader from "@/components/layout/PageHeader";
import ItemDetail from "@/components/detail/ItemDetail";
import { ROOM_OVERRIDES } from "@/components/detail/roomContent";
import { allRooms } from "@/data/rooms";

interface RoomDetailPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ checkin?: string; checkout?: string; guests?: string }>;
}

export default async function RoomDetailPage({ params, searchParams }: RoomDetailPageProps) {
  const { id } = await params;
  // 목록에서 넘어온 검색 컨텍스트 — 예약카드 초기값 (직접 진입 시엔 없음)
  const { checkin, checkout, guests } = await searchParams;
  const room = allRooms.find((item) => item.id === id);

  if (!room) {
    notFound();
  }

  const guestCount = guests ? Number(guests) : 0;
  const subtitle = ROOM_OVERRIDES[id]?.subtitle ?? `${room.location} · 침실4 · 욕실2 · 최대9인 · 한옥 숙소`;

  return (
    <PageHeader activeTab={0}>
      <ItemDetail
        item={room}
        backHref="/"
        backLabel="홈으로"
        categoryLabel="숙소"
        subtitle={subtitle}
        searchCheckin={checkin}
        searchCheckout={checkout}
        searchGuests={guestCount > 0 ? guestCount : undefined}
      />
    </PageHeader>
  );
}
