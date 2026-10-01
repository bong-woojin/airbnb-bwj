import PageHeader from "@/components/layout/PageHeader";
import ListingResults from "@/components/listing/ListingResults";
import { allExperiences, experiencesByCategory } from "@/data/experiences";

const CATEGORY_TITLES: Record<string, string> = {
  "gapyeong-today": "오늘 가평군에서 진행되는 체험",
  "gapyeong-tomorrow": "내일 가평군에서 진행되는 체험",
  "weekend": "이번 주말에 진행되는 체험",
};

interface ExperiencesPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function ExperiencesPage({ searchParams }: ExperiencesPageProps) {
  const { category } = await searchParams;

  const items = category ? (experiencesByCategory[category] ?? []) : allExperiences;
  const titleBase = category ? (CATEGORY_TITLES[category] ?? "체험") : "체험";

  return (
    <PageHeader activeTab={1}>
      <ListingResults
        items={items}
        title={`${titleBase} ${items.length}개`}
        basePath="/experiences"
        mapQuery="가평"
        mapZoom={11}
        perPerson
      />
    </PageHeader>
  );
}
