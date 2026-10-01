import PageHeader from "@/components/layout/PageHeader";
import RoomSection from "@/components/home/RoomSection";
import type { ListingItem } from "@/data/types";
import { busanRooms, seoulRooms, jejuRooms } from "@/data/rooms";
import {
  todayGapyeongExperiences,
  tomorrowGapyeongExperiences,
  weekendGapyeongExperiences,
} from "@/data/experiences";
import { photoServices, busanServices, seoulServices } from "@/data/services";
import { parseTab } from "@/lib/tabs";

interface HomePageProps {
  searchParams: Promise<{ tab?: string | string[] }>;
}

interface SectionConfig {
  title: string;
  href: string;
  rooms: ListingItem[];
}

// 탭별 홈 섹션 (탭 순서: 숙소/체험/서비스 — lib/tabs.ts TAB_SLUGS와 같은 순서)
const TAB_SECTIONS: { basePath: string; perPerson: boolean; sections: SectionConfig[] }[] = [
  {
    basePath: "/rooms",
    perPerson: false,
    sections: [
      { title: "광안리해수욕장의 인기 숙소", href: "/rooms?location=부산", rooms: busanRooms },
      { title: "서울 인기 숙소", href: "/rooms?location=서울", rooms: seoulRooms },
      { title: "제주도 추천 숙소", href: "/rooms?location=제주", rooms: jejuRooms },
    ],
  },
  {
    basePath: "/experiences",
    perPerson: true,
    sections: [
      { title: "오늘 가평군에서 진행되는 체험", href: "/experiences?category=gapyeong-today", rooms: todayGapyeongExperiences },
      { title: "내일 가평군에서 진행되는 체험", href: "/experiences?category=gapyeong-tomorrow", rooms: tomorrowGapyeongExperiences },
      { title: "이번 주말에 진행되는 체험", href: "/experiences?category=weekend", rooms: weekendGapyeongExperiences },
    ],
  },
  {
    basePath: "/services",
    perPerson: true,
    sections: [
      { title: "사진 촬영", href: "/services?category=photo", rooms: photoServices },
      { title: "부산의 서비스", href: "/services?location=부산", rooms: busanServices },
      { title: "서울의 서비스", href: "/services?location=서울", rooms: seoulServices },
    ],
  },
];

// 서버 컴포넌트: 탭(?tab=)에 맞는 섹션 데이터를 여기서 골라 캐러셀(RoomSection, 클라이언트)에
// props로만 넘긴다. 데이터 모듈(목업 생성기 포함)은 서버에서만 실행되고 브라우저 번들에 들어가지 않는다.
// searchParams를 읽으므로 요청 시점에 렌더링된다 — 카드의 예약 가능 날짜도 "오늘(KST)" 기준이라
// 빌드 시점 정적 생성이면 날짜가 낡고 hydration mismatch가 나므로 이 점이 필요하다(lib/dates.ts).
export default async function HomePage({ searchParams }: HomePageProps) {
  const { tab } = await searchParams;
  const activeTab = parseTab(tab);
  const { basePath, perPerson, sections } = TAB_SECTIONS[activeTab];

  return (
    <PageHeader activeTab={activeTab} forceScrolled={false}>
      {sections.map((section, i) => (
        <RoomSection
          key={section.href}
          title={section.title}
          href={section.href}
          basePath={basePath}
          rooms={section.rooms}
          priority={i === 0}
          perPerson={perPerson}
        />
      ))}
    </PageHeader>
  );
}
