import { NunitoText } from "@/components/text/NunitoText";
import { Stack } from "expo-router";

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
      <Stack.Screen name="leave_forms/index" options={{ title: "Phê duyệt đơn xin nghỉ" }} />

      <Stack.Screen name="overtime_forms/index" options={{ title: "Phê duyệt đơn tăng ca" }} />

      <Stack.Screen name="duty_forms/index" options={{ title: "Phê duyệt đơn trực" }} />

    </Stack>
  );
}
