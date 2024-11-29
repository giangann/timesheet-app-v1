import { GoBackButton } from "@/components/button";
import { NunitoText } from "@/components/text/NunitoText";
import { Stack } from "expo-router";
import { Platform } from "react-native";

export default function ApproveFormLayout() {
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
          title: "Phê duyệt đơn xin nghỉ",
          headerLeft: Platform.OS === "ios" ? () => <GoBackButton destRoute="/(tabs)/approveForm" /> : undefined, // Do not render on Android
        }}
      />
      <Stack.Screen name="leave_forms/[id]" options={{ title: "Chi tiết đơn" }} />

      <Stack.Screen
        name="overtime_forms/index"
        options={{
          title: "Phê duyệt đơn tăng ca",
          headerLeft: Platform.OS === "ios" ? () => <GoBackButton destRoute="/(tabs)/approveForm" /> : undefined, // Do not render on Android
        }}
      />
      <Stack.Screen name="overtime_forms/[id]" options={{ title: "Chi tiết đơn" }} />

      <Stack.Screen
        name="duty_forms/index"
        options={{
          title: "Phê duyệt đơn trực",
          headerLeft: Platform.OS === "ios" ? () => <GoBackButton destRoute="/(tabs)/approveForm" /> : undefined, // Do not render on Android
        }}
      />
      <Stack.Screen name="duty_forms/[id]" options={{ title: "Chi tiết đơn" }} />
    </Stack>
  );
}
