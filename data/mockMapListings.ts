import { images } from "@/constants/assets";

export type MapListing = {
  id: string;
  title: string;
  price: string;
  priceNum: number;
  latitude: number;
  longitude: number;
  area: string;
  city: string;
  distance: string;
  image: number;
  verified: boolean;
  escrowAvailable: boolean;
};

export const mapListings: MapListing[] = [
  {
    id: "1",
    title: "2 Bedroom Apartment",
    price: "KES 35K",
    priceNum: 35000,
    // Approximate area center with slight privacy-safe offset.
    latitude: -1.2924,
    longitude: 36.7812,
    area: "Kilimani",
    city: "Nairobi",
    distance: "2.3 km away",
    image: images.propertyLiving,
    verified: true,
    escrowAvailable: true,
  },
  {
    id: "2",
    title: "1 Bedroom Apartment",
    price: "KES 28K",
    priceNum: 28000,
    latitude: -1.2671,
    longitude: 36.8052,
    area: "Westlands",
    city: "Nairobi",
    distance: "3.1 km away",
    image: images.homeDirection,
    verified: true,
    escrowAvailable: true,
  },
  {
    id: "3",
    title: "3 Bedroom Townhouse",
    price: "KES 45K",
    priceNum: 45000,
    latitude: -1.2796,
    longitude: 36.7609,
    area: "Lavington",
    city: "Nairobi",
    distance: "1.8 km away",
    image: images.propertyHouse,
    verified: true,
    escrowAvailable: true,
  },
  {
    id: "4",
    title: "Bedsitter",
    price: "KES 15K",
    priceNum: 15000,
    latitude: -1.3958,
    longitude: 36.7603,
    area: "Rongai",
    city: "Nairobi",
    distance: "4.2 km away",
    image: images.propertyDetailMock,
    verified: false,
    escrowAvailable: true,
  },
  {
    id: "5",
    title: "Studio Apartment",
    price: "KES 22K",
    priceNum: 22000,
    latitude: -1.3135,
    longitude: 36.8434,
    area: "South B",
    city: "Nairobi",
    distance: "5.0 km away",
    image: images.propertyLiving,
    verified: true,
    escrowAvailable: false,
  },
];
