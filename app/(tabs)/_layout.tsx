import Constants from "expo-constants";
import { registerExponentPushToken } from "@/api/push-noti";
import { HapticTab } from "@/components/HapticTab";
import { ROLE_CODE } from "@/constants/Misc";
import { useSession } from "@/contexts/ctx";
import { marginByRole } from "@/helper/common";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useHasRegisterEPTInCurrentLoginSession } from "@/hooks/useHasRegisterEPTInCurrentLoginSession";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { SkeletonRectangleLoader } from "@/ui/skeletons";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Octicons from "@expo/vector-icons/Octicons";
import { Redirect, Tabs, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { Platform, View } from "react-native";

export default function AppLayout() {
  const colorScheme = useColorScheme();
  const [isVerifying, setIsVerifying] = useState(true);
  const { session, isLoading, verifySessionToken, userInfo } = useSession();
  const { expoPushToken } = usePushNotifications();
  const { hasRegister, markHasRegister } = useHasRegisterEPTInCurrentLoginSession();
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

  useEffect(() => {
    if (!userInfo || !expoPushToken) return;
    if (hasRegister === null) return;
    if (hasRegister === true) return;

    registerExponentPushToken(session, { userIdentifyCard: userInfo.identifyCard, expoPushToken: expoPushToken.data });
    markHasRegister(true);
  }, [session, userInfo, expoPushToken, hasRegister]);

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
          tabBarActiveTintColor: "#0B3A82",
          tabBarButton: HapticTab,
          tabBarStyle: Platform.select({
            ios: {
              // Use a transparent background on iOS to show the blur effect
              position: "absolute",
            },
            default: {},
          }),
          headerStyle: {
            backgroundColor: "#0B3A82",
          },
          headerTitleAlign: "center",
          headerTintColor: "white",
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Trang chủ",
            tabBarIcon: ({ color }: any) => <MaterialIcons name="home" size={22} color={color} />,
            ...Platform.select({
              android: {
                headerShown: false,
              },
              ios: {
                headerShown: true,
                headerShadowVisible: false,
                headerStyle: {
                  height: Constants.statusBarHeight + 10,
                  backgroundColor: "#0B3A82",
                },
              },
            }),
          }}
        />
        <Tabs.Screen
          name="form"
          options={{
            title: "Đơn của tôi",
            tabBarIcon: ({ color }) => <Ionicons name="newspaper-sharp" size={22} color={color} />,
          }}
        />
        <Tabs.Screen
          name="timesheet"
          options={{
            title: "Quản lý công - cá nhân",
            tabBarIcon: ({ color }) => <Ionicons name="calendar" size={22} color={color} />,
            headerShown: true,
          }}
        />
        <Tabs.Screen
          name="timeKeeping"
          options={{
            title: "Quản lý công - đơn vị",
            tabBarIcon: ({ color }) => <Ionicons name="today" size={22} color={color} />,
            href: userInfo?.roleCode !== ROLE_CODE.ARCHIVIST ? null : "/timeKeeping",
          }}
        />
        <Tabs.Screen
          name="setting"
          options={{
            title: "Cài đặt",
            tabBarIcon: ({ color }) => <Ionicons name="settings" size={22} color={color} />,
            href: userInfo?.roleCode !== ROLE_CODE.ARCHIVIST ? null : "/setting",
          }}
        />
        <Tabs.Screen
          name="approveForm"
          options={{
            title: "Phê duyệt đơn",
            tabBarIcon: ({ color }) => <Octicons name="checklist" size={22} color={color} />,
            href: userInfo?.roleCode !== ROLE_CODE.TEAM_DIRECTOR ? null : "/approveForm",
          }}
        />
      </Tabs>

      <StatusBar style="light" />
    </>
  );
}
