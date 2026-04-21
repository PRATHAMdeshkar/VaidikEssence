import { FontAwesome, FontAwesome6 } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { theme } from "@/app/theme";

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const bottomInset = Math.max(insets.bottom, theme.spacing.xs);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: theme.colors.secondary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
          height: theme.sizing.tabBarHeight + bottomInset,
          paddingTop: theme.spacing.xs,
          paddingBottom: bottomInset,
        },
        tabBarLabelStyle: {
          ...theme.typography.caption,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <FontAwesome size={theme.sizing.tabIcon} name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: "Chat",
          tabBarIcon: ({ color }) => <FontAwesome6 size={theme.sizing.tabIconCompact} name="robot" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => <FontAwesome size={theme.sizing.tabIcon} name="user" color={color} />,
        }}
      />
    </Tabs>
  );
}
