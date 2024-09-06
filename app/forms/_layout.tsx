import { NunitoText } from "@/components/text/NunitoText";
import { Stack } from "expo-router";

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
      <Stack.Screen name="leave_forms/index" options={{ title: "Đơn xin nghỉ" }} />
      <Stack.Screen name="leave_forms/create-leave-form" options={{ title: "Tạo đơn xin nghỉ" }} />
      <Stack.Screen name="leave_forms/[id]" options={{ title: "Chi tiết đơn xin nghỉ" }} />

      <Stack.Screen name="overtime_forms/index" options={{ title: "Đơn tăng ca" }} />

      <Stack.Screen name="duty_forms/index" options={{ title: "Đơn trực" }} />
    </Stack>
  );
}
