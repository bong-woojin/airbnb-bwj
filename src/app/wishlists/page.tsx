import type { Metadata } from "next";
import PageHeader from "@/components/layout/PageHeader";
import WishlistGrid from "@/components/wishlist/WishlistGrid";
import { toMetadata } from "@/lib/listingMeta";

export const metadata: Metadata = toMetadata("위시리스트", "찜한 숙소·체험·서비스를 한곳에서 모아 보세요.");

// 찜 목록은 브라우저(localStorage + Redux)에만 있어서, 서버는 껍데기만 그리고
// 목록은 클라이언트가 id로 /api/listings?ids= 에서 가져온다.
export default function WishlistsPage() {
  return (
    <PageHeader>
      <WishlistGrid />
    </PageHeader>
  );
}
