import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import {
  ArrowLeft,
  Check,
  Phone,
  MoreHorizontal,
  MapPin,
  CalendarDays,
  Heart,
  CheckCheck,
  Shield,
  Smile,
  Mic,
  Plus,
  DollarSign,
} from "lucide-react-native";
import { chats, ChatMessage } from "@/data/mockChats";

function ChipIcon({ icon }: { icon: string }) {
  if (icon === "dot") return <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: "#16A34A" }} />;
  if (icon === "calendar") return <CalendarDays size={13} color="#64748B" strokeWidth={2} />;
  if (icon === "dollar") return <DollarSign size={13} color="#64748B" strokeWidth={2} />;
  if (icon === "pin") return <MapPin size={13} color="#64748B" strokeWidth={2} />;
  return null;
}

function VerifiedBadge() {
  return (
    <View
      style={{
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: "#16A34A",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Check color="white" size={10} strokeWidth={3} />
    </View>
  );
}

function PersonAvatar({
  initials,
  color,
  size = 44,
  showDot,
}: {
  initials: string;
  color: string;
  size?: number;
  showDot?: boolean;
}) {
  return (
    <View style={{ position: "relative" }}>
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text
          style={{
            color: "white",
            fontSize: size * 0.34,
            fontWeight: "700",
            letterSpacing: 0.5,
          }}
        >
          {initials}
        </Text>
      </View>
      {showDot && (
        <View
          style={{
            position: "absolute",
            bottom: 1,
            right: 1,
            width: 12,
            height: 12,
            borderRadius: 6,
            backgroundColor: "#16A34A",
            borderWidth: 2,
            borderColor: "#FFFFFF",
          }}
        />
      )}
    </View>
  );
}

function MessageBubble({
  message,
  initials,
  avatarColor,
}: {
  message: ChatMessage;
  initials: string;
  avatarColor: string;
}) {
  const isMe = message.from === "me";

  if (message.timeSlots) {
    return (
      <View
        style={{
          marginHorizontal: 14,
          marginBottom: 10,
          flexDirection: "row",
          alignItems: "flex-start",
          gap: 8,
        }}
      >
        <PersonAvatar initials={initials} color={avatarColor} size={32} />
        <View style={{ maxWidth: "80%" }}>
          {message.slotsLabel && (
            <View
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: 18,
                borderTopLeftRadius: 4,
                paddingHorizontal: 14,
                paddingVertical: 10,
                marginBottom: 8,
                borderWidth: 1,
                borderColor: "#F1F5F9",
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: "#0F172A",
                  lineHeight: 20,
                }}
              >
                {message.slotsLabel}
              </Text>
            </View>
          )}
          {message.timeSlots!.map((slot) => (
            <Pressable
              key={slot.id}
              style={({ pressed }) => ({
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                backgroundColor: pressed ? "#F0FDF4" : "#FFFFFF",
                borderRadius: 14,
                paddingHorizontal: 14,
                paddingVertical: 12,
                marginBottom: 6,
                borderWidth: 1,
                borderColor: "#E2E8F0",
              })}
            >
              <CalendarDays size={16} color="#16A34A" strokeWidth={2} />
              <Text style={{ fontSize: 14, fontWeight: "600", color: "#0F172A" }}>
                {slot.date} – {slot.time}
              </Text>
            </Pressable>
          ))}
          <Text style={{ fontSize: 11, color: "#94A3B8", marginTop: 2 }}>
            {message.time}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View
      style={{
        marginHorizontal: 14,
        marginBottom: 8,
        flexDirection: "row",
        alignItems: "flex-end",
        justifyContent: isMe ? "flex-end" : "flex-start",
        gap: 8,
      }}
    >
      {!isMe && (
        <PersonAvatar initials={initials} color={avatarColor} size={32} />
      )}
      <View style={{ maxWidth: "74%" }}>
        <View
          style={{
            backgroundColor: isMe ? "#0F172A" : "#FFFFFF",
            borderRadius: 18,
            borderTopLeftRadius: isMe ? 18 : 4,
            borderTopRightRadius: isMe ? 4 : 18,
            paddingHorizontal: 14,
            paddingVertical: 10,
            borderWidth: isMe ? 0 : 1,
            borderColor: "#F1F5F9",
          }}
        >
          <Text
            style={{
              fontSize: 14.5,
              color: isMe ? "#FFFFFF" : "#0F172A",
              lineHeight: 22,
            }}
          >
            {message.text}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: isMe ? "flex-end" : "flex-start",
            marginTop: 4,
            gap: 4,
          }}
        >
          <Text style={{ fontSize: 11, color: "#94A3B8" }}>{message.time}</Text>
          {isMe && message.read && (
            <CheckCheck size={14} color="#16A34A" strokeWidth={2.5} />
          )}
        </View>
      </View>
    </View>
  );
}

export default function ChatDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const chat = chats.find((c) => c.id === id) ?? chats[0];
  const scrollRef = useRef<ScrollView>(null);
  const [inputText, setInputText] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const timer = setTimeout(
      () => scrollRef.current?.scrollToEnd({ animated: false }),
      150
    );
    return () => clearTimeout(timer);
  }, []);

  const QUICK_REPLIES = [
    { label: "Is it available?", icon: "dot" },
    { label: "Book viewing", icon: "calendar" },
    { label: "Price?", icon: "dollar" },
    { label: "Location?", icon: "pin" },
  ] as const;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F4F8FB" }} edges={["top"]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* Header */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 14,
            paddingVertical: 10,
            backgroundColor: "#F4F8FB",
            gap: 10,
          }}
        >
          <Pressable
            onPress={() => router.back()}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: "#FFFFFF",
              borderWidth: 1,
              borderColor: "#EDF2F7",
              alignItems: "center",
              justifyContent: "center",
              shadowColor: "#0F172A",
              shadowOpacity: 0.06,
              shadowRadius: 4,
              elevation: 2,
            }}
          >
            <ArrowLeft size={18} color="#0F172A" strokeWidth={2.5} />
          </Pressable>

          <PersonAvatar
            initials={chat.initials}
            color={chat.avatarColor}
            size={44}
            showDot={chat.online}
          />

          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
              <Text style={{ fontSize: 16, fontWeight: "700", color: "#0F172A" }}>
                {chat.name}
              </Text>
              {chat.verified && <VerifiedBadge />}
            </View>
            <Text style={{ fontSize: 12, color: "#64748B", marginTop: 1 }}>
              {chat.responseTime}
            </Text>
          </View>

          {[Phone, MoreHorizontal].map((Icon, i) => (
            <Pressable
              key={i}
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: "#FFFFFF",
                borderWidth: 1,
                borderColor: "#EDF2F7",
                alignItems: "center",
                justifyContent: "center",
                shadowColor: "#0F172A",
                shadowOpacity: 0.06,
                shadowRadius: 4,
                elevation: 2,
              }}
            >
              <Icon size={i === 0 ? 17 : 18} color="#0F172A" strokeWidth={2} />
            </Pressable>
          ))}
        </View>

        {/* Scrollable messages */}
        <ScrollView
          ref={scrollRef}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 10 }}
        >
          {/* Listing Card */}
          <View
            style={{
              marginHorizontal: 12,
              marginTop: 4,
              backgroundColor: "#FFFFFF",
              borderRadius: 20,
              borderWidth: 1,
              borderColor: "#EDF2F7",
              padding: 14,
              shadowColor: "#0F172A",
              shadowOpacity: 0.04,
              shadowRadius: 8,
              elevation: 1,
            }}
          >
            <View style={{ flexDirection: "row", gap: 12 }}>
              <Image
                source={chat.avatar}
                style={{ width: 80, height: 80, borderRadius: 12 }}
              />
              <View style={{ flex: 1 }}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                  }}
                >
                  <View
                    style={{
                      backgroundColor: "#DCFCE7",
                      paddingHorizontal: 8,
                      paddingVertical: 4,
                      borderRadius: 20,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 9.5,
                        fontWeight: "700",
                        color: "#16A34A",
                        letterSpacing: 0.6,
                      }}
                    >
                      VERIFIED LISTING
                    </Text>
                  </View>
                  <Pressable onPress={() => setSaved(!saved)}>
                    <Heart
                      size={18}
                      color={saved ? "#EF4444" : "#CBD5E1"}
                      fill={saved ? "#EF4444" : "transparent"}
                      strokeWidth={2}
                    />
                  </Pressable>
                </View>
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: "700",
                    color: "#0F172A",
                    marginTop: 5,
                    lineHeight: 20,
                  }}
                  numberOfLines={2}
                >
                  {chat.listingTitle}
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 4,
                    marginTop: 4,
                  }}
                >
                  <MapPin size={11} color="#64748B" />
                  <Text
                    style={{ fontSize: 12, color: "#64748B" }}
                    numberOfLines={1}
                  >
                    {chat.listingLocation} • {chat.listingDistance}
                  </Text>
                </View>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "800",
                    color: "#16A34A",
                    marginTop: 5,
                  }}
                >
                  {chat.listingPrice}{" "}
                  <Text
                    style={{ fontSize: 13, fontWeight: "500", color: "#94A3B8" }}
                  >
                    / month
                  </Text>
                </Text>
              </View>
            </View>

            <View style={{ flexDirection: "row", gap: 8, marginTop: 12 }}>
              <Pressable
                style={({ pressed }) => ({
                  flex: 1,
                  height: 42,
                  borderRadius: 14,
                  borderWidth: 1.5,
                  borderColor: "#E2E8F0",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: pressed ? "#F8FAFC" : "#FFFFFF",
                })}
                onPress={() => router.push(`/listing/${chat.listingId}` as any)}
              >
                <Text
                  style={{ fontSize: 13.5, fontWeight: "600", color: "#0F172A" }}
                >
                  View Listing
                </Text>
              </Pressable>
              <Pressable
                style={({ pressed }) => ({
                  flex: 1,
                  height: 42,
                  borderRadius: 14,
                  backgroundColor: pressed ? "#15803D" : "#16A34A",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                })}
              >
                <CalendarDays size={15} color="#FFFFFF" strokeWidth={2} />
                <Text
                  style={{ fontSize: 13.5, fontWeight: "700", color: "#FFFFFF" }}
                >
                  Book Viewing
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Security Banner */}
          <View
            style={{
              marginHorizontal: 12,
              marginTop: 10,
              backgroundColor: "#F0FDF4",
              borderRadius: 16,
              borderWidth: 1,
              borderColor: "#BBF7D0",
              paddingHorizontal: 14,
              paddingVertical: 12,
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
            }}
          >
            <View
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: "#DCFCE7",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Shield size={18} color="#16A34A" />
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={{ fontSize: 13, fontWeight: "700", color: "#0F172A", lineHeight: 18 }}
              >
                You're chatting securely on PataKeja
              </Text>
              <Text
                style={{ fontSize: 12, color: "#64748B", marginTop: 2, lineHeight: 17 }}
              >
                Never share personal contacts or make payments outside the app.
              </Text>
            </View>
            <Pressable style={{ flexShrink: 0 }}>
              <Text style={{ fontSize: 13, color: "#16A34A", fontWeight: "600" }}>
                Learn more
              </Text>
            </Pressable>
          </View>

          {/* Date Divider */}
          <View style={{ alignItems: "center", marginVertical: 18 }}>
            <View
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: 16,
                borderWidth: 1,
                borderColor: "#E2E8F0",
                paddingHorizontal: 16,
                paddingVertical: 5,
              }}
            >
              <Text style={{ fontSize: 12, color: "#94A3B8", fontWeight: "500" }}>
                Today
              </Text>
            </View>
          </View>

          {/* Messages */}
          {chat.messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              message={msg}
              initials={chat.initials}
              avatarColor={chat.avatarColor}
            />
          ))}
        </ScrollView>

        {/* Bottom: quick replies + input */}
        <View style={{ backgroundColor: "#F4F8FB" }}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 14,
              paddingVertical: 10,
              gap: 8,
            }}
          >
            {QUICK_REPLIES.map((chip) => (
              <Pressable
                key={chip.label}
                onPress={() => setInputText(chip.label)}
                style={({ pressed }) => ({
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 6,
                  backgroundColor: pressed ? "#F0FDF4" : "#FFFFFF",
                  borderRadius: 24,
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  borderWidth: 1,
                  borderColor: "#E2E8F0",
                })}
              >
                <ChipIcon icon={chip.icon} />
                <Text style={{ fontSize: 13, color: "#0F172A", fontWeight: "500" }}>
                  {chip.label}
                </Text>
              </Pressable>
            ))}
          </ScrollView>

          {/* Input Bar */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 14,
              paddingTop: 8,
              paddingBottom: Platform.OS === "ios" ? 16 : 12,
              backgroundColor: "#FFFFFF",
              borderTopWidth: 1,
              borderTopColor: "#F1F5F9",
              gap: 10,
            }}
          >
            <Pressable
              style={{
                width: 42,
                height: 42,
                borderRadius: 21,
                backgroundColor: "#0F172A",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Plus size={20} color="#FFFFFF" strokeWidth={2.5} />
            </Pressable>

            <View
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "#F8FAFC",
                borderRadius: 24,
                paddingHorizontal: 16,
                borderWidth: 1,
                borderColor: "#E2E8F0",
                minHeight: 44,
              }}
            >
              <TextInput
                value={inputText}
                onChangeText={setInputText}
                style={{
                  flex: 1,
                  fontSize: 15,
                  color: "#0F172A",
                  paddingVertical: 10,
                }}
                placeholder="Type a message..."
                placeholderTextColor="#94A3B8"
                multiline
              />
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 10,
                  marginLeft: 8,
                }}
              >
                <Pressable>
                  <Smile size={22} color="#94A3B8" strokeWidth={1.8} />
                </Pressable>
                <Pressable>
                  <Mic size={22} color="#94A3B8" strokeWidth={1.8} />
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
