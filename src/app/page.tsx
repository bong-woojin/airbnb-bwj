import { connection } from "next/server";
import HomePage from "@/components/home/HomePage";

export default async function Page() {
  // 카드의 예약 가능 날짜는 "오늘" 기준으로 계산된다(lib/dates.ts). 빌드 시점에 정적 생성하면
  // HTML에는 빌드한 날의 날짜가 박히고 브라우저는 방문한 날로 hydration해 mismatch가 나므로,
  // 요청 시점에 렌더링해 서버와 브라우저가 같은 "오늘(KST)"을 쓰게 한다.
  await connection();
  return <HomePage />;
}
