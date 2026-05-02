import { Text, View } from "react-native";
import { router } from "expo-router";
import { Bookmark } from "lucide-react-native";
import { listings } from "@/data/mockListings";
import { ListingCard } from "@/components/cards/ListingCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { FloatingHeader } from "@/components/layout/FloatingHeader";
import { ScreenContainer } from "@/components/layout/ScreenContainer";

export default function SavedHomesScreen() {
  const saved = listings.filter((listing) => listing.saved);

  return (
    <ScreenContainer contentClassName="pt-2">
      <FloatingHeader title="Saved Homes" subtitle="Homes you want to revisit" />
      {saved.length ? (
        <View className="gap-4">
          {saved.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </View>
      ) : (
        <EmptyState
          title="No saved homes yet"
          message="Save verified homes while browsing and compare them later."
          actionLabel="Explore Homes"
          onAction={() => router.push("/tabs/explore")}
          icon={<Bookmark color="#16A34A" size={30} />}
        />
      )}
      <Text className="mt-5 text-center text-sm text-navy/50">Saved homes are private to your account.</Text>
    </ScreenContainer>
  );
}
