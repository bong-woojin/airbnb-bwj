import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageHeader from "@/components/layout/PageHeader";
import ItemDetail from "@/components/detail/ItemDetail";
import { allServices } from "@/data/services";
import { buildDetailMeta, toMetadata } from "@/lib/listingMeta";
import { pickGalleryImages } from "@/lib/gallery";

interface ServiceDetailPageProps {
  params: Promise<{ id: string }>;
}

// 없는 id면 null — 메타데이터와 페이지 양쪽에서 notFound()로 404를 띄운다
function find(id: string) {
  return allServices.find((item) => item.id === id) ?? null;
}

export async function generateMetadata({ params }: ServiceDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const item = find(id);
  if (!item) notFound();
  const { title, description } = buildDetailMeta({ item, kind: "services" });
  return toMetadata(title, description, item.image, item.location);
}

export default async function ServiceDetailPage({ params }: ServiceDetailPageProps) {
  const { id } = await params;
  const service = find(id);

  if (!service) {
    notFound();
  }

  const galleryImages = pickGalleryImages(service.image, allServices.map((i) => i.image), service.id);

  return (
    <PageHeader activeTab={2} mobileLayout="detail">
      <ItemDetail
        item={service}
        backHref="/services"
        backLabel="서비스 목록으로"
        categoryLabel="서비스"
        subtitle={service.location}
        perPerson
        galleryImages={galleryImages}
      />
    </PageHeader>
  );
}
