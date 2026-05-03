import { images } from "@/constants/assets";

export type MapListing = {
  id: string;
  title: string;
  price: string;
  priceNum: number;
  area: string;
  city: string;
  distance: string;
  image: number;
  verified: boolean;
  escrowAvailable: boolean;
  /** percentage-based screen position on the mock map image */
  markerX: string;
  markerY: string;
};

export const mapListings: MapListing[] = [
  {
    id: "1",
    title: "2 Bedroom Apartment",
    price: "KES 35K",
    priceNum: 35000,
    area: "Kilimani",
    city: "Nairobi",
    distance: "2.3 km away",
    image: images.propertyLiving,
    verified: true,
    escrowAvailable: true,
    markerX: "40%",
    markerY: "36%",
  },
  {
    id: "2",
    title: "1 Bedroom Apartment",
    price: "KES 28K",
    priceNum: 28000,
    area: "Westlands",
    city: "Nairobi",
    distance: "3.1 km away",
    image: images.homeDirection,
    verified: true,
    escrowAvailable: true,
    markerX: "19%",
    markerY: "26%",
  },
  {
    id: "3",
    title: "3 Bedroom Townhouse",
    price: "KES 45K",
    priceNum: 45000,
    area: "Lavington",
    city: "Nairobi",
    distance: "1.8 km away",
    image: images.propertyHouse,
    verified: true,
    escrowAvailable: true,
    markerX: "12%",
    markerY: "50%",
  },
  {
    id: "4",
    title: "Bedsitter",
    price: "KES 15K",
    priceNum: 15000,
    area: "Rongai",
    city: "Nairobi",
    distance: "4.2 km away",
    image: images.propertyDetailMock,
    verified: false,
    escrowAvailable: true,
    markerX: "63%",
    markerY: "55%",
  },
  {
    id: "5",
    title: "Studio Apartment",
    price: "KES 22K",
    priceNum: 22000,
    area: "South B",
    city: "Nairobi",
    distance: "5.0 km away",
    image: images.propertyLiving,
    verified: true,
    escrowAvailable: false,
    markerX: "74%",
    markerY: "32%",
  },
];
