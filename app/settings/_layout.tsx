import { GoBackButton } from "@/components/button";
import { NunitoText } from "@/components/text/NunitoText";
import { Stack } from "expo-router";
import { Platform } from "react-native";

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
      <Stack.Screen
        name="teams/index"
        options={{
          title: "Phòng ban",
          headerLeft: Platform.OS === "ios" ? () => <GoBackButton destRoute="/(tabs)/setting" title="Cài đặt" /> : undefined, // Do not render on Android
        }}
      />
      <Stack.Screen name="teams/add-team" options={{ title: "Thêm phòng ban" }} />
      <Stack.Screen name="teams/edit-team/[id]" options={{ title: "Chỉnh sửa phòng ban" }} />

      <Stack.Screen
        name="holidays/index"
        options={{
          title: "Ngày nghỉ",
          headerLeft: Platform.OS === "ios" ? () => <GoBackButton destRoute="/(tabs)/setting" /> : undefined, // Do not render on Android
        }}
      />
      <Stack.Screen name="holidays/add-holiday" options={{ title: "Thêm ngày nghỉ" }} />
      <Stack.Screen
        name="leave_types/index"
        options={{
          title: "Loại nghỉ",
          headerLeft: Platform.OS === "ios" ? () => <GoBackButton destRoute="/(tabs)/setting" title="Cài đặt" /> : undefined, // Do not render on Android
        }}
      />
      <Stack.Screen name="leave_types/add-leave-type" options={{ title: "Thêm loại nghỉ" }} />
      <Stack.Screen
        name="out_of_working_time_types/index"
        options={{
          title: "Loại ngoài giờ",
          headerLeft: Platform.OS === "ios" ? () => <GoBackButton destRoute="/(tabs)/setting" title="Cài đặt" /> : undefined, // Do not render on Android
        }}
      />
      <Stack.Screen name="out_of_working_time_types/add-out-of-working-time-type" options={{ title: "Thêm loại ngoài giờ" }} />

      <Stack.Screen
        name="duty_types/index"
        options={{
          title: "Loại trực",
          headerLeft: Platform.OS === "ios" ? () => <GoBackButton destRoute="/(tabs)/setting" title="Cài đặt" /> : undefined, // Do not render on Android
        }}
      />
      <Stack.Screen name="duty_types/add-duty-type" options={{ title: "Thêm loại trực" }} />
      <Stack.Screen name="duty_types/[id]" options={{ title: "Chi tiết loại trực" }} />

      <Stack.Screen
        name="exception_days/index"
        options={{
          title: "Ngày ngoại lệ",
          headerLeft: Platform.OS === "ios" ? () => <GoBackButton destRoute="/(tabs)/setting" title="Cài đặt" /> : undefined, // Do not render on Android
        }}
      />
      <Stack.Screen name="exception_days/add-exception-day" options={{ title: "Thêm ngày ngoại lệ" }} />
    </Stack>
  );
}
