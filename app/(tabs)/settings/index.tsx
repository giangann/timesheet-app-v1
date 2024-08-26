import { ThemedText } from "@/components/ThemedText";
import { useRouter } from "expo-router";
import { Pressable, View } from "react-native";

export default function Setting() {
  const router = useRouter();
  return (
    <View>
      <Pressable onPress={() => router.push("/settings/holidays")}>
        <View style={{ flex: 1, justifyContent: "space-between", alignItems: "center" }}>
          <ThemedText type="subtitle">Cài đặt ngày nghỉ</ThemedText>
          <ThemedText type="subtitle">{">"}</ThemedText>
        </View>
      </Pressable>
      <Pressable onPress={() => router.push("/settings/out_of_working_time_types")}>
        <View style={{ flex: 1, justifyContent: "space-between", alignItems: "center" }}>
          <ThemedText type="subtitle">Cài đặt loại ngoài giờ</ThemedText>
          <ThemedText type="subtitle">{">"}</ThemedText>
        </View>
      </Pressable>
    </View>
  );
}
