import { listings } from "@/data/mockListings";

export type ChatMessage = {
  id: string;
  from: "me" | "them";
  text: string;
  time: string;
};

export type ChatThread = {
  id: string;
  name: string;
  listingId: string;
  listingTitle: string;
  lastMessage: string;
  time: string;
  unread: number;
  verified: boolean;
  avatar: number;
  messages: ChatMessage[];
};

export const chats: ChatThread[] = [
  {
    id: "1",
    name: "John Mwangi",
    listingId: "1",
    listingTitle: "2 Bedroom Apartment in Kilimani",
    lastMessage: "Hi! Is this apartment still available?",
    time: "10:24 AM",
    unread: 2,
    verified: true,
    avatar: listings[0].image,
    messages: [
      { id: "m1", from: "them", text: "Hi! Is this apartment still available?", time: "10:24 AM" },
      { id: "m2", from: "me", text: "Yes, it is available. You can book a viewing inside PataKeja.", time: "10:27 AM" },
      { id: "m3", from: "them", text: "Great. Saturday morning works for me.", time: "10:30 AM" },
    ],
  },
  {
    id: "2",
    name: "Grace Wambui",
    listingId: "2",
    listingTitle: "1 Bedroom House in Westlands",
    lastMessage: "Thank you! I am interested in booking a viewing.",
    time: "Yesterday",
    unread: 1,
    verified: true,
    avatar: listings[1].image,
    messages: [
      { id: "m1", from: "them", text: "Thank you! I am interested in booking a viewing.", time: "Yesterday" },
      { id: "m2", from: "me", text: "Perfect. Please choose a date in the booking screen.", time: "Yesterday" },
    ],
  },
  {
    id: "3",
    name: "Peter Otieno",
    listingId: "3",
    listingTitle: "3 Bedroom Apartment in Lavington",
    lastMessage: "Okay, I will be available on Saturday.",
    time: "Yesterday",
    unread: 0,
    verified: true,
    avatar: listings[2].image,
    messages: [
      { id: "m1", from: "them", text: "Can I view it this weekend?", time: "Yesterday" },
      { id: "m2", from: "me", text: "Yes. I have opened Saturday slots for in-app booking.", time: "Yesterday" },
      { id: "m3", from: "them", text: "Okay, I will be available on Saturday.", time: "Yesterday" },
    ],
  },
];
