import Image from "next/image";
import styles from "./ItemDetail.module.css";

interface DetailGalleryProps {
  // [대표 사진, 나머지...] — lib/gallery.ts pickGalleryImages가 고른 서로 다른 사진들
  images: string[];
  alt: string;
}

// 상단 이미지 갤러리: 왼쪽 큰 사진 1장 + 오른쪽 2x2 작은 사진.
// 사진이 5장보다 적게 오면(풀 부족) 있는 사진을 순환해 칸을 채운다.
export default function DetailGallery({ images, alt }: DetailGalleryProps) {
  const [main, ...rest] = images;
  const side = [0, 1, 2, 3].map((i) => (rest.length > 0 ? rest[i % rest.length] : main));
  return (
    <div className={styles.gallery}>
      <div className={styles.galleryMain}>
        <Image src={main} alt={alt} fill sizes="(max-width: 743px) 100vw, 450px" className={styles.image} priority />
      </div>
      <div className={styles.gallerySide}>
        {side.map((src, i) => (
          <div className={styles.gallerySideItem} key={i}>
            <Image
              src={src}
              alt={`${alt} 사진 ${i + 2}`}
              fill
              sizes="(max-width: 743px) 50vw, 225px"
              className={styles.image}
              priority={i === 0}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
