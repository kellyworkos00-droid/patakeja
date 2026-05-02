import { images } from "@/constants/assets";

export type Listing = {
  id: string;
  title: string;
  price: string;
  location: string;
  distance: string;
  beds: number;
  baths: number;
  parking: boolean;
  photos: number;
  image: number;
  gallery: number[];
  description: string;
  amenities: string[];
  landlord: string;
  saved?: boolean;
};

export const listings: Listing[] = [
  {
    id: "1",
    title: "2 Bedroom Apartment",
    price: "KES 35,000",
    location: "Kilimani, Nairobi",
    distance: "2.3 km away",
    beds: 2,
    baths: 2,
    parking: true,
    photos: 8,
    image: images.propertyLiving,
    gallery: [images.propertyLiving, images.propertyDetailMock, images.homeDirection],
    description:
      "Modern and spacious apartment with natural lighting, secure access, ample parking, and quick access to shopping, restaurants, and public transport.",
    amenities: ["WiFi", "Security", "Balcony", "Water 24/7", "Kitchen"],
    landlord: "James Mwangi",
    saved: true,
  },
  {
    id: "2",
    title: "1 Bedroom Apartment",
    price: "KES 28,000",
    location: "Westlands, Nairobi",
    distance: "3.1 km away",
    beds: 1,
    baths: 1,
    parking: true,
    photos: 6,
    image: images.homeDirection,
    gallery: [images.homeDirection, images.propertyLiving, images.propertyHouse],
    description:
      "A bright one-bedroom home close to offices, cafes, and transport links. The building is verified and all viewings are scheduled in app.",
    amenities: ["Security", "Lift", "Water 24/7", "Kitchen"],
    landlord: "Grace Wambui",
  },
  {
    id: "3",
    title: "3 Bedroom Townhouse",
    price: "KES 45,000",
    location: "Lavington, Nairobi",
    distance: "1.8 km away",
    beds: 3,
    baths: 2,
    parking: true,
    photos: 10,
    image: images.propertyHouse,
    gallery: [images.propertyHouse, images.propertyLiving, images.exploreDirection],
    description:
      "Quiet townhouse with generous rooms, a private balcony, gated entry, and secure in-app coordination from inquiry to viewing.",
    amenities: ["Garden", "Security", "Parking", "Water 24/7"],
    landlord: "Peter Otieno",
  },
  {
    id: "4",
    title: "Bedsitter",
    price: "KES 15,000",
    location: "Rongai, Nairobi",
    distance: "4.2 km away",
    beds: 1,
    baths: 1,
    parking: false,
    photos: 7,
    image: images.propertyDetailMock,
    gallery: [images.propertyDetailMock, images.propertyLiving],
    description:
      "Compact and clean bedsitter in a verified property with secure entry, reliable water, and simple viewing scheduling.",
    amenities: ["Security", "Water 24/7", "Kitchenette"],
    landlord: "Mary Njeri",
  },
];

export const trustBadges = ["Verified", "Secure Chat", "Escrow"] as const;
