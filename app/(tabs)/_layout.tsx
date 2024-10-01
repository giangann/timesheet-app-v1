import { ROLE_CODE } from "@/constants/Misc";
import { useSession } from "@/contexts/ctx";
import { marginByRole } from "@/helper/common";
import { useColorScheme } from "@/hooks/useColorScheme";
import { SkeletonRectangleLoader } from "@/ui/skeletons";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Octicons from "@expo/vector-icons/Octicons";
import { Redirect, Tabs, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { View } from "react-native";

export default function AppLayout() {
  const colorScheme = useColorScheme();
  const [isVerifying, setIsVerifying] = useState(true);
  const { session, isLoading, verifySessionToken, userInfo } = useSession();
  const router = useRouter();

  useEffect(() => {
    async function checkIsValidSessionToken(session: string) {
      const isValidSession = await verifySessionToken(session);
      if (!isValidSession) {
        router.replace("/auth/login");
      }
      setIsVerifying(false); // Set verifying false only after session check.
    }

    if (session) {
      checkIsValidSessionToken(session);
    } else {
      setIsVerifying(false); // No session, stop verifying.
    }
  }, [session]);

  // Delay any redirects or UI changes until both loading and verification are complete
  if (isLoading || isVerifying) {
    return <SkeletonRectangleLoader overrideContainerStyles={{ height: "auto", flex: 1 }} />;
  }

  // Only redirect after checks are fully completed
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
            marginHorizontal: marginByRole(userInfo?.roleCode),
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
        {/* COMMON */}
        <Tabs.Screen
          name="index"
          options={{
            headerShown: false,
            tabBarIcon: ({ color, size, focused }) => (
              <View
                style={{
                  padding: 12,
                  borderRadius: 30,
                  backgroundColor: focused ? "white" : "#0B3A82",
                }}
              >
                <MaterialIcons name="home" size={18} color={color} />
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
                <Ionicons name="newspaper-sharp" size={18} color={color} />
              </View>
            ),
            title: "Đơn của tôi",
          }}
        />
        <Tabs.Screen
          name="timesheet"
          options={{
            tabBarIcon: ({ color, size, focused }) => (
              <View
                style={{
                  padding: 12,
                  borderRadius: 30,
                  backgroundColor: focused ? "white" : "#0B3A82",
                }}
              >
                <Ionicons name="calendar" size={18} color={color} />
              </View>
            ),
            title: "Bảng chấm công",
          }}
        />

        {/* ARCHIVIST ONLY */}
        <Tabs.Screen
          name="timeKeeping"
          options={{
            tabBarIcon: ({ color, size, focused }) => (
              <View
                style={{
                  padding: 12,
                  borderRadius: 30,
                  backgroundColor: focused ? "white" : "#0B3A82",
                }}
              >
                <Ionicons name="today" size={18} color={color} />
              </View>
            ),
            title: "Chấm công",
            href: userInfo?.roleCode !== ROLE_CODE.ARCHIVIST ? null : "/timeKeeping",
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
                <Ionicons name="settings" size={18} color={color} />
              </View>
            ),
            title: "Cài đặt",
            href: userInfo?.roleCode !== ROLE_CODE.ARCHIVIST ? null : "/setting",
          }}
        />

        {/* DIRECTOR ONLY */}
        <Tabs.Screen
          name="approveForm"
          options={{
            tabBarIcon: ({ color, size, focused }) => (
              <View
                style={{
                  padding: 12,
                  borderRadius: 30,
                  backgroundColor: focused ? "white" : "#0B3A82",
                }}
              >
                <Octicons name="checklist" size={18} color={color} />
              </View>
            ),
            title: "Phê duyệt đơn",
            href: userInfo?.roleCode !== ROLE_CODE.TEAM_DIRECTOR ? null : "/approveForm",
          }}
        />
      </Tabs>

      <StatusBar style="inverted" />
    </>
  );
}
