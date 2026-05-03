import React, { useRef, useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import {
  ArrowLeft,
  Check,
  MapPin,
  CalendarDays,
  Heart,
  CheckCheck,
  Shield,
  Smile,
  Mic,
  Plus,
  DollarSign,
  Send,
  PhoneOff,
  PhoneCall,
  Flag,
  Ban,
  Trash2,
  UserCircle,
  ChevronRight,
  MoreHorizontal,
} from "lucide-react-native";
import { chats, ChatMessage } from "@/data/mockChats";

// ── Helpers ──────────────────────────────────────────────────────

function ChipIcon({ icon }: { icon: string }) {
  if (icon === "dot") return <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: "#16A34A" }} />;
  if (icon === "calendar") return <CalendarDays size={13} color="#64748B" strokeWidth={2} />;
  if (icon === "dollar") return <DollarSign size={13} color="#64748B" strokeWidth={2} />;
  if (icon === "pin") return <MapPin size={13} color="#64748B" strokeWidth={2} />;
  return null;
}

function VerifiedBadge() {
  return (
    <View style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: "#16A34A", alignItems: "center", justifyContent: "center" }}>
      <Check color="white" size={10} strokeWidth={3} />
    </View>
  );
}

function PersonAvatar({
  initials, color, size = 44, showDot,
}: {
  initials: string; color: string; size?: number; showDot?: boolean;
}) {
  return (
    <View style={{ position: "relative" }}>
      <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: color, alignItems: "center", justifyContent: "center" }}>
        <Text style={{ color: "white", fontSize: size * 0.34, fontWeight: "700", letterSpacing: 0.5 }}>{initials}</Text>
      </View>
      {showDot && (
        <View style={{ position: "absolute", bottom: 1, right: 1, width: 12, height: 12, borderRadius: 6, backgroundColor: "#16A34A", borderWidth: 2, borderColor: "#FFFFFF" }} />
      )}
    </View>
  );
}

// ── Message Bubble ────────────────────────────────────────────────

function MessageBubble({
  message, initials, avatarColor,
}: {
  message: ChatMessage & { isVoice?: boolean; duration?: string };
  initials: string;
  avatarColor: string;
}) {
  const isMe = message.from === "me";

  if (message.timeSlots) {
    return (
      <View style={{ marginHorizontal: 14, marginBottom: 10, flexDirection: "row", alignItems: "flex-start", gap: 8 }}>
        <PersonAvatar initials={initials} color={avatarColor} size={32} />
        <View style={{ maxWidth: "80%" }}>
          {message.slotsLabel && (
            <View style={{ backgroundColor: "#FFFFFF", borderRadius: 18, borderTopLeftRadius: 4, paddingHorizontal: 14, paddingVertical: 10, marginBottom: 8, borderWidth: 1, borderColor: "#F1F5F9" }}>
              <Text style={{ fontSize: 14, fontWeight: "600", color: "#0F172A", lineHeight: 20 }}>{message.slotsLabel}</Text>
            </View>
          )}
          {message.timeSlots!.map((slot) => (
            <Pressable key={slot.id} style={({ pressed }) => ({ flexDirection: "row", alignItems: "center", gap: 10, backgroundColor: pressed ? "#F0FDF4" : "#FFFFFF", borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12, marginBottom: 6, borderWidth: 1, borderColor: "#E2E8F0" })}>
              <CalendarDays size={16} color="#16A34A" strokeWidth={2} />
              <Text style={{ fontSize: 14, fontWeight: "600", color: "#0F172A" }}>{slot.date} – {slot.time}</Text>
            </Pressable>
          ))}
          <Text style={{ fontSize: 11, color: "#94A3B8", marginTop: 2 }}>{message.time}</Text>
        </View>
      </View>
    );
  }

  if (message.isVoice) {
    return (
      <View style={{ marginHorizontal: 14, marginBottom: 8, flexDirection: "row", alignItems: "flex-end", justifyContent: isMe ? "flex-end" : "flex-start", gap: 8 }}>
        {!isMe && <PersonAvatar initials={initials} color={avatarColor} size={32} />}
        <View style={{ maxWidth: "60%" }}>
          <View style={{ backgroundColor: isMe ? "#0F172A" : "#FFFFFF", borderRadius: 18, borderTopLeftRadius: isMe ? 18 : 4, borderTopRightRadius: isMe ? 4 : 18, paddingHorizontal: 14, paddingVertical: 12, borderWidth: isMe ? 0 : 1, borderColor: "#F1F5F9", flexDirection: "row", alignItems: "center", gap: 10 }}>
            <Mic size={16} color={isMe ? "#FFFFFF" : "#16A34A"} strokeWidth={2} />
            <View style={{ flex: 1, height: 3, backgroundColor: isMe ? "rgba(255,255,255,0.2)" : "#E2E8F0", borderRadius: 2 }}>
              <View style={{ width: "60%", height: "100%", backgroundColor: "#16A34A", borderRadius: 2 }} />
            </View>
            <Text style={{ fontSize: 11.5, color: isMe ? "rgba(255,255,255,0.7)" : "#94A3B8" }}>{message.duration ?? "0:08"}</Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: isMe ? "flex-end" : "flex-start", marginTop: 4, gap: 4 }}>
            <Text style={{ fontSize: 11, color: "#94A3B8" }}>{message.time}</Text>
            {isMe && message.read && <CheckCheck size={14} color="#16A34A" strokeWidth={2.5} />}
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={{ marginHorizontal: 14, marginBottom: 8, flexDirection: "row", alignItems: "flex-end", justifyContent: isMe ? "flex-end" : "flex-start", gap: 8 }}>
      {!isMe && <PersonAvatar initials={initials} color={avatarColor} size={32} />}
      <View style={{ maxWidth: "74%" }}>
        <View style={{ backgroundColor: isMe ? "#0F172A" : "#FFFFFF", borderRadius: 18, borderTopLeftRadius: isMe ? 18 : 4, borderTopRightRadius: isMe ? 4 : 18, paddingHorizontal: 14, paddingVertical: 10, borderWidth: isMe ? 0 : 1, borderColor: "#F1F5F9" }}>
          <Text style={{ fontSize: 14.5, color: isMe ? "#FFFFFF" : "#0F172A", lineHeight: 22 }}>{message.text}</Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: isMe ? "flex-end" : "flex-start", marginTop: 4, gap: 4 }}>
          <Text style={{ fontSize: 11, color: "#94A3B8" }}>{message.time}</Text>
          {isMe && message.read && <CheckCheck size={14} color="#16A34A" strokeWidth={2.5} />}
        </View>
      </View>
    </View>
  );
}

// ── Emoji Picker ──────────────────────────────────────────────────

const EMOJIS = [
  "😊","😂","🤩","❤️","🙏","👍","🔥","✅",
  "🏠","💯","😍","🤔","👋","😅","🎉","💪",
  "😭","🥺","🙄","😎","🤝","💰","📍","⭐",
];

function EmojiPicker({ visible, onSelect }: { visible: boolean; onSelect: (e: string) => void }) {
  if (!visible) return null;
  return (
    <View style={{ backgroundColor: "#FFFFFF", borderTopWidth: 1, borderTopColor: "#F1F5F9", paddingVertical: 12, paddingHorizontal: 8 }}>
      <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
        {EMOJIS.map((e) => (
          <Pressable key={e} onPress={() => onSelect(e)} style={({ pressed }) => ({ width: "12.5%", aspectRatio: 1, alignItems: "center", justifyContent: "center", backgroundColor: pressed ? "#F4F8FB" : "transparent", borderRadius: 12 })}>
            <Text style={{ fontSize: 26 }}>{e}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

// ── Call Modal ────────────────────────────────────────────────────

function CallModal({ visible, name, initials, color, onEnd }: { visible: boolean; name: string; initials: string; color: string; onEnd: () => void }) {
  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen">
      <View style={{ flex: 1, backgroundColor: "#0F172A", alignItems: "center", justifyContent: "center", gap: 24 }}>
        <Text style={{ color: "#475569", fontSize: 15, letterSpacing: 0.5 }}>PataKeja Secure Call</Text>
        <PersonAvatar initials={initials} color={color} size={100} />
        <View style={{ alignItems: "center", gap: 8 }}>
          <Text style={{ color: "#FFFFFF", fontSize: 28, fontWeight: "800", letterSpacing: -0.5 }}>{name}</Text>
          <Text style={{ color: "#16A34A", fontSize: 15, fontWeight: "600" }}>Calling…</Text>
        </View>
        <Pressable
          onPress={onEnd}
          style={({ pressed }) => ({
            marginTop: 32,
            width: 72, height: 72, borderRadius: 36,
            backgroundColor: pressed ? "#B91C1C" : "#EF4444",
            alignItems: "center", justifyContent: "center",
            shadowColor: "#EF4444", shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.4, shadowRadius: 16, elevation: 8,
          })}
        >
          <PhoneOff size={28} color="#FFFFFF" strokeWidth={2} />
        </Pressable>
        <Text style={{ color: "#475569", fontSize: 13 }}>Tap to end call</Text>
      </View>
    </Modal>
  );
}

// ── Menu Sheet ────────────────────────────────────────────────────

type MenuProps = {
  visible: boolean; onClose: () => void;
  onViewProfile: () => void; onReport: () => void;
  onBlock: () => void; onClear: () => void;
};

function MenuSheet({ visible, onClose, onViewProfile, onReport, onBlock, onClear }: MenuProps) {
  const items = [
    { Icon: UserCircle, label: "View Profile", color: "#0F172A", action: onViewProfile },
    { Icon: Flag,       label: "Report User",  color: "#F59E0B", action: onReport },
    { Icon: Ban,        label: "Block User",   color: "#EF4444", action: onBlock },
    { Icon: Trash2,     label: "Clear Chat",   color: "#EF4444", action: onClear },
  ];
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={{ flex: 1, backgroundColor: "rgba(15,23,42,0.45)" }} onPress={onClose}>
        <View style={{ flex: 1 }} />
        <View style={{ backgroundColor: "#FFFFFF", borderTopLeftRadius: 28, borderTopRightRadius: 28, paddingBottom: 36, paddingTop: 10 }}>
          <View style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: "#E2E8F0", alignSelf: "center", marginBottom: 18 }} />
          {items.map(({ Icon, label, color, action }, i) => (
            <Pressable
              key={label}
              onPress={() => { onClose(); setTimeout(action, 200); }}
              style={({ pressed }) => ({ flexDirection: "row", alignItems: "center", gap: 14, paddingHorizontal: 24, paddingVertical: 16, backgroundColor: pressed ? "#F8FAFC" : "#FFFFFF", borderTopWidth: i === 0 ? 0 : 1, borderTopColor: "#F8FAFC" })}
            >
              <View style={{ width: 46, height: 46, borderRadius: 23, backgroundColor: `${color}18`, alignItems: "center", justifyContent: "center" }}>
                <Icon size={21} color={color} strokeWidth={2} />
              </View>
              <Text style={{ fontSize: 16, fontWeight: "600", color, flex: 1 }}>{label}</Text>
              <ChevronRight size={18} color="#CBD5E1" strokeWidth={2} />
            </Pressable>
          ))}
        </View>
      </Pressable>
    </Modal>
  );
}

// ── Main Screen ───────────────────────────────────────────────────

export default function ChatDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const chat = chats.find((c) => c.id === id) ?? chats[0];

  const scrollRef = useRef<ScrollView>(null);
  const [messages, setMessages] = useState<(ChatMessage & { isVoice?: boolean; duration?: string })[]>(chat.messages as any);
  const [inputText, setInputText] = useState("");
  const [saved, setSaved] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [showCall, setShowCall] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [recording, setRecording] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => scrollRef.current?.scrollToEnd({ animated: false }), 150);
    return () => clearTimeout(t);
  }, []);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 80);
  }, []);

  const now = () => {
    const d = new Date();
    const h = d.getHours();
    const m = d.getMinutes();
    const ampm = h >= 12 ? "PM" : "AM";
    return `${h % 12 || 12}:${m.toString().padStart(2, "0")} ${ampm}`;
  };

  const sendMessage = () => {
    const text = inputText.trim();
    if (!text) return;
    const msg: ChatMessage = { id: `m${Date.now()}`, from: "me", text, time: now(), read: false };
    setMessages((prev) => [...prev, msg]);
    setInputText("");
    setShowEmoji(false);
    scrollToBottom();
  };

  const sendVoice = () => {
    const msg = { id: `m${Date.now()}`, from: "me" as const, time: now(), read: false, isVoice: true, duration: "0:08" };
    setMessages((prev) => [...prev, msg]);
    setRecording(false);
    scrollToBottom();
  };

  const QUICK_REPLIES = [
    { label: "Is it available?", icon: "dot" },
    { label: "Book viewing",     icon: "calendar" },
    { label: "Price?",           icon: "dollar" },
    { label: "Location?",        icon: "pin" },
  ] as const;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F4F8FB" }} edges={["top"]}>
      <CallModal
        visible={showCall} name={chat.name} initials={chat.initials}
        color={chat.avatarColor} onEnd={() => setShowCall(false)}
      />
      <MenuSheet
        visible={showMenu} onClose={() => setShowMenu(false)}
        onViewProfile={() => router.push(`/chat/profile/${chat.userId}?chatId=${chat.id}` as any)}
        onReport={() => router.push("/safety/report" as any)}
        onBlock={() => Alert.alert("User Blocked", `${chat.name} has been blocked.`)}
        onClear={() => { setMessages([]); Alert.alert("Chat Cleared", "Your chat history has been cleared."); }}
      />

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>

        {/* ── Header ── */}
        <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 14, paddingVertical: 10, backgroundColor: "#FFFFFF", borderBottomWidth: 1, borderBottomColor: "#F1F5F9", gap: 10 }}>
          <Pressable onPress={() => router.back()} style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: "#F4F8FB", alignItems: "center", justifyContent: "center" }}>
            <ArrowLeft size={18} color="#0F172A" strokeWidth={2.5} />
          </Pressable>

          <Pressable
            onPress={() => router.push(`/chat/profile/${chat.userId}?chatId=${chat.id}` as any)}
            style={{ flexDirection: "row", alignItems: "center", flex: 1, gap: 10 }}
          >
            <PersonAvatar initials={chat.initials} color={chat.avatarColor} size={42} showDot={chat.online} />
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                <Text style={{ fontSize: 16, fontWeight: "700", color: "#0F172A" }}>{chat.name}</Text>
                {chat.verified && <VerifiedBadge />}
              </View>
              <Text style={{ fontSize: 12, color: chat.online ? "#16A34A" : "#64748B", marginTop: 1, fontWeight: chat.online ? "600" : "400" }}>
                {chat.online ? "Online now" : chat.responseTime}
              </Text>
            </View>
          </Pressable>

          <Pressable onPress={() => setShowCall(true)} style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: "#F4F8FB", alignItems: "center", justifyContent: "center" }}>
            <PhoneCall size={18} color="#0F172A" strokeWidth={2} />
          </Pressable>
          <Pressable onPress={() => setShowMenu(true)} style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: "#F4F8FB", alignItems: "center", justifyContent: "center" }}>
            <MoreHorizontal size={18} color="#0F172A" strokeWidth={2} />
          </Pressable>
        </View>

        {/* ── Messages ScrollView ── */}
        <ScrollView ref={scrollRef} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 10 }}>

          {/* Listing Card */}
          <View style={{ marginHorizontal: 12, marginTop: 12, backgroundColor: "#FFFFFF", borderRadius: 20, borderWidth: 1, borderColor: "#EDF2F7", padding: 14, shadowColor: "#0F172A", shadowOpacity: 0.04, shadowRadius: 8, elevation: 1 }}>
            <View style={{ flexDirection: "row", gap: 12 }}>
              <Image source={chat.avatar} style={{ width: 80, height: 80, borderRadius: 12 }} />
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between" }}>
                  <View style={{ backgroundColor: "#DCFCE7", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 20 }}>
                    <Text style={{ fontSize: 9.5, fontWeight: "700", color: "#16A34A", letterSpacing: 0.6 }}>VERIFIED LISTING</Text>
                  </View>
                  <Pressable onPress={() => setSaved(!saved)}>
                    <Heart size={18} color={saved ? "#EF4444" : "#CBD5E1"} fill={saved ? "#EF4444" : "transparent"} strokeWidth={2} />
                  </Pressable>
                </View>
                <Text style={{ fontSize: 15, fontWeight: "700", color: "#0F172A", marginTop: 5, lineHeight: 20 }} numberOfLines={2}>{chat.listingTitle}</Text>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginTop: 4 }}>
                  <MapPin size={11} color="#64748B" />
                  <Text style={{ fontSize: 12, color: "#64748B" }} numberOfLines={1}>{chat.listingLocation} • {chat.listingDistance}</Text>
                </View>
                <Text style={{ fontSize: 18, fontWeight: "800", color: "#16A34A", marginTop: 5 }}>
                  {chat.listingPrice}{" "}
                  <Text style={{ fontSize: 13, fontWeight: "500", color: "#94A3B8" }}>/ month</Text>
                </Text>
              </View>
            </View>
            <View style={{ flexDirection: "row", gap: 8, marginTop: 12 }}>
              <Pressable
                style={({ pressed }) => ({ flex: 1, height: 42, borderRadius: 14, borderWidth: 1.5, borderColor: "#E2E8F0", alignItems: "center", justifyContent: "center", backgroundColor: pressed ? "#F8FAFC" : "#FFFFFF" })}
                onPress={() => router.push(`/listing/${chat.listingId}` as any)}
              >
                <Text style={{ fontSize: 13.5, fontWeight: "600", color: "#0F172A" }}>View Listing</Text>
              </Pressable>
              <Pressable style={({ pressed }) => ({ flex: 1, height: 42, borderRadius: 14, backgroundColor: pressed ? "#15803D" : "#16A34A", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6 })}>
                <CalendarDays size={15} color="#FFFFFF" strokeWidth={2} />
                <Text style={{ fontSize: 13.5, fontWeight: "700", color: "#FFFFFF" }}>Book Viewing</Text>
              </Pressable>
            </View>
          </View>

          {/* Security Banner */}
          <View style={{ marginHorizontal: 12, marginTop: 10, backgroundColor: "#F0FDF4", borderRadius: 16, borderWidth: 1, borderColor: "#BBF7D0", paddingHorizontal: 14, paddingVertical: 12, flexDirection: "row", alignItems: "center", gap: 10 }}>
            <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: "#DCFCE7", alignItems: "center", justifyContent: "center" }}>
              <Shield size={18} color="#16A34A" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 13, fontWeight: "700", color: "#0F172A", lineHeight: 18 }}>You are chatting securely on PataKeja</Text>
              <Text style={{ fontSize: 12, color: "#64748B", marginTop: 2, lineHeight: 17 }}>Never share contacts or make payments outside the app.</Text>
            </View>
          </View>

          {/* Date Divider */}
          <View style={{ alignItems: "center", marginVertical: 18 }}>
            <View style={{ backgroundColor: "#FFFFFF", borderRadius: 16, borderWidth: 1, borderColor: "#E2E8F0", paddingHorizontal: 16, paddingVertical: 5 }}>
              <Text style={{ fontSize: 12, color: "#94A3B8", fontWeight: "500" }}>Today</Text>
            </View>
          </View>

          {/* Messages */}
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} initials={chat.initials} avatarColor={chat.avatarColor} />
          ))}
        </ScrollView>

        {/* ── Bottom Bar ── */}
        <View style={{ backgroundColor: "#FFFFFF" }}>

          {/* Quick replies — only when emoji picker is hidden */}
          {!showEmoji && !recording && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 14, paddingVertical: 8, gap: 8 }}>
              {QUICK_REPLIES.map((chip) => (
                <Pressable
                  key={chip.label}
                  onPress={() => setInputText(chip.label)}
                  style={({ pressed }) => ({ flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: pressed ? "#F0FDF4" : "#F8FAFC", borderRadius: 24, paddingHorizontal: 12, paddingVertical: 8, borderWidth: 1, borderColor: "#E2E8F0" })}
                >
                  <ChipIcon icon={chip.icon} />
                  <Text style={{ fontSize: 13, color: "#0F172A", fontWeight: "500" }}>{chip.label}</Text>
                </Pressable>
              ))}
            </ScrollView>
          )}

          {/* Emoji Grid */}
          <EmojiPicker visible={showEmoji} onSelect={(e) => setInputText((t) => t + e)} />

          {/* Input Bar */}
          <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 14, paddingTop: 8, paddingBottom: Platform.OS === "ios" ? 20 : 14, borderTopWidth: 1, borderTopColor: "#F1F5F9", gap: 8 }}>
            <Pressable style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: "#0F172A", alignItems: "center", justifyContent: "center" }}>
              <Plus size={20} color="#FFFFFF" strokeWidth={2.5} />
            </Pressable>

            <View style={{ flex: 1, flexDirection: "row", alignItems: "center", backgroundColor: "#F8FAFC", borderRadius: 24, paddingHorizontal: 14, borderWidth: 1, borderColor: "#E2E8F0", minHeight: 44 }}>
              {recording ? (
                <View style={{ flex: 1, flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 10 }}>
                  <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: "#EF4444" }} />
                  <Text style={{ fontSize: 14, color: "#EF4444", fontWeight: "700" }}>Recording…</Text>
                  <Text style={{ fontSize: 13, color: "#94A3B8" }}>Release to send</Text>
                </View>
              ) : (
                <TextInput
                  value={inputText}
                  onChangeText={setInputText}
                  onFocus={() => setShowEmoji(false)}
                  style={{ flex: 1, fontSize: 15, color: "#0F172A", paddingVertical: 10 }}
                  placeholder="Type a message..."
                  placeholderTextColor="#94A3B8"
                  multiline
                />
              )}
              <Pressable onPress={() => setShowEmoji((v) => !v)} style={{ marginLeft: 8 }}>
                <Smile size={22} color={showEmoji ? "#16A34A" : "#94A3B8"} strokeWidth={1.8} />
              </Pressable>
            </View>

            {/* Send button (green) when text exists, otherwise Mic (hold to record) */}
            {inputText.trim().length > 0 ? (
              <Pressable
                onPress={sendMessage}
                style={({ pressed }) => ({
                  width: 44, height: 44, borderRadius: 22,
                  backgroundColor: pressed ? "#15803D" : "#16A34A",
                  alignItems: "center", justifyContent: "center",
                  shadowColor: "#16A34A", shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
                })}
              >
                <Send size={18} color="#FFFFFF" strokeWidth={2.5} />
              </Pressable>
            ) : (
              <Pressable
                onPressIn={() => setRecording(true)}
                onPressOut={sendVoice}
                style={({ pressed }) => ({
                  width: 44, height: 44, borderRadius: 22,
                  backgroundColor: recording ? "#EF4444" : pressed ? "#334155" : "#0F172A",
                  alignItems: "center", justifyContent: "center",
                })}
              >
                <Mic size={18} color="#FFFFFF" strokeWidth={2} />
              </Pressable>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
