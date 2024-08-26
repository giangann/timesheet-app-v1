import { Stack } from "expo-router";

export default function HolidayLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Holiday List" }} />
      <Stack.Screen name="holiday-add" options={{ title: "Add New Holiday" }} />
    </Stack>
  );
}
