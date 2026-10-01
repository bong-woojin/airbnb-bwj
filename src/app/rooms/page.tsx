import type { Metadata } from "next";
import PageHeader from "@/components/layout/PageHeader";
import ListingResults from "@/components/listing/ListingResults";
import { allRooms } from "@/data/rooms";
import { formatRangeLabel, parseYMD } from "@/lib/dates";
import { DEFAULT_PAGE_LIMIT, filterListings, paginate } from "@/lib/listings";
import { toMetadata } from "@/lib/listingMeta";

interface RoomsPageProps {
  searchParams: Promise<{ location?: string; checkin?: string; checkout?: string; guests?: string }>;
}

type RoomsSearchParams = Awaited<RoomsPageProps["searchParams"]>;

// 검색 조건 해석 + 필터링 — 페이지와 generateMetadata가 같은 결과(개수·요약)를 쓰도록 한 곳에서.
// 필터 로직은 /api/listings와 공유 (lib/listings.ts) — 어느 경로로 접근해도 같은 결과.
function resolveRoomsSearch({ location, checkin, checkout, guests }: RoomsSearchParams) {
  const guestCount = guests ? Number(guests) : 0;
  const filtered = filterListings(allRooms, { location, checkin, checkout, guests: guestCount });
  const searchStart = parseYMD(checkin);
  const searchEnd = parseYMD(checkout);
  // 압축 검색바·메타 description에 쓰는 검색 조건 요약
  const searchLabels = {
    location: location ? `${location}의 숙소` : undefined,
    date: searchStart && searchEnd ? formatRangeLabel(searchStart, searchEnd) : undefined,
    guests: guestCount > 0 ? `게스트 ${guestCount}명` : undefined,
  };
  const heading = location ? `${location}의 숙소` : "숙소";
  return { location, checkin, checkout, guestCount, filtered, searchStart, searchEnd, searchLabels, heading };
}

export async function generateMetadata({ searchParams }: RoomsPageProps): Promise<Metadata> {
  const { filtered, searchLabels, heading } = resolveRoomsSearch(await searchParams);
  const conditions = [searchLabels.date, searchLabels.guests].filter(Boolean).join(" · ");
  const description = `${conditions ? `${conditions} 조건으로 ` : ""}예약 가능한 ${heading} ${filtered.length}개를 둘러보세요.`;
  return toMetadata(`${heading} ${filtered.length}개`, description, filtered[0]?.image);
}

export default async function RoomsPage({ searchParams }: RoomsPageProps) {
  const { location, checkin, checkout, guestCount, filtered, searchStart, searchEnd, searchLabels, heading } =
    resolveRoomsSearch(await searchParams);

  // 첫 페이지만 서버에서 렌더링하고(빠른 첫 화면), 이후 페이지는 클라이언트가 API로 이어 붙인다.
  const firstPage = paginate(filtered, 1, DEFAULT_PAGE_LIMIT);
  const title = `${heading} ${filtered.length}개`;

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
    <PageHeader activeTab={0} searchLabels={searchLabels}>
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
