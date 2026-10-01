import type { Metadata } from "next";
import Providers from "./providers";
import { SITE_NAME } from "@/lib/listingMeta";
import "./globals.css";

const SITE_DESCRIPTION = "에어비앤비 클론 프로젝트 - 전국 최고의 숙소를 찾아보세요";

// 하위 페이지는 title만 정하면 "… | Airbnb Clone"이 붙는다. 제목이 없는 페이지(홈)는 default.
export const metadata: Metadata = {
  title: { default: SITE_NAME, template: `%s | ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  openGraph: { siteName: SITE_NAME, locale: "ko_KR", type: "website", title: SITE_NAME, description: SITE_DESCRIPTION },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
