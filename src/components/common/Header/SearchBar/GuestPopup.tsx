"use client";

import { useEffect, useState } from "react";
import GuestCounter, { type GuestKey, type Guests } from "@/components/common/GuestCounter";

interface GuestPopupProps {
  onTotalChange: (total: number) => void;
}

export default function GuestPopup({ onTotalChange }: GuestPopupProps) {
  const [guests, setGuests] = useState<Guests>({ adults: 0, children: 0, infants: 0, pets: 0 });

  const total = guests.adults + guests.children + guests.infants + guests.pets;

  useEffect(() => {
    onTotalChange(total);
  }, [total, onTotalChange]);

  function adjustGuest(key: GuestKey, delta: number) {
    setGuests((g) => ({ ...g, [key]: Math.max(0, g[key] + delta) }));
  }

  return <GuestCounter guests={guests} onAdjust={adjustGuest} />;
}
