import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageHeader from "@/components/layout/PageHeader";
import ItemDetail from "@/components/detail/ItemDetail";
import { ROOM_OVERRIDES } from "@/components/detail/roomContent";
import { allRooms } from "@/data/rooms";
import { buildDetailMeta, toMetadata } from "@/lib/listingMeta";
import { pickGalleryImages } from "@/lib/gallery";
import { roomSubtitle } from "@/lib/roomSpecs";

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
  // 부제목의 인원·규모는 maxGuests에서 만든다 — 예약카드 상한·서버 검증과 같은 숫자
  const subtitle =
    ROOM_OVERRIDES[id]?.subtitle ?? (room.maxGuests ? roomSubtitle(room.location, room.maxGuests) : room.location);
  const galleryImages = pickGalleryImages(room.image, allRooms.map((r) => r.image), room.id);

  return (
    <PageHeader activeTab={0} mobileLayout="detail">
      <ItemDetail
        item={room}
        backHref="/"
        backLabel="홈으로"
        categoryLabel="숙소"
        subtitle={subtitle}
        searchCheckin={checkin}
        searchCheckout={checkout}
        searchGuests={guestCount > 0 ? guestCount : undefined}
        galleryImages={galleryImages}
      />
    </PageHeader>
  );
}
