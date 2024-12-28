import { GoBackButton } from "@/components/button";
import { NunitoText } from "@/components/text/NunitoText";
import { Stack } from "expo-router";
import { Platform } from "react-native";

export default function FormLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#0B3A82",
        },
        headerTintColor: "white",
        headerTitleAlign: "center",
        headerTitle: (props) => (
          <NunitoText type="heading3" style={{ color: props.tintColor }}>
            {props.children}
          </NunitoText>
        ),
      }}
    >
      <Stack.Screen
        name="leave_forms/index"
        options={{
          title: "Đơn xin nghỉ",
          headerLeft: Platform.OS === "ios" ? () => <GoBackButton destRoute="/(tabs)/form" title="Đơn của tôi" /> : undefined, // Do not render on Android
        }}
      />
      <Stack.Screen name="leave_forms/[id]" options={{ title: "Chi tiết đơn xin nghỉ" }} />
      <Stack.Screen name="leave_forms/create-leave-form" options={{ title: "Tạo đơn xin nghỉ" }} />

      <Stack.Screen
        name="overtime_forms/index"
        options={{
          title: "Đơn làm ngoài giờ",
          headerLeft: Platform.OS === "ios" ? () => <GoBackButton destRoute="/(tabs)/form" title="Đơn của tôi" /> : undefined, // Do not render on Android
        }}
      />
      <Stack.Screen name="overtime_forms/[id]" options={{ title: "Chi tiết đơn làm ngoài giờ" }} />
      <Stack.Screen name="overtime_forms/create-overtime-form" options={{ title: "Tạo đơn làm ngoài giờ" }} />

      <Stack.Screen
        name="duty_forms/index"
        options={{
          title: "Đơn trực",
          headerLeft: Platform.OS === "ios" ? () => <GoBackButton destRoute="/(tabs)/form" title="Đơn của tôi" /> : undefined, // Do not render on Android
        }}
      />
      <Stack.Screen name="duty_forms/[id]" options={{ title: "Chi tiết đơn trực" }} />
      <Stack.Screen name="duty_forms/create-duty-form" options={{ title: "Tạo đơn trực" }} />
    </Stack>
  );
}
