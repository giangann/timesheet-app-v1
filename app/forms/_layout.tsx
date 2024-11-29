import { EditButton } from "@/components/button";
import { NunitoText } from "@/components/text/NunitoText";
import { Stack, useRouter } from "expo-router";
import { Platform } from "react-native";

export default function FormLayout() {
  const router = useRouter();

  const customGoBackPrevNavigator = () => {
    router.navigate("/form");
  };

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
          headerLeft: Platform.OS === "ios" ? () => <EditButton isEdit={true} onToggleEdit={customGoBackPrevNavigator} /> : undefined, // Do not render on Android
        }}
      />
      <Stack.Screen name="leave_forms/[id]" options={{ title: "Chi tiết đơn xin nghỉ" }} />
      <Stack.Screen name="leave_forms/create-leave-form" options={{ title: "Tạo đơn xin nghỉ" }} />

      <Stack.Screen name="overtime_forms/index" options={{ title: "Đơn tăng ca" }} />
      <Stack.Screen name="overtime_forms/[id]" options={{ title: "Chi tiết đơn tăng ca" }} />
      <Stack.Screen name="overtime_forms/create-overtime-form" options={{ title: "Tạo đơn tăng ca" }} />

      <Stack.Screen name="duty_forms/index" options={{ title: "Đơn trực" }} />
      <Stack.Screen name="duty_forms/[id]" options={{ title: "Chi tiết đơn trực" }} />
      <Stack.Screen name="duty_forms/create-duty-form" options={{ title: "Tạo đơn trực" }} />
    </Stack>
  );
}
