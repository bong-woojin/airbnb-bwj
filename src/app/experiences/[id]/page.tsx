import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageHeader from "@/components/layout/PageHeader";
import ItemDetail from "@/components/detail/ItemDetail";
import { allExperiences } from "@/data/experiences";
import { buildDetailMeta, toMetadata } from "@/lib/listingMeta";

interface ExperienceDetailPageProps {
  params: Promise<{ id: string }>;
}

// 없는 id면 null — 메타데이터와 페이지 양쪽에서 notFound()로 404를 띄운다
function find(id: string) {
  return allExperiences.find((item) => item.id === id) ?? null;
}

export async function generateMetadata({ params }: ExperienceDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const item = find(id);
  if (!item) notFound();
  const { title, description } = buildDetailMeta({ item, kind: "experiences" });
  return toMetadata(title, description, item.image, item.location);
}

export default async function ExperienceDetailPage({ params }: ExperienceDetailPageProps) {
  const { id } = await params;
  const experience = find(id);

  if (!experience) {
    notFound();
  }

  return (
    <PageHeader activeTab={1}>
      <ItemDetail
        item={experience}
        backHref="/experiences"
        backLabel="체험 목록으로"
        categoryLabel="체험"
        subtitle={experience.location}
        perPerson
      />
    </PageHeader>
  );
}
