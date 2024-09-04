import { Stack } from "expo-router";

export default function FormLayout() {
  return (
    <Stack>
      <Stack.Screen name="leave_forms/index" options={{ title: "Đơn xin nghỉ" }} />
      <Stack.Screen name="leave_forms/create-leave-form" options={{ title: "Tạo đơn xin nghỉ" }} />
      <Stack.Screen name="leave_forms/[id]" options={{ title: "Chi tiết đơn xin nghỉ" }} />


      <Stack.Screen name="overtime_forms/index" options={{ title: "Đơn tăng ca" }} />
      
      <Stack.Screen name="duty_forms/index" options={{ title: "Đơn trực" }} />
    </Stack>
  );
}
