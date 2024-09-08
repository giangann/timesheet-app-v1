import { ROLE_CODE } from "@/constants/Misc";
import { useSession } from "@/contexts/ctx";
import { useColorScheme } from "@/hooks/useColorScheme";
import { TabsArchivist } from "@/navigators/TabsArchivist";
import { TabsCommonUser } from "@/navigators/TabsCommonUser";
import { TabsDirector } from "@/navigators/TabsDIrector";
import { AntDesign, SimpleLineIcons } from "@expo/vector-icons";
import { Redirect, Tabs, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { Text, View } from "react-native";

export default function AppLayout() {
  const colorScheme = useColorScheme();
  const { session, isLoading, verifySessionToken, userInfo } = useSession();
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
  if (!userInfo) {
    return <Redirect href="/auth/login" />;
  }

  let tabs: React.ReactNode;
  const { roleCode } = userInfo;

  switch (roleCode) {
    case ROLE_CODE.ARCHIVIST:
      tabs = <TabsArchivist />;
      break;
    case ROLE_CODE.TEAM_DIRECTOR:
      tabs = <TabsDirector />;
      break;
    default:
      tabs = <TabsCommonUser />;
      break;
  }

  // This layout can be deferred because it's not the root layout.
  return (
    <>
      {tabs}
      <StatusBar style="inverted" />
    </>
  );
}
