import { type NextRequest } from "next/server";
import { DEFAULT_PAGE_LIMIT, filterListings, paginate } from "@/lib/listings";
import { allRooms } from "@/data/rooms";
import { allExperiences } from "@/data/experiences";
import { allServices } from "@/data/services";
import type { ListingItem } from "@/data/types";
import { pickGalleryImages, withCardImages } from "@/lib/gallery";

// 목록 조회 API. 데이터 저장소(src/data)는 이 API 뒤에 숨고,
// 클라이언트(무한 스크롤 등)는 이 계약(쿼리 파라미터/응답 형태)만 바라본다.
// 필터 로직은 서버 컴포넌트와 공유하는 lib/listings.ts를 그대로 사용한다.
const SOURCES: Record<string, ListingItem[]> = {
  rooms: allRooms,
  experiences: allExperiences,
  services: allServices,
};

// 클라이언트 로딩 UI가 눈에 보이도록 하는 지연 (예약 API와 같은 목적)
const DEMO_DELAY_MS = 400;

// 위시리스트처럼 카테고리를 가리지 않고 id로 모아 올 때 — 상세 링크를 만들 수 있게 basePath를 같이 준다
const BASE_PATHS: Record<string, string> = { rooms: "/rooms", experiences: "/experiences", services: "/services" };

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;

  // ?ids=a,b,c — 위시리스트 페이지용. 요청한 순서대로, 없는 id는 건너뛴다.
  const idsParam = params.get("ids");
  if (idsParam !== null) {
    const wanted = idsParam.split(",").filter(Boolean).slice(0, 200);
    const found = new Map<string, ListingItem & { type: string; basePath: string }>();
    for (const [type, items] of Object.entries(SOURCES)) {
      for (const item of items) {
        if (wanted.includes(item.id)) {
          const images = pickGalleryImages(item.image, items.map((i) => i.image), item.id);
          found.set(item.id, { ...item, images, type, basePath: BASE_PATHS[type] });
        }
      }
    }
    return Response.json({ items: wanted.flatMap((id) => found.get(id) ?? []) });
  }

  const type = params.get("type") ?? "rooms";
  const source = SOURCES[type];
  if (!source) {
    return Response.json(
      { error: `알 수 없는 type입니다: ${type} (rooms | experiences | services)` },
      { status: 400 },
    );
  }

  const filtered = filterListings(source, {
    location: params.get("location") ?? undefined,
    checkin: params.get("checkin") ?? undefined,
    checkout: params.get("checkout") ?? undefined,
    guests: Number(params.get("guests")) || 0,
  });

  const page = Number(params.get("page")) || 1;
  const limit = Number(params.get("limit")) || DEFAULT_PAGE_LIMIT;

  await new Promise((resolve) => setTimeout(resolve, DEMO_DELAY_MS));

  const result = paginate(filtered, page, limit);
  return Response.json({ ...result, items: withCardImages(result.items, source.map((i) => i.image)) });
}
