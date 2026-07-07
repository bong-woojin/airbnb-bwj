import { notFound } from "next/navigation";
import PageHeader from "@/components/layout/PageHeader";
import ItemDetail from "@/components/detail/ItemDetail";
import { allExperiences } from "@/data/experiences";

interface ExperienceDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ExperienceDetailPage({ params }: ExperienceDetailPageProps) {
  const { id } = await params;
  const experience = allExperiences.find((item) => item.id === id);

  if (!experience) {
    notFound();
  }

  return (
    <PageHeader initialTab={1}>
      <ItemDetail item={experience} backHref="/" backLabel="홈으로" categoryLabel="체험" perPerson />
    </PageHeader>
  );
}
