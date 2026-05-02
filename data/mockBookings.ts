import { listings } from "@/data/mockListings";

export type Booking = {
  id: string;
  listingId: string;
  title: string;
  location: string;
  date: string;
  time: string;
  status: "Confirmed" | "Completed" | "Pending";
  image: number;
};

export const bookings: Booking[] = [
  {
    id: "1",
    listingId: "1",
    title: listings[0].title,
    location: listings[0].location,
    date: "Saturday, 18 May 2026",
    time: "10:00 AM",
    status: "Confirmed",
    image: listings[0].image,
  },
  {
    id: "2",
    listingId: "4",
    title: listings[3].title,
    location: listings[3].location,
    date: "Wednesday, 22 May 2026",
    time: "11:00 AM",
    status: "Confirmed",
    image: listings[3].image,
  },
  {
    id: "3",
    listingId: "2",
    title: listings[1].title,
    location: listings[1].location,
    date: "Friday, 10 May 2026",
    time: "10:30 AM",
    status: "Completed",
    image: listings[1].image,
  },
];
