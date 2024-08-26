import { ThemedText } from "@/components/ThemedText";
import { useRouter } from "expo-router";
import { Pressable, View } from "react-native";

export default function HolidayList() {
  const router = useRouter();
  console.log("list renderd");
  return (
    <View>
      <ThemedText type="title">Holiday List</ThemedText>
      <Pressable onPress={() => router.push("/settings/holidays/add-holiday")}>
        <ThemedText>Create new holiday</ThemedText>
      </Pressable>
    </View>
  );
}
