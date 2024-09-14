import { NunitoText } from "@/components/text/NunitoText";
import { Stack } from "expo-router";

export default function TimeSheetLayout() {
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
      <Stack.Screen name="my-timesheet/index" options={{ title: "Bảng chấm công của tôi" }} />
    </Stack>
  );
}