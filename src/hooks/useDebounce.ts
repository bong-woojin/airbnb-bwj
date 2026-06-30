import { useState, useEffect } from "react";

// 입력값이 빠르게 바뀔 때 일정 시간 후에만 실행되도록 지연시키는 훅
// 검색창에서 타이핑할 때마다 API 호출을 막기 위해 사용
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
