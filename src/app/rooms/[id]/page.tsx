import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageHeader from "@/components/layout/PageHeader";
import ItemDetail from "@/components/detail/ItemDetail";
import { ROOM_OVERRIDES } from "@/components/detail/roomContent";
import { allRooms } from "@/data/rooms";
import { buildDetailMeta, toMetadata } from "@/lib/listingMeta";

interface RoomDetailPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ checkin?: string; checkout?: string; guests?: string }>;
}

// 없는 id면 null — 메타데이터와 페이지 양쪽에서 notFound()로 404를 띄운다
function findRoom(id: string) {
  return allRooms.find((item) => item.id === id) ?? null;
}

export async function generateMetadata({ params }: RoomDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const room = findRoom(id);
  if (!room) notFound();
  // 숙소 데이터엔 이름이 없어서, 상세 오버라이드가 있으면 부제목 첫 토막("해운대 오션뷰")을 이름으로 쓴다
  const name = ROOM_OVERRIDES[id]?.subtitle.split(" · ")[0];
  const { title, description } = buildDetailMeta({ item: room, kind: "rooms", name });
  return toMetadata(title, description, room.image, room.location);
}

export default async function RoomDetailPage({ params, searchParams }: RoomDetailPageProps) {
  const { id } = await params;
  // 목록에서 넘어온 검색 컨텍스트 — 예약카드 초기값 (직접 진입 시엔 없음)
  const { checkin, checkout, guests } = await searchParams;
  const room = findRoom(id);

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
