import PageHeader from "@/components/layout/PageHeader";
import ListingResults from "@/components/listing/ListingResults";
import { allRooms, roomsByCity } from "@/data/rooms";
import { formatRangeLabel, isStayWithinRange, parseCardDateRange, parseYMD } from "@/lib/dates";

interface RoomsPageProps {
  searchParams: Promise<{ location?: string; checkin?: string; checkout?: string; guests?: string }>;
}

export default async function RoomsPage({ searchParams }: RoomsPageProps) {
  const { location, checkin, checkout, guests } = await searchParams;

  let items = location ? (roomsByCity[location] ?? []) : allRooms;

  // 날짜 검색: 선택한 체크인~체크아웃이 숙소의 가능 기간 안에 완전히 포함되는 숙소만 노출
  const searchStart = parseYMD(checkin);
  const searchEnd = parseYMD(checkout);
  if (searchStart && searchEnd) {
    items = items.filter((item) => {
      const range = parseCardDateRange(item.date);
      return range !== null && isStayWithinRange(searchStart, searchEnd, range);
    });
  }

  const guestCount = guests ? Number(guests) : 0;

  // 압축 검색바에 표시할 검색 조건 요약
  const searchLabels = {
    location: location ? `${location}의 숙소` : undefined,
    date: searchStart && searchEnd ? formatRangeLabel(searchStart, searchEnd) : undefined,
    guests: guestCount > 0 ? `게스트 ${guestCount}명` : undefined,
  };

  const title = location ? `${location}의 숙소 ${items.length}개` : `숙소 ${items.length}개`;

  return (
    <PageHeader initialTab={0} searchLabels={searchLabels}>
      <ListingResults
        items={items}
        title={title}
        basePath="/rooms"
        mapQuery={location ?? "대한민국"}
        mapZoom={location ? 12 : 7}
      />
    </PageHeader>
  );
}
