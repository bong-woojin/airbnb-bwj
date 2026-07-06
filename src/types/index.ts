export interface Room {
  id: string;
  title: string;
  type: string;
  location: {
    city: string;
    country: string;
    address: string;
    lat: number;
    lng: number;
  };
  images: string[];
  price: number;
  rating: number;
  reviewCount: number;
  maxGuests: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  amenities: string[];
  host: Host;
  description: string;
  categoryId: string;
  isSuperhost: boolean;
  isWishlisted: boolean;
}

export interface Host {
  id: string;
  name: string;
  avatar: string;
  isSuperhost: boolean;
  joinedYear: number;
  reviewCount: number;
  rating: number;
}

export interface Review {
  id: string;
  roomId: string;
  author: string;
  avatar: string;
  rating: number;
  date: string;
  comment: string;
}

export interface Category {
  id: string;
  label: string;
  icon: string;
}

