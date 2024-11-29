import { GoBackButton } from "@/components/button";
import { NunitoText } from "@/components/text/NunitoText";
import { Stack } from "expo-router";
import { Platform } from "react-native";

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
      <Stack.Screen
        name="today-time-keeping/index"
        options={{
          title: "Chấm công hôm nay",
          headerLeft: Platform.OS === "ios" ? () => <GoBackButton destRoute="/(tabs)/timeKeeping" /> : undefined, // Do not render on Android
        }}
      />
      <Stack.Screen
        name="team-owt/index"
        options={{
          title: "Ngoài giờ đơn vị",

          headerLeft: Platform.OS === "ios" ? () => <GoBackButton destRoute="/(tabs)/timeKeeping" /> : undefined, // Do not render on Android
        }}
      />
      <Stack.Screen
        name="emp-owt/index"
        options={{
          title: "Ngoài giờ cá nhân",

          headerLeft: Platform.OS === "ios" ? () => <GoBackButton destRoute="/(tabs)/timeKeeping" /> : undefined, // Do not render on Android
        }}
      />
      <Stack.Screen
        name="team-timesheet/index"
        options={{
          title: "Bảng chấm công đơn vị",

          headerLeft: Platform.OS === "ios" ? () => <GoBackButton destRoute="/(tabs)/timeKeeping" /> : undefined, // Do not render on Android
        }}
      />
    </Stack>
  );
}
