import { NunitoText } from "@/components/text/NunitoText";
import { Stack } from "expo-router";

export default function SettingLayout() {
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
      <Stack.Screen name="teams/index" options={{ title: "Phòng ban" }} />
      <Stack.Screen name="teams/add-team" options={{ title: "Thêm phòng ban" }} />
      <Stack.Screen name="holidays/index" options={{ title: "Ngày nghỉ" }} />
      <Stack.Screen name="holidays/add-holiday" options={{ title: "Thêm ngày nghỉ" }} />
      <Stack.Screen name="leave_types/index" options={{ title: "Loại nghỉ" }} />
      <Stack.Screen name="leave_types/add-leave-type" options={{ title: "Thêm loại nghỉ" }} />
      <Stack.Screen name="out_of_working_time_types/index" options={{ title: "Loại ngoài giờ" }} />
      <Stack.Screen name="out_of_working_time_types/add-out-of-working-time-type" options={{ title: "Thêm loại ngoài giờ" }} />

      <Stack.Screen name="duty_types/index" options={{ title: "Loại trực" }} />
      <Stack.Screen name="duty_types/add-duty-type" options={{ title: "Thêm loại trực" }} />
      <Stack.Screen name="duty_types/[id]" options={{ title: "Chi tiết loại trực" }} />
    </Stack>
  );
}
