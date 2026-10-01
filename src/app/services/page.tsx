import type { Metadata } from "next";
import PageHeader from "@/components/layout/PageHeader";
import ListingResults from "@/components/listing/ListingResults";
import { allServices, servicesByCategory, servicesByLocation } from "@/data/services";
import { toMetadata } from "@/lib/listingMeta";

const CATEGORY_TITLES: Record<string, string> = {
  photo: "사진 촬영 서비스",
};

interface ServicesPageProps {
  searchParams: Promise<{ category?: string; location?: string }>;
}

// 페이지와 generateMetadata가 같은 목록·제목을 쓰도록 한 곳에서 해석
function resolveServices({ category, location }: Awaited<ServicesPageProps["searchParams"]>) {
  let items = allServices;
  let titleBase = "서비스";
  if (category) {
    items = servicesByCategory[category] ?? [];
    titleBase = CATEGORY_TITLES[category] ?? "서비스";
  } else if (location) {
    items = servicesByLocation[location] ?? [];
    titleBase = `${location}의 서비스`;
  }
  return { items, titleBase, location };
}

export async function generateMetadata({ searchParams }: ServicesPageProps): Promise<Metadata> {
  const { items, titleBase } = resolveServices(await searchParams);
  return toMetadata(
    `${titleBase} ${items.length}개`,
    `${titleBase} ${items.length}개 — 1인당 가격과 평점을 비교하고 예약하세요.`,
    items[0]?.image,
  );
}

export default async function ServicesPage({ searchParams }: ServicesPageProps) {
  const { items, titleBase, location } = resolveServices(await searchParams);

  return (
    <PageHeader activeTab={2}>
      <ListingResults
        items={items}
        title={`${titleBase} ${items.length}개`}
        basePath="/services"
        mapQuery={location ?? "대한민국"}
        mapZoom={location ? 12 : 7}
        perPerson
      />
    </PageHeader>
  );
}
