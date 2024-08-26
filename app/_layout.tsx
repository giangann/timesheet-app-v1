import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="auth/login" />
      <Stack.Screen name="index" />
    </Stack>
  );
}
