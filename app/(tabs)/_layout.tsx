import { useSession } from "@/contexts/ctx";
import { useColorScheme } from "@/hooks/useColorScheme";
import { AntDesign, SimpleLineIcons } from "@expo/vector-icons";
import { Redirect, Tabs, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { Text, View } from "react-native";

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
    <>
      <Tabs
        screenOptions={{
          tabBarStyle: {
            backgroundColor: "#0B3A82",
            position: "absolute",
            bottom: 20,
            justifyContent: "center",
            alignSelf: "center",
            height: 63,
            marginHorizontal: 80,
            paddingHorizontal: 10,
            paddingVertical: 8,
            paddingBottom: 8,
            borderRadius: 40,
            borderWidth: 1,
            borderTopWidth: 1,
            borderColor: "#0B3A82",
            borderTopColor: "#333",
          },
          tabBarShowLabel: false,
          tabBarInactiveTintColor: "white",
          tabBarActiveTintColor: "#0B3A82",

          headerTitleAlign: "center",
          headerTintColor: "white",
          headerStyle: {
            backgroundColor: "#0B3A82",
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            tabBarIcon: ({ color, size, focused }) => (
              <View
                style={{
                  padding: 12,
                  borderRadius: 30,
                  backgroundColor: focused ? "white" : "#0B3A82",
                }}
              >
                <SimpleLineIcons name="home" size={18} color={color} />
              </View>
            ),
            title: "Trang chủ",
          }}
        />
        <Tabs.Screen
          name="form"
          options={{
            tabBarIcon: ({ color, size, focused }) => (
              <View
                style={{
                  padding: 12,
                  borderRadius: 30,
                  backgroundColor: focused ? "white" : "#0B3A82",
                }}
              >
                <AntDesign name="form" size={18} color={color} />
                {/* <SimpleLineIcons name="paper-clip" size={18} color={color} /> */}
              </View>
            ),
            title: "Đơn từ",
          }}
        />
        <Tabs.Screen
          name="setting"
          options={{
            tabBarIcon: ({ color, size, focused }) => (
              <View
                style={{
                  padding: 12,
                  borderRadius: 30,
                  backgroundColor: focused ? "white" : "#0B3A82",
                }}
              >
                {/* <FontAwesome name="user-o" size={18} color={color} /> */}
                <SimpleLineIcons name="settings" size={18} color={color} />
              </View>
            ),
            title: "Cài đặt",
          }}
        />
      </Tabs>
      <StatusBar style="inverted" />
    </>
  );
}
