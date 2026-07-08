import styles from "./ItemDetail.module.css";

// "알아두어야 할 사항": 환불 정책 · 이용규칙 · 안전 안내 3단 구성
export default function KnowSection() {
  return (
    <div className={styles.knowSection}>
      <h2 className={styles.knowTitle}>알아두어야 할 사항</h2>
      <ul className={styles.knowList}>
        <li className={styles.knowItem}>
          <span className={styles.knowIcon}>
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          </span>
          <strong className={styles.knowSubtitle}>환불 정책</strong>
          <p className={styles.knowDesc}>10월 18일 전까지 무료 취소가 가능합니다. 10월 23일 체크인 전에 취소하면 부분 환불을 받으실 수 있습니다. 자세한 내용은 호스트의 환불 정책 전문을 참고하세요.</p>
        </li>
        <li className={styles.knowItem}>
          <span className={styles.knowIcon}>
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          </span>
          <strong className={styles.knowSubtitle}>숙소 이용규칙</strong>
          <p className={styles.knowDesc}>체크인 가능 시간 : 오후 4:00 이후<br/>체크아웃 시간: 오전 11:00 전까지<br/>게스트 정원 8명</p>
        </li>
        <li className={styles.knowItem}>
          <span className={styles.knowIcon}>
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><path d="M12 9v4"/><circle cx="12" cy="17" r="1" fill="currentColor" stroke="none"/></svg>
          </span>
          <strong className={styles.knowSubtitle}>안전 및 공간</strong>
          <p className={styles.knowDesc}>일산화탄소 경보기<br/>화재경보기<br/>소음이 발생할 수 있음</p>
        </li>
      </ul>
    </div>
  );
}
