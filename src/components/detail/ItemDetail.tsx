"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./ItemDetail.module.css";
import { useWishlist } from "@/hooks/useWishlist";
import BookingCard from "./BookingCard";
import type { ListingItem } from "@/data/types";

interface ItemDetailProps {
  item: ListingItem;
  backHref: string;
  backLabel: string;
  categoryLabel: string;
  perPerson?: boolean;
  subtitle?: string;
}

const HOST_NAME = "우진";
const REVIEW_COUNT = 8;

const HIGHLIGHTS = [
  {
    text: "상위 5% 숙소",
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="8" r="5" />
        <path d="M9 12.5 7 21l5-3 5 3-2-8.5" />
      </svg>
    ),
  },
  {
    text: "부산역 근처",
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 21s7-7.58 7-12a7 7 0 1 0-14 0c0 4.42 7 12 7 12z" />
        <circle cx="12" cy="9" r="2.5" />
      </svg>
    ),
  },
  {
    text: "여행 가방 보관 가능",
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="4" y="8" width="16" height="12" rx="2" />
        <path d="M9 8V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
        <path d="M4 13h16" />
      </svg>
    ),
  },
  {
    text: "편의성이 뛰어난 체크인 절차",
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="8" cy="8" r="4" />
        <path d="M11 11l9 9M17 15l2 2M14 18l2 2" />
      </svg>
    ),
  },
  {
    text: "세탁기 및 건조기",
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="4" y="3" width="16" height="18" rx="2" />
        <circle cx="12" cy="13" r="5" />
        <circle cx="8" cy="6" r="0.8" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    text: "에어컨",
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2v20M4.5 6l15 12M19.5 6l-15 12" />
      </svg>
    ),
  },
];

const SLEEP_PHOTOS = [
  { label: "침실 1", image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600" },
  { label: "침실 2", image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600" },
  { label: "침실 3", image: "https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=600" },
  { label: "거실", image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600" },
];

const DESCRIPTION_TEXT = `안녕하세요. 🌸부산역 근처 정성 가득한 숙소, 정스테이(Jung Stay)입니다.

우리 집은 2026년 6월에 정성껏 리모델링을 마친 30평 규모의 넓고 고풍스러운 숙소입니다. 한국적인 따뜻함과 아늑함을 가득 담아, 귀한 걸음 해주시는 손님들이 내 집처럼 편안하게 쉬어가실 수 있도록 공간 하나하나 신경 써서 준비했습니다.

최대 9명까지 머무르실 수 있어 대가족 여행, 동창회나 동호회 모임, 오랜 친구들과의 우정 여행 등 소중한 분들과 함께하는 부산 여행에 더없이 좋은 선택이 되실 겁니다. 넉넉하고 훈훈한 정으로 손님들을 맞이하겠습니다.

숙소
🏠 공간 소개 (The Space)

크기 및 인원: 약 30평(100㎡)의 넓은 복층 구조로, 최대 9인까지 여유롭게 머무실 수 있습니다.

구조: 침실 3개 (퀸사이즈 침대 총 4개) + 거실 + 주방 + 욕실 2개

위치: 부산역에서 걸어서 7분 거리라 약간 거리가 있지만 거리가 있는 만큼 조용한곳에 있어 정말 괜찮습니다. (김해공항에서는 차로 30분 거리이며, 숙소 도보 2분 거리에 24시간 편의점이 있어 늦은 밤에도 든든합니다.)

게스트 이용 가능 공간/시설
🛋️ 정성으로 가꾼 공간들

▪️ 거실 (Living Room)
다 함께 둘러앉아 도란도란 이야기꽃을 피울 수 있는 9인용 대형 원목 식탁을 두었습니다.
55인치 스마트 TV로 보고 싶으신 모든 OTT 영상을 자유롭게 즐기실 수 있습니다.

초고속 무료 Wi-Fi는 물론, 여행지에서도 옷매무새를 깔끔하게 유지하실 수 있도록 스팀다리미도 챙겨두었습니다.

▪️ 침실 (Bedrooms - 총 3개)
편안하고 깊은 숙면을 위해 방마다 널찍한 퀸사이즈 침대를 총 4개 나누어 배치했습니다.

매일매일 깨끗하게 세탁하고 보송하게 말린 호텔급 고급 침구류로 갈아 끼우니 안심하고 꿀잠 자러 오세요.

방마다 옷걸이와 화장대, 거울을 각각 구비해 두어, 인원이 많아도 바쁜 아침 시간에 서두르지 않고 여유롭게 외출 준비를 하실 수 있습니다.

▪️ 주방 (Kitchen)
대가족이 오셔도 부족함 없도록 넉넉한 식기 세트와 냉장고, 전자레인지, 가스레인지, 전기포트를 세심하게 채워두었습니다.

크기별 냄비와 후라이팬, 조리도구 일체가 준비되어 있습니다. (※ 단, 소금이나 후추 같은 조미료는 개인 위생을 위해 제공되지 않으니 필요하신 경우 개별 지참 부탁드립니다.)

⚠️ 주의해 주세요: 다음번에 머무실 손님들을 위해 연기나 기름, 냄새가 많이 베이는 음식(고기구이, 해산물 요리, 마라탕, 매운탕 등)의 조리는 삼가해 주시기를 정중히 부탁드립니다.

▪️ 욕실 (Bathrooms - 총 2개)

욕실이 2개라 인원이 많아도 화장실 때문에 기다리는 일 없도록 준비했고, 드라이기 2개와 고데기 1개를 준비해 두었습니다. 면봉, 화장솜, 머리끈까지 세심하게 챙겨두었으니 편하게 쓰세요.

수건은 1인당 2장씩 보송한 상태로 기본 제공됩니다. (※ 3박 이상 오래 머무시는 분들은 숙소 내 세탁기와 건조기로 언제든 편하게 셀프 세탁하실 수 있습니다.)

▪️ 세탁기&건조기 (Washer & Dryer)
게스트분들의 쾌적한 여행을 위해 신제품 세탁기와 건조기를 구비해뒀습니다. 머무시는 동안 내 집처럼 편안하게 사용하세요!

🧳 게스트를 위한 세심한 서비스
짐 보관 서비스: 체크인 전이나 체크아웃 하신 후에도 무거운 가방 없이 가볍고 즐겁게 부산을 구경하실 수 있도록, 짐을 무료로 안전하게 보관해 드립니다.(사전 예약 필수)

하우스키핑 서비스: 3박 이상 연박하시는 귀한 손님들께는 내 집처럼 더 쾌적하게 지내실 수 있도록 중간에 무료 하우스키핑을 진행해 드립니다. (사전 예약 필수)

기타 주의사항
🤝 머무시는 동안 꼭 지켜주세요 (주의사항)
서로를 배려하는 따뜻한 마음으로 아래 사항들을 꼭 확인해 주시길 부탁드립니다.

1. 복층 안내: 저희 숙소는 3층과 4층을 함께 쓰는 복층 구조입니다. 건물 내에 엘리베이터는 없지만, 계단 층계가 낮고 완만해서 큰 짐을 들고 오르내리시기에도 크게 힘들지 않으실 겁니다. 하지만 심신이 미약하신 어르신이나 아이들에게는 어려움이 있는 숙소일수도 있습니다. 😭

2. 이용 시간: 입실은 오후 3시부터, 퇴실은 오전 11시까지입니다. 다음 손님을 위한 깨끗한 청소 시간을 위해 시간을 꼭 지켜주세요.

3. 전 객실 절대 금연 🚭: 화장실을 포함한 숙소 내부 전체가 당연히 금연입니다. 흡연 시 경보기가 울리거나 과태료 10만 원과 특수 청소 비용이 청구될 수 있으니 꼭 숙소 건물 외부에서 흡연해 주시고, 담배꽁초도 깔끔하게 처리해 주세요.

4. 인원 확인: 예약하신 분들 외에 추가 인원이나 외부 방문객이 들어오시는 것은 엄격히 금지됩니다. (안전과 인원 확인을 위해 건물 입구 및 외부에 CCTV가 가동 중입니다. 허가되지 않은 인원 적발 시 인당 5만 원의 추가 요금이 부과됩니다.)

5. 소음 주의: 아랫집에 태어난지 얼마되지않은 사랑스러운 천사가 살고있습니다. 늦은 밤인 오후 10시 이후에는 고성방가를 자제해 주시고 서로 조금씩만 조용히 배려해 주세요.

6. 반려동물 동반 불가: 안타깝게도 안내견을 제외한 모든 반려동물은 동반이 어렵습니다.

7. 물품 소중히 다루기: 가구나 숙소 비품을 소중히 사용해 주세요. 심한 오염(침구·소파의 혈흔이나 염색약 등)이나 파손, 분실이 생길 경우 실제 구매 비용 기준으로 청구될 수 있습니다. 퇴실하실 때는 가벼운 쓰레기 정리와 설거지를 부탁드립니다.

8. 현장 사진 안내: 저희 집은 정기적으로 계절에 어울리는 소품(액자 등)과 가구 배치로 인테리어를 조금씩 새로이 단장하고 있습니다. 때문에 시기에 따라 사진과 실제 느낌이 살짝 다를 수 있습니다. 편의시설이나 제공 물품은 변함없이 알차게 준비되어 있으니 편안한 마음으로 찾아주세요. 🙏🏼


**지자체에서 허가받은 합법숙소입니다**
**본 숙소는 미스터멘션 특례를 적용받아 내국인 공유 숙박 합법 업체로 등록되어 운영되고 있습니다**

등록 세부 정보
발급 지역: 부산광역시, 중구
허가 유형: 외국인관광도시민박업
허가번호: 2026000009`;

export default function ItemDetail({ item, backHref, backLabel, categoryLabel, perPerson, subtitle }: ItemDetailProps) {
  const { isWishlisted, toggle } = useWishlist(item.id);
  const pageTitle = subtitle ?? `${item.location} · ${categoryLabel}`;
  const [showDescModal, setShowDescModal] = useState(false);
  const [sleepPage, setSleepPage] = useState(0);
  const sleepPageCount = Math.ceil(SLEEP_PHOTOS.length / 2);
  const visibleSleepPhotos = SLEEP_PHOTOS.slice(sleepPage * 2, sleepPage * 2 + 2);
  const cityLabel = item.location.split("·")[0].trim();
  const mapQuery = item.location.replace(/·/g, " ").replace(/\s+/g, " ").trim();

  return (
    <div className={styles.wrapper}>
      <Link href={backHref} className={styles.back}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true" focusable="false" style={{ display: "block", fill: "none", height: "12px", width: "12px", stroke: "currentcolor", strokeWidth: 4, overflow: "visible", transform: "scaleX(-1)" }}>
          <path fill="none" d="m12 4 11.3 11.3a1 1 0 0 1 0 1.4L12 28" />
        </svg>
        {backLabel}
      </Link>

      <div className={styles.headerRow}>
        <h1 className={styles.pageTitle}>{pageTitle}</h1>
        <div className={styles.headerActions}>
          <button type="button" className={styles.actionBtn}>
            <svg
              viewBox="0 0 32 32"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              style={{ display: "block", fill: "none", height: "16px", width: "16px", stroke: "currentcolor", strokeWidth: 3, overflow: "visible" }}
            >
              <path d="M16 2v20M16 2l6 6M16 2l-6 6M6 20v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6" />
            </svg>
            공유하기
          </button>
          <button
            type="button"
            className={styles.actionBtn}
            onClick={toggle}
            aria-label={isWishlisted ? "찜 목록에서 삭제" : "찜하기"}
          >
            <svg
              viewBox="0 0 32 32"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              style={{
                display: "block",
                fill: isWishlisted ? "#FF385C" : "none",
                height: "16px",
                width: "16px",
                stroke: isWishlisted ? "#FF385C" : "currentcolor",
                strokeWidth: 2,
                overflow: "visible",
              }}
            >
              <path d="m15.9998 28.6668c7.1667-4.8847 14.3334-10.8844 14.3334-18.1088 0-1.84951-.6993-3.69794-2.0988-5.10877-1.3996-1.4098-3.2332-2.11573-5.0679-2.11573-1.8336 0-3.6683.70593-5.0668 2.11573l-2.0999 2.11677-2.0988-2.11677c-1.3995-1.4098-3.2332-2.11573-5.06783-2.11573-1.83364 0-3.66831.70593-5.06683 2.11573-1.39955 1.41083-2.09984 3.25926-2.09984 5.10877 0 7.2244 7.16667 13.2241 14.3333 18.1088z"></path>
            </svg>
            저장
          </button>
        </div>
      </div>

      <div className={styles.gallery}>
        <div className={styles.galleryMain}>
          <Image src={item.image} alt={item.location} fill sizes="(max-width: 743px) 100vw, 450px" className={styles.image} priority />
        </div>
        <div className={styles.gallerySide}>
          {[0, 1, 2, 3].map((i) => (
            <div className={styles.gallerySideItem} key={i}>
              <Image src={item.image} alt={item.location} fill sizes="(max-width: 743px) 50vw, 225px" className={styles.image} priority={i === 0} />
            </div>
          ))}
        </div>
      </div>

      <div className={styles.lowerRow}>
        <div className={styles.lowerMain}>
          {categoryLabel === "숙소" && (
            <>
              <h2 className={styles.introTitle}>{HOST_NAME} 님이 호스팅하는 숙소 전체</h2>
              <p className={styles.introMeta}>최대 인원 9명 · 침실 3개 · 침대 4개 · 욕실 2개</p>

              <div className={styles.favoriteCard}>
                <div className={styles.favoriteInfo}>
                  <div className={styles.favoriteTitleRow}>
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="12" cy="8" r="5" />
                      <path d="M9 12.5 7 21l5-3 5 3-2-8.5" />
                    </svg>
                    <span className={styles.favoriteTitle}>게스트 선호</span>
                  </div>
                  <p className={styles.favoriteDesc}>
                    에어비앤비 게스트에게
                    <br />
                    가장 사랑받는 숙소
                  </p>
                </div>
                <div className={styles.favoriteStats}>
                  <div className={styles.favoriteStat}>
                    <span className={styles.favoriteNum}>5.0</span>
                    <span className={styles.favoriteStars}>★★★★★</span>
                  </div>
                  <div className={styles.favoriteDividerV} />
                  <div className={styles.favoriteStat}>
                    <span className={styles.favoriteNum}>{REVIEW_COUNT}개</span>
                    <span className={styles.favoriteSub}>후기</span>
                  </div>
                </div>
              </div>

              <ul className={styles.highlights}>
                {HIGHLIGHTS.map((h) => (
                  <li key={h.text}>
                    <span className={styles.highlightIcon}>{h.icon}</span>
                    {h.text}
                  </li>
                ))}
              </ul>

              <hr className={styles.divider} />

              <div className={styles.hostRow}>
                <p className={styles.hostName}>호스트 : {HOST_NAME} 님</p>
                <p className={styles.hostSub}>신규 호스트</p>
              </div>

              <hr className={styles.divider} />

              <p className={styles.descriptionText}>{DESCRIPTION_TEXT}</p>
              <button type="button" className={styles.moreBtn} onClick={() => setShowDescModal(true)}>
                더보기
              </button>

              <hr className={styles.divider} />

              <div className={styles.sleepSection}>
                <h3 className={styles.sleepTitle}>숙박 장소</h3>
                <div className={styles.sleepGrid}>
                  {visibleSleepPhotos.map((photo) => (
                    <div className={styles.sleepItem} key={photo.label}>
                      <Image src={photo.image} alt={photo.label} fill sizes="280px" className={styles.image} />
                      <span className={styles.sleepLabel}>{photo.label}</span>
                    </div>
                  ))}
                </div>
                <div className={styles.sleepControls}>
                  <span className={styles.sleepPageLabel}>
                    {sleepPage + 1}/{sleepPageCount}
                  </span>
                  <button
                    type="button"
                    className={styles.sleepArrowBtn}
                    onClick={() => setSleepPage((p) => Math.max(0, p - 1))}
                    disabled={sleepPage === 0}
                    aria-label="이전 사진"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true" focusable="false" style={{ display: "block", fill: "none", height: "12px", width: "12px", stroke: "currentcolor", strokeWidth: 4, overflow: "visible", transform: "scaleX(-1)" }}>
                      <path fill="none" d="m12 4 11.3 11.3a1 1 0 0 1 0 1.4L12 28" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    className={styles.sleepArrowBtn}
                    onClick={() => setSleepPage((p) => Math.min(sleepPageCount - 1, p + 1))}
                    disabled={sleepPage >= sleepPageCount - 1}
                    aria-label="다음 사진"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true" focusable="false" style={{ display: "block", fill: "none", height: "12px", width: "12px", stroke: "currentcolor", strokeWidth: 4, overflow: "visible" }}>
                      <path fill="none" d="m12 4 11.3 11.3a1 1 0 0 1 0 1.4L12 28" />
                    </svg>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
        <div className={styles.lowerSide}>
          {categoryLabel === "숙소" && <BookingCard price={item.price} dateRangeLabel={item.date} />}
        </div>
      </div>

      {categoryLabel === "숙소" && (
        <div className={styles.locationSection}>
          <h2 className={styles.locationTitle}>위치</h2>
          <p className={styles.locationSubtitle}>{cityLabel}, 한국</p>
          <div className={styles.mapWrap}>
            <iframe
              className={styles.mapFrame}
              src={`https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&z=16&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="지도"
            />
          </div>
        </div>
      )}

      {showDescModal && (
        <div className={styles.modalOverlay} onClick={() => setShowDescModal(false)}>
          <div className={styles.modalPanel} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <button
                type="button"
                className={styles.modalCloseBtn}
                onClick={() => setShowDescModal(false)}
                aria-label="닫기"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true" focusable="false" style={{ display: "block", fill: "none", height: "14px", width: "14px", stroke: "currentcolor", strokeWidth: 3.5, overflow: "visible" }}>
                  <path d="m6 6 20 20M26 6 6 26" />
                </svg>
              </button>
              <span className={styles.modalTitle}>숙소 설명</span>
            </div>
            <div className={styles.modalBody}>
              <p className={styles.modalDescription}>{DESCRIPTION_TEXT}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
