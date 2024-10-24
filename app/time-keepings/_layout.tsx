import { NunitoText } from "@/components/text/NunitoText";
import { Stack } from "expo-router";

export default function TimeKeepingLayout() {
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
      <Stack.Screen name="today-time-keeping/index" options={{ title: "Chấm công hôm nay" }} />
      <Stack.Screen name="team-owt/index" options={{ title: "Ngoài giờ đơn vị" }} />
      <Stack.Screen name="emp-owt/index" options={{ title: "Ngoài giờ cá nhân" }} />
      <Stack.Screen name="team-timesheet/index" options={{ title: "Bảng chấm công đơn vị" }} />
    </Stack>
  );
}
