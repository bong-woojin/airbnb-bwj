"use client";

import styles from "./RoomCard.module.css";

interface RoomCardProps {
  image: string;
  location: string;
  date: string;
  price: number;
  rating: number;
  isGuestFavorite: boolean;
}

export default function RoomCard({
  image,
  location,
  date,
  price,
  rating,
  isGuestFavorite,
}: RoomCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.tag}>
        {isGuestFavorite && <span className={styles.tag_name}>게스트 선호</span>}
        <button className={styles.remark}>
          <span>
            <svg
              viewBox="0 0 32 32"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              role="presentation"
              focusable="false"
              style={{
                display: "block",
                fill: "rgba(0, 0, 0, 0.5)",
                height: "24px",
                width: "24px",
                stroke: "#fff",
                strokeWidth: 2,
                overflow: "visible",
              }}
            >
              <path d="m15.9998 28.6668c7.1667-4.8847 14.3334-10.8844 14.3334-18.1088 0-1.84951-.6993-3.69794-2.0988-5.10877-1.3996-1.4098-3.2332-2.11573-5.0679-2.11573-1.8336 0-3.6683.70593-5.0668 2.11573l-2.0999 2.11677-2.0988-2.11677c-1.3995-1.4098-3.2332-2.11573-5.06783-2.11573-1.83364 0-3.66831.70593-5.06683 2.11573-1.39955 1.41083-2.09984 3.25926-2.09984 5.10877 0 7.2244 7.16667 13.2241 14.3333 18.1088z"></path>
            </svg>
          </span>
        </button>
      </div>
      <div className={styles.imageWrap}>
        <img src={image} alt={location} className={styles.image} />
      </div>
      <div className={styles.info}>
        <div className={styles.location}>{location}</div>
        <div className={styles.date}>{date}</div>
        <div className={styles.bottom}>
          <span className={styles.price}>총액 ₩{price.toLocaleString()}</span>
          <span className={styles.rating}>
            {" "}
            · <span className={styles.star}>★</span>
            {rating}
          </span>
        </div>
      </div>
    </div>
  );
}
