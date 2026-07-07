import RoomCard from "@/components/home/RoomCard";
import type { ListingItem } from "@/data/types";
import styles from "./ListingGrid.module.css";

interface ListingGridProps {
  items: ListingItem[];
  basePath: string;
  perPerson?: boolean;
}

export default function ListingGrid({ items, basePath, perPerson }: ListingGridProps) {
  if (items.length === 0) {
    return <p className={styles.empty}>표시할 항목이 없습니다.</p>;
  }

  return (
    <div className={styles.grid}>
      {items.map((item, index) => (
        <RoomCard
          key={item.id}
          {...item}
          href={`${basePath}/${item.id}`}
          perPerson={perPerson}
          priority={index < 6}
        />
      ))}
    </div>
  );
}
