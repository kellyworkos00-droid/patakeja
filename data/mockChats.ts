import { listings } from "@/data/mockListings";

export type TimeSlot = { id: string; date: string; time: string };

export type ChatMessage = {
  id: string;
  from: "me" | "them";
  text?: string;
  time: string;
  read?: boolean;
  slotsLabel?: string;
  timeSlots?: TimeSlot[];
};

export type ChatThread = {
  id: string;
  userId: string;
  name: string;
  initials: string;
  avatarColor: string;
  listingId: string;
  listingTitle: string;
  listingSubtitle: string;
  listingLocation: string;
  listingPrice: string;
  listingDistance: string;
  lastMessage: string;
  lastFromMe?: boolean;
  time: string;
  unread: number;
  verified: boolean;
  online: boolean;
  avatar: any;
  responseTime: string;
  messages: ChatMessage[];
};

export const chats: ChatThread[] = [
  {
    id: "1",
    userId: "u1",
    name: "John Mwangi",
    initials: "JM",
    avatarColor: "#0F4C3A",
    listingId: "1",
    listingTitle: "2 Bedroom Apartment in Kilimani",
    listingSubtitle: "2 Bedroom Apartment in Kilimani",
    listingLocation: "Kilimani, Nairobi",
    listingPrice: "KES 35,000",
    listingDistance: "2.3 km away",
    lastMessage: "Hi! Is this apartment still available?",
    lastFromMe: false,
    time: "10:24 AM",
    unread: 2,
    verified: true,
    online: true,
    avatar: listings[0].image,
    responseTime: "Typically replies in a few minutes",
    messages: [
      { id: "m1", from: "them", text: "Hi! Thanks for your interest in my apartment. How can I help you?", time: "10:24 AM" },
      { id: "m2", from: "me", text: "Hi John! Is this apartment still available?", time: "10:25 AM", read: true },
      { id: "m3", from: "them", text: "Yes, it is available 🤩\nWould you like to schedule a viewing?", time: "10:26 AM" },
      { id: "m4", from: "me", text: "Yes please. I'm available this weekend.", time: "10:27 AM", read: true },
      {
        id: "m5",
        from: "them",
        slotsLabel: "Great! Here are the available times:",
        timeSlots: [
          { id: "s1", date: "Sat, 18 May", time: "10:00 AM" },
          { id: "s2", date: "Sat, 18 May", time: "2:00 PM" },
          { id: "s3", date: "Sun, 19 May", time: "11:00 AM" },
        ],
        time: "10:28 AM",
      },
      { id: "m6", from: "me", text: "Let's do Saturday at 10:00 AM.", time: "10:29 AM", read: true },
      { id: "m7", from: "them", text: "All set! You're booked for Saturday, 18 May at 10:00 AM.\nSee you then! 👋", time: "10:30 AM" },
    ],
  },
  {
    id: "2",
    userId: "u2",
    name: "Grace Wambui",
    initials: "GW",
    avatarColor: "#4C1D95",
    listingId: "2",
    listingTitle: "1 Bedroom House in Westlands",
    listingSubtitle: "1 Bedroom House in Westlands",
    listingLocation: "Westlands, Nairobi",
    listingPrice: "KES 28,000",
    listingDistance: "3.1 km away",
    lastMessage: "Thank you! I'm interested in booking a viewing.",
    lastFromMe: false,
    time: "Yesterday",
    unread: 1,
    verified: true,
    online: true,
    avatar: listings[1].image,
    responseTime: "Typically replies within an hour",
    messages: [
      { id: "m1", from: "them", text: "Hello! I saw your listing on PataKeja.", time: "Yesterday" },
      { id: "m2", from: "me", text: "Hi Grace! Yes, it is still available.", time: "Yesterday", read: true },
      { id: "m3", from: "them", text: "Thank you! I'm interested in booking a viewing.", time: "Yesterday" },
    ],
  },
  {
    id: "3",
    userId: "u3",
    name: "Peter Otieno",
    initials: "PO",
    avatarColor: "#1E3A5F",
    listingId: "3",
    listingTitle: "Bedsitter in South B",
    listingSubtitle: "Bedsitter in South B",
    listingLocation: "South B, Nairobi",
    listingPrice: "KES 15,000",
    listingDistance: "5.0 km away",
    lastMessage: "Okay, I'll be available on Saturday.",
    lastFromMe: false,
    time: "Yesterday",
    unread: 0,
    verified: true,
    online: true,
    avatar: listings[2].image,
    responseTime: "Typically replies in a few hours",
    messages: [
      { id: "m1", from: "them", text: "Can I view the bedsitter this weekend?", time: "Yesterday" },
      { id: "m2", from: "me", text: "Yes, Saturday slots are open.", time: "Yesterday", read: true },
      { id: "m3", from: "them", text: "Okay, I'll be available on Saturday.", time: "Yesterday" },
    ],
  },
  {
    id: "4",
    userId: "u4",
    name: "Mary Njeri",
    initials: "MN",
    avatarColor: "#7C2D12",
    listingId: "1",
    listingTitle: "3 Bedroom Apartment in Lavington",
    listingSubtitle: "3 Bedroom Apartment in Lavington",
    listingLocation: "Lavington, Nairobi",
    listingPrice: "KES 45,000",
    listingDistance: "1.8 km away",
    lastMessage: "Can we discuss the deposit amount?",
    lastFromMe: false,
    time: "May 12",
    unread: 3,
    verified: true,
    online: false,
    avatar: listings[0].image,
    responseTime: "Typically replies within a day",
    messages: [
      { id: "m1", from: "them", text: "Hi, is the 3-bedroom still available?", time: "May 12" },
      { id: "m2", from: "me", text: "Yes it is. When would you like to view?", time: "May 12", read: true },
      { id: "m3", from: "them", text: "Can we discuss the deposit amount?", time: "May 12" },
    ],
  },
  {
    id: "5",
    userId: "u5",
    name: "David Kimani",
    initials: "DK",
    avatarColor: "#14532D",
    listingId: "2",
    listingTitle: "2 Bedroom Apartment in Kileleshwa",
    listingSubtitle: "2 Bedroom Apartment in Kileleshwa",
    listingLocation: "Kileleshwa, Nairobi",
    listingPrice: "KES 38,000",
    listingDistance: "2.7 km away",
    lastMessage: "Great! Let's schedule for Friday.",
    lastFromMe: true,
    time: "May 11",
    unread: 0,
    verified: true,
    online: false,
    avatar: listings[1].image,
    responseTime: "Typically replies in a few hours",
    messages: [
      { id: "m1", from: "them", text: "Is Friday afternoon available for viewing?", time: "May 11" },
      { id: "m2", from: "me", text: "Great! Let's schedule for Friday.", time: "May 11", read: true },
    ],
  },
  {
    id: "6",
    userId: "u6",
    name: "Faith Akinyi",
    initials: "FA",
    avatarColor: "#831843",
    listingId: "3",
    listingTitle: "1 Bedroom in Rongai",
    listingSubtitle: "1 Bedroom in Rongai",
    listingLocation: "Rongai, Nairobi",
    listingPrice: "KES 18,000",
    listingDistance: "6.4 km away",
    lastMessage: "This place looks amazing 😍",
    lastFromMe: false,
    time: "May 10",
    unread: 0,
    verified: true,
    online: false,
    avatar: listings[2].image,
    responseTime: "Typically replies within an hour",
    messages: [
      { id: "m1", from: "them", text: "This place looks amazing 😍", time: "May 10" },
      { id: "m2", from: "me", text: "Thank you! It is a great value for money.", time: "May 10", read: true },
    ],
  },
  {
    id: "7",
    userId: "u7",
    name: "Brian Kariuki",
    initials: "BK",
    avatarColor: "#1E40AF",
    listingId: "1",
    listingTitle: "4 Bedroom House in Karen",
    listingSubtitle: "4 Bedroom House in Karen",
    listingLocation: "Karen, Nairobi",
    listingPrice: "KES 85,000",
    listingDistance: "8.2 km away",
    lastMessage: "When can I view the house?",
    lastFromMe: false,
    time: "May 9",
    unread: 2,
    verified: true,
    online: false,
    avatar: listings[0].image,
    responseTime: "Typically replies in a few hours",
    messages: [
      { id: "m1", from: "them", text: "When can I view the house?", time: "May 9" },
      { id: "m2", from: "me", text: "Viewings are available Tuesday and Thursday.", time: "May 9", read: true },
    ],
  },
];
