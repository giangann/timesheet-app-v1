import { ThemedText } from "@/components/ThemedText";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

export default function Settings() {
  const router = useRouter();

  return (
    <View style={{ padding: 16 }}>
      <Text>Settings Screen Content</Text>
      <Text>Settings Screen Content</Text>

      <Pressable onPress={() => router.push("/settings/holidays")}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <ThemedText type="subtitle">Cài đặt ngày nghỉ</ThemedText>
          <ThemedText type="subtitle">{">"}</ThemedText>
        </View>
      </Pressable>

      <View>
        <Pressable onPress={() => router.push("/settings/out_of_working_time_types")}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <ThemedText type="subtitle">Cài đặt loại ngoài giờ</ThemedText>
            <ThemedText type="subtitle">{">"}</ThemedText>
          </View>
        </Pressable>
      </View>
    </View>
  );
}
