import { ThemedText } from "@/components/ThemedText";
import { useRouter } from "expo-router";
import { Pressable, View } from "react-native";

export default function HolidayList() {
  const router = useRouter();
  console.log("list renderd");
  return (
    <View>
      <ThemedText type="title">Holiday List</ThemedText>
      <Pressable onPress={() => router.push("/holidays/holiday-add")}>
        <ThemedText>Create new holiday</ThemedText>
      </Pressable>
    </View>
  );
}
