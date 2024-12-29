import { EditButton, GoBackButton } from "@/components/button";
import { NunitoText } from "@/components/text/NunitoText";
import { TeamWeekCalendarProvider, defaultSearchParams, useTeamWeekCalendarProvider } from "@/providers";
import type { DrawerContentComponentProps } from "@react-navigation/drawer";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { useTheme } from "@react-navigation/native";
import { useRouter } from "expo-router";
import Drawer from "expo-router/drawer";
import React from "react";
import { Platform, StyleSheet, View } from "react-native";

function CustomDrawerContent(props: DrawerContentComponentProps) {
  const theme = useTheme();
  const { onUpdateSearchParams } = useTeamWeekCalendarProvider();
  const router = useRouter();

  const _onPressItem = (viewMode: string, numberOfDays: number) => {
    onUpdateSearchParams({ viewMode, numberOfDays: numberOfDays.toString() });
    props.navigation.closeDrawer();
  };

  const _onPressBackItem = () => {
    router.navigate("/(tabs)/timesheet");
  };
  const _onPressCreateNew = () => {
    router.navigate("/timesheet/week-calendar/create-week-calendar");
  };

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItem label="Chế độ ngày" onPress={() => _onPressItem("day", 1)} />
      {/* <DrawerItem label="Chế độ 3 ngày" onPress={() => _onPressItem("week", 3)} /> */}
      <DrawerItem label="Chế độ 4 ngày" onPress={() => _onPressItem("week", 4)} />
      <DrawerItem label="Chế độ tuần" onPress={() => _onPressItem("week", 7)} />
      {/* <DrawerItem label="Chế độ ngày làm việc" onPress={() => _onPressItem("week", 5)} /> */}
      {/* <DrawerItem label="Resources" onPress={() => _onPressItem("resources", 1)} /> */}
      <View style={[styles.line, { backgroundColor: theme.colors.border }]} />
      <View style={[styles.line, { backgroundColor: theme.colors.border }]} />

      <DrawerItem label="< Về trang quản lý công" onPress={_onPressBackItem} />
      <DrawerItem label="+ Tạo mới sự kiện" onPress={_onPressCreateNew} />
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  line: {
    height: 1,
  },
});

const DrawerLayout = () => {
  const router = useRouter();
  const _renderDrawer = (props: DrawerContentComponentProps) => <CustomDrawerContent {...props} />;

  return (
    <TeamWeekCalendarProvider>
      <Drawer
        screenOptions={{
          drawerType: "front",
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
        drawerContent={_renderDrawer}
      >
        <Drawer.Screen
          name="index"
          options={{
            headerShown: false,
            title: "Lịch công tác",
            headerLeft: () => <GoBackButton destRoute="/(tabs)/timesheet" customContainerStyles={{ paddingVertical: 0 }} title="Quản lý công" />, // Do not render on Android
            headerRight: () => (
              <EditButton
                isEdit={true}
                onToggleEdit={() => {
                  router.navigate("/timesheet/week-calendar/create-week-calendar");
                }}
              />
            ),
          }}
          initialParams={defaultSearchParams}
        />
        <Drawer.Screen
          name="create-week-calendar"
          options={{
            title: "Thêm sự kiện mới",
            headerLeft: () => <GoBackButton destRoute="/timesheet/week-calendar" title="Lịch công tác" />, // Do not render on Android
          }}
        />

        <Drawer.Screen
          name="[id]"
          options={{
            title: "Chi tiết lịch",
            headerLeft: () => <GoBackButton destRoute="/timesheet/week-calendar" title="Lịch công tác" />, // Do not render on Android
          }}
        />
      </Drawer>
    </TeamWeekCalendarProvider>
  );
};

export default DrawerLayout;

export const getNavOptions = () => ({ title: "Home" });
