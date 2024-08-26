import { ThemedText } from "@/components/ThemedText";
import { useRouter } from "expo-router";
import { Pressable, View } from "react-native";

export default function Setting() {
  const router = useRouter();
  return (
    <View>
      <Pressable onPress={() => router.push("/settings/holidays/")}>
        <View style={{ flex: 1, justifyContent: "space-between", alignItems: "center" }}>
          <ThemedText type="subtitle">Cài đặt ngày nghỉ</ThemedText>
          <ThemedText type="subtitle">{">"}</ThemedText>
        </View>
      </Pressable>
    </View>
  );
}
