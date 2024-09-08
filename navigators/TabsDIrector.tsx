import { ROLE_CODE } from "@/constants/Misc";
import { useSession } from "@/contexts/ctx";
import { AntDesign, SimpleLineIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { View } from "react-native";
export const TabsDirector = () => {
  const { userInfo } = useSession();
  return (
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
            </View>
          ),
          title: "Đơn của tôi",
        }}
      />

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
              <SimpleLineIcons name="social-twitter" size={18} color={color} />
            </View>
          ),
          title: "Phê duyệt đơn từ",
        }}
        redirect={userInfo?.roleCode !== ROLE_CODE.TEAM_DIRECTOR}
      />
    </Tabs>
  );
};
