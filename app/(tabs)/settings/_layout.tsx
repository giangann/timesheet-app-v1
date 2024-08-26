import { Stack } from "expo-router";

export default function SettingLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Setting" }} />
      <Stack.Screen name="holidays/index" options={{ title: "List holidays" }} />
      <Stack.Screen name="holidays/add-holiday" options={{ title: "Create new holiday" }} />
    </Stack>
  );
}
