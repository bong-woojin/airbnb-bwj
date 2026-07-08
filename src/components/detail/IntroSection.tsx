import styles from "./ItemDetail.module.css";
import { HOST_NAME, REVIEW_COUNT, HIGHLIGHTS } from "./content";
import { LaurelLeftIcon, LaurelRightIcon } from "./icons";

interface IntroSectionProps {
  categoryLabel?: string;
  // 숙소별 콘텐츠 오버라이드 (roomContent.ts) — 없으면 기본값
  hostName?: string;
  hostSub?: string;
  introMeta?: string;
}

// 소개 상단부: 호스팅 타이틀 · 인원 정보 · 게스트 선호 카드 · 특징 리스트 · 호스트 정보.
// 숙소가 아닌 카테고리(체험/서비스)는 숙소 전용 정보(침실/특징 리스트)를 뺀 간소 버전으로 렌더링한다.
export default function IntroSection({
  categoryLabel = "숙소",
  hostName = HOST_NAME,
  hostSub = "신규 호스트",
  introMeta = "최대 인원 9명 · 침실 3개 · 침대 4개 · 욕실 2개",
}: IntroSectionProps) {
  const isRoom = categoryLabel === "숙소";

  return (
    <>
      <h2 className={styles.introTitle}>
        {isRoom ? `${hostName} 님이 호스팅하는 숙소 전체` : `${hostName} 님이 진행하는 ${categoryLabel}`}
      </h2>
      {isRoom && <p className={styles.introMeta}>{introMeta}</p>}

      <div className={styles.favoriteCard}>
        <div className={styles.favoriteInfo}>
          <div className={styles.favoriteTitleRow}>
            <div>
              <LaurelLeftIcon />
            </div>
            <span className={styles.favoriteTitle}>
              게스트
              <br /> 선호
            </span>
            <div>
              <LaurelRightIcon />
            </div>
          </div>
          <p className={styles.favoriteDesc}>에어비앤비 게스트에게 가장 사랑받는 {categoryLabel}</p>
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

      {isRoom && (
        <ul className={styles.highlights}>
          {HIGHLIGHTS.map((h) => (
            <li key={h.text}>
              <span className={styles.highlightIcon}>{h.icon}</span>
              {h.text}
            </li>
          ))}
        </ul>
      )}

      <hr className={styles.divider} />

      <div className={styles.hostRow}>
        <p className={styles.hostName}>호스트 : {hostName} 님</p>
        <p className={styles.hostSub}>{hostSub}</p>
      </div>
    </>
  );
}
