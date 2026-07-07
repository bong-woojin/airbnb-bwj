import PageHeader from "@/components/layout/PageHeader";
import ListingGrid from "@/components/listing/ListingGrid";
import { allRooms, roomsByCity } from "@/data/rooms";

interface RoomsPageProps {
  searchParams: Promise<{ location?: string }>;
}

export default async function RoomsPage({ searchParams }: RoomsPageProps) {
  const { location } = await searchParams;
  const items = location ? roomsByCity[location] ?? [] : allRooms;

  return (
    <PageHeader initialTab={0}>
      <ListingGrid items={items} basePath="/rooms" />
    </PageHeader>
  );
}
