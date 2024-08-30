import { Stack } from "expo-router";

export default function FormLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Đơn từ" }} />
      <Stack.Screen name="leave_forms/index" options={{ title: "Đơn xin nghỉ" }} />
      <Stack.Screen name="overtime_forms/index" options={{ title: "Đơn tăng ca" }} />
      <Stack.Screen name="duty_forms/index" options={{ title: "Đơn trực" }} />
    </Stack>
  );
}
