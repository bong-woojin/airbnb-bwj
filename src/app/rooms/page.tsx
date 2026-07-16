import PageHeader from "@/components/layout/PageHeader";
import ListingResults from "@/components/listing/ListingResults";
import { allRooms } from "@/data/rooms";
import { formatRangeLabel, parseYMD } from "@/lib/dates";
import { DEFAULT_PAGE_LIMIT, filterListings, paginate } from "@/lib/listings";

interface RoomsPageProps {
  searchParams: Promise<{ location?: string; checkin?: string; checkout?: string; guests?: string }>;
}

export default async function RoomsPage({ searchParams }: RoomsPageProps) {
  const { location, checkin, checkout, guests } = await searchParams;
  const guestCount = guests ? Number(guests) : 0;

  // 필터 로직은 /api/listings와 공유 (lib/listings.ts) — 어느 경로로 접근해도 같은 결과.
  // 첫 페이지만 서버에서 렌더링하고(빠른 첫 화면), 이후 페이지는 클라이언트가 API로 이어 붙인다.
  const filtered = filterListings(allRooms, { location, checkin, checkout, guests: guestCount });
  const firstPage = paginate(filtered, 1, DEFAULT_PAGE_LIMIT);

  // 압축 검색바에 표시할 검색 조건 요약
  const searchStart = parseYMD(checkin);
  const searchEnd = parseYMD(checkout);
  const searchLabels = {
    location: location ? `${location}의 숙소` : undefined,
    date: searchStart && searchEnd ? formatRangeLabel(searchStart, searchEnd) : undefined,
    guests: guestCount > 0 ? `게스트 ${guestCount}명` : undefined,
  };

  const title = location ? `${location}의 숙소 ${filtered.length}개` : `숙소 ${filtered.length}개`;

  // 검색 컨텍스트(날짜·인원)를 상세 페이지 링크까지 이어 붙인다 — 상세 예약카드 초기값으로 사용
  const detailQuery = new URLSearchParams();
  if (searchStart && searchEnd && checkin && checkout) {
    detailQuery.set("checkin", checkin);
    detailQuery.set("checkout", checkout);
  }
  if (guestCount > 0) detailQuery.set("guests", String(guestCount));

  // 무한 스크롤이 다음 페이지를 요청할 때 쓸 /api/listings 쿼리 — 현재 검색 조건과 동일하게
  const apiParams = new URLSearchParams({ type: "rooms" });
  if (location) apiParams.set("location", location);
  if (searchStart && searchEnd && checkin && checkout) {
    apiParams.set("checkin", checkin);
    apiParams.set("checkout", checkout);
  }
  if (guestCount > 0) apiParams.set("guests", String(guestCount));

  return (
    <PageHeader initialTab={0} searchLabels={searchLabels}>
      <ListingResults
        items={firstPage.items}
        title={title}
        basePath="/rooms"
        mapQuery={location ?? "대한민국"}
        mapZoom={location ? 12 : 7}
        linkQuery={detailQuery.toString() || undefined}
        fetchQuery={apiParams.toString()}
        hasMore={firstPage.hasMore}
      />
    </PageHeader>
  );
}
