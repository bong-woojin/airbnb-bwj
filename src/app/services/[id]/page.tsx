import { notFound } from "next/navigation";
import PageHeader from "@/components/layout/PageHeader";
import ItemDetail from "@/components/detail/ItemDetail";
import { allServices } from "@/data/services";

interface ServiceDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ServiceDetailPage({ params }: ServiceDetailPageProps) {
  const { id } = await params;
  const service = allServices.find((item) => item.id === id);

  if (!service) {
    notFound();
  }

  return (
    <PageHeader initialTab={2}>
      <ItemDetail item={service} backHref="/" backLabel="홈으로" categoryLabel="서비스" perPerson />
    </PageHeader>
  );
}
