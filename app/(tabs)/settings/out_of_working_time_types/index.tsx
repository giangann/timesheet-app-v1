import { ThemedText } from "@/components/ThemedText";
import { useRouter } from "expo-router";
import { Pressable, View } from "react-native";

export default function HolidayList() {
  const router = useRouter();
  console.log("list renderd");
  return (
    <View>
      <ThemedText type="title">Các loại ngoài giờ</ThemedText>
      <Pressable onPress={() => router.push("/settings/out_of_working_time_types/add-out-of-working-time-type")}>
        <ThemedText>Thêm loại ngoài giờ</ThemedText>
      </Pressable>
    </View>
  );
}
