import { images } from "@/constants/assets";

export type ExploreListing = {
  id: string;
  title: string;
  price: string;
  location: string;
  distance: string;
  image: number;
  photos: number;
  bedrooms: number;
  bathrooms: number;
  verified: boolean;
  escrowAvailable: boolean;
  secureChat: boolean;
  propertyType: "Bedsitters" | "Apartments" | "Houses";
  listedAt: string;
};

export const exploreListings: ExploreListing[] = [
  {
    id: "1",
    title: "2 Bedroom Apartment",
    price: "KES 35,000",
    location: "Kilimani, Nairobi",
    distance: "2.3 km away",
    image: images.propertyLiving,
    photos: 8,
    bedrooms: 2,
    bathrooms: 2,
    verified: true,
    escrowAvailable: true,
    secureChat: true,
    propertyType: "Apartments",
    listedAt: "2026-05-01",
  },
  {
    id: "2",
    title: "1 Bedroom Apartment",
    price: "KES 28,000",
    location: "South B, Nairobi",
    distance: "3.1 km away",
    image: images.propertyHouse,
    photos: 6,
    bedrooms: 1,
    bathrooms: 1,
    verified: true,
    escrowAvailable: true,
    secureChat: true,
    propertyType: "Apartments",
    listedAt: "2026-04-28",
  },
  {
    id: "3",
    title: "3 Bedroom Apartment",
    price: "KES 45,000",
    location: "Westlands, Nairobi",
    distance: "1.8 km away",
    image: images.propertyHouse,
    photos: 10,
    bedrooms: 3,
    bathrooms: 2,
    verified: true,
    escrowAvailable: true,
    secureChat: true,
    propertyType: "Apartments",
    listedAt: "2026-04-25",
  },
  {
    id: "4",
    title: "Bedsitter",
    price: "KES 22,000",
    location: "Rongai, Nairobi",
    distance: "4.2 km away",
    image: images.propertyLiving,
    photos: 7,
    bedrooms: 0,
    bathrooms: 1,
    verified: true,
    escrowAvailable: true,
    secureChat: true,
    propertyType: "Bedsitters",
    listedAt: "2026-04-22",
  },
];
