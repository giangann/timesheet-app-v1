import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { useSession } from "@/contexts/ctx";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Redirect, Tabs, useRouter } from "expo-router";
import { useEffect } from "react";
import { Text } from "react-native";

export default function AppLayout() {
  const colorScheme = useColorScheme();
  const { session, isLoading, verifySessionToken } = useSession();
  const router = useRouter();

  useEffect(() => {
    async function checkIsValidSessionToken(session: string) {
      const isValidSession = await verifySessionToken(session);
      if (!isValidSession) {
        router.replace("/auth/login");
      }
    }

    if (session) {
      checkIsValidSessionToken(session);
    }
  }, [session]);

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (!session) {
    return <Redirect href="/auth/login" />;
  }

  // This layout can be deferred because it's not the root layout.
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => <TabBarIcon name={focused ? "home" : "home-outline"} color={color} />,
        }}
      />
      <Tabs.Screen
        name="forms"
        options={{
          title: "Form",
          tabBarIcon: ({ color, focused }) => <TabBarIcon name={focused ? "code-slash" : "code-slash-outline"} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Setting",
          tabBarIcon: ({ color, focused }) => <TabBarIcon name={focused ? "settings" : "settings-outline"} color={color} />,
        }}
      />
    </Tabs>
  );
}
