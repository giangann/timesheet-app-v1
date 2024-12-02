import { EditButton, GoBackButton } from "@/components/button";
import { NunitoText } from "@/components/text/NunitoText";
import { Stack, useRouter } from "expo-router";
import { Platform } from "react-native";

export default function TimeSheetLayout() {
  const router = useRouter();

  const customGoBackWeekCalendar = () => {
    router.navigate("/timesheet");
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
        name="my-timesheet/index"
        options={{
          title: "Bảng chấm công của tôi",
          headerLeft: Platform.OS === "ios" ? () => <GoBackButton destRoute="/(tabs)/timesheet" /> : undefined, // Do not render on Android
        }}
      />
      <Stack.Screen
        name="my-emp-owt/index"
        options={{
          title: "Bảng ngoài giờ của tôi",
          headerLeft: Platform.OS === "ios" ? () => <GoBackButton destRoute="/(tabs)/timesheet" /> : undefined, // Do not render on Android
        }}
      />
      <Stack.Screen
        name="week-calendar"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
