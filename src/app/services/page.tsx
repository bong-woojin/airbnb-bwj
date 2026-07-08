import PageHeader from "@/components/layout/PageHeader";
import ListingResults from "@/components/listing/ListingResults";
import { allServices, servicesByCategory, servicesByLocation } from "@/data/services";

const CATEGORY_TITLES: Record<string, string> = {
  photo: "사진 촬영 서비스",
};

interface ServicesPageProps {
  searchParams: Promise<{ category?: string; location?: string }>;
}

export default async function ServicesPage({ searchParams }: ServicesPageProps) {
  const { category, location } = await searchParams;

  let items = allServices;
  let titleBase = "서비스";
  if (category) {
    items = servicesByCategory[category] ?? [];
    titleBase = CATEGORY_TITLES[category] ?? "서비스";
  } else if (location) {
    items = servicesByLocation[location] ?? [];
    titleBase = `${location}의 서비스`;
  }

  return (
    <PageHeader initialTab={2}>
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
