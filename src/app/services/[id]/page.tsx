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
    <PageHeader activeTab={2}>
      <ItemDetail
        item={service}
        backHref="/services"
        backLabel="서비스 목록으로"
        categoryLabel="서비스"
        subtitle={service.location}
        perPerson
      />
    </PageHeader>
  );
}
