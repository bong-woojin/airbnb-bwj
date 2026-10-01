"use client";

import styles from "./ServiceTypePopup.module.css";

const STROKE_ICON_STYLE = {
  display: "block" as const,
  height: "16px",
  width: "16px",
  fill: "none" as const,
  stroke: "currentcolor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const SERVICE_TYPES = [
  {
    title: "사진 촬영",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true" role="presentation" focusable="false" style={{ display: "block", height: "16px", width: "16px", fill: "currentcolor" }}>
        <path d="M17.59 2a2 2 0 0 1 1.28.47l.13.12L21.42 5H25a5 5 0 0 1 4.98 4.56l.02.22V24a5 5 0 0 1-4.78 5H7a5 5 0 0 1-5-4.78V10a5 5 0 0 1 4.78-5h3.83L13 2.6a2 2 0 0 1 1.07-.57l.17-.02.18-.01zm0 2h-3.17l-2.97 3H7a3 3 0 0 0-3 2.82V24a3 3 0 0 0 2.82 3H25a3 3 0 0 0 3-2.82V10a3 3 0 0 0-2.82-3h-4.59zM16 9a8 8 0 1 1 0 16 8 8 0 0 1 0-16zm0 2a6 6 0 1 0 0 12 6 6 0 0 0 0-12zM7 9a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
      </svg>
    ),
  },
  {
    title: "셰프",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false" style={STROKE_ICON_STYLE}>
        <path d="M6 10a3 3 0 0 1 3-3 3 3 0 0 1 6 0 3 3 0 0 1 3 3c0 2.5-2 4.5-4.5 4.5h-3C7 14.5 6 12.5 6 10z" />
        <path d="M8 21h8M9 21v-5.5M15 21v-5.5" />
      </svg>
    ),
  },
  {
    title: "마사지",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false" style={STROKE_ICON_STYLE}>
        <path d="M9 12V5a1.5 1.5 0 0 1 3 0v6M12 11V4a1.5 1.5 0 0 1 3 0v7M15 11.5V6a1.5 1.5 0 0 1 3 0v9c0 3.5-2.5 6-6 6h-1c-2 0-3.2-.6-4.5-2L4 15.5c-.6-.7-.5-1.7.2-2.2.6-.5 1.5-.4 2 .1L8 15" />
      </svg>
    ),
  },
  {
    title: "미식 딜리버리",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false" style={STROKE_ICON_STYLE}>
        <rect x="3" y="9" width="18" height="12" rx="2" />
        <path d="M3 9l3-5h12l3 5M12 9v12" />
      </svg>
    ),
  },
  {
    title: "트레이닝",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false" style={STROKE_ICON_STYLE}>
        <path d="M6 7v10M4 9v6M18 7v10M20 9v6M6 12h12" />
      </svg>
    ),
  },
  {
    title: "메이크업",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false" style={STROKE_ICON_STYLE}>
        <path d="M9 21h6l1-9H8l1 9zM8 12l1-6a3 3 0 0 1 6 0l1 6" />
      </svg>
    ),
  },
  {
    title: "헤어",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false" style={STROKE_ICON_STYLE}>
        <circle cx="6" cy="6" r="2.5" />
        <circle cx="6" cy="18" r="2.5" />
        <path d="M8.5 7.5L20 18M8.5 16.5L20 6" />
      </svg>
    ),
  },
  {
    title: "스파 트리트먼트",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false" style={STROKE_ICON_STYLE}>
        <path d="M12 3c-4 3-6 7-6 11a6 6 0 0 0 12 0c0-4-2-8-6-11z" />
        <path d="M12 21V10" />
      </svg>
    ),
  },
  {
    title: "케이터링",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false" style={STROKE_ICON_STYLE}>
        <path d="M4 16a8 8 0 0 1 16 0" />
        <path d="M2 16h20" />
        <path d="M12 8V5" />
        <circle cx="12" cy="4" r="1" />
      </svg>
    ),
  },
];

interface ServiceTypePopupProps {
  selected: string;
  onSelect: (title: string) => void;
}

export default function ServiceTypePopup({ selected, onSelect }: ServiceTypePopupProps) {
  return (
    <div className={styles.serviceTypeGrid}>
      {SERVICE_TYPES.map((svc) => (
        <button
          type="button"
          key={svc.title}
          className={`${styles.serviceTypeItem} ${selected === svc.title ? styles.serviceTypeItemActive : ""}`}
          aria-pressed={selected === svc.title}
          onClick={() => onSelect(svc.title)}
        >
          <span className={styles.serviceTypeIcon} aria-hidden="true">{svc.icon}</span>
          <span className={styles.serviceTypeLabel}>{svc.title}</span>
        </button>
      ))}
    </div>
  );
}
