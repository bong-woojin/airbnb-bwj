import type { Metadata } from "next";
import PageHeader from "@/components/layout/PageHeader";
import ListingResults from "@/components/listing/ListingResults";
import { allExperiences, experiencesByCategory } from "@/data/experiences";
import { toMetadata } from "@/lib/listingMeta";
import { withCardImages } from "@/lib/gallery";

const CATEGORY_TITLES: Record<string, string> = {
  "gapyeong-today": "오늘 가평군에서 진행되는 체험",
  "gapyeong-tomorrow": "내일 가평군에서 진행되는 체험",
  "weekend": "이번 주말에 진행되는 체험",
};

interface ExperiencesPageProps {
  searchParams: Promise<{ category?: string }>;
}

// 페이지와 generateMetadata가 같은 목록·제목을 쓰도록 한 곳에서 해석
function resolveExperiences({ category }: Awaited<ExperiencesPageProps["searchParams"]>) {
  const items = category ? (experiencesByCategory[category] ?? []) : allExperiences;
  const titleBase = category ? (CATEGORY_TITLES[category] ?? "체험") : "체험";
  return { items, titleBase };
}

export async function generateMetadata({ searchParams }: ExperiencesPageProps): Promise<Metadata> {
  const { items, titleBase } = resolveExperiences(await searchParams);
  return toMetadata(
    `${titleBase} ${items.length}개`,
    `${titleBase} ${items.length}개 — 1인당 가격과 평점을 비교하고 예약하세요.`,
    items[0]?.image,
  );
}

export default async function ExperiencesPage({ searchParams }: ExperiencesPageProps) {
  const { items, titleBase } = resolveExperiences(await searchParams);

  return (
    <PageHeader activeTab={1}>
      <ListingResults
        items={withCardImages(items, allExperiences.map((i) => i.image))}
        title={`${titleBase} ${items.length}개`}
        basePath="/experiences"
        mapQuery="가평"
        mapZoom={11}
        perPerson
      />
    </PageHeader>
  );
}
