import { FontAwesome } from "@expo/vector-icons";
import {
  getFocusedRouteNameFromRoute,
  type ParamListBase,
  type RouteProp,
} from "@react-navigation/native";
import { Drawer } from "expo-router/drawer";

import { theme } from "@/app/theme";

function getActiveTabTitle(route: RouteProp<ParamListBase, string>) {
  const focusedRouteName = getFocusedRouteNameFromRoute(route) ?? "home";

  if (focusedRouteName === "chat") return "Chat";
  if (focusedRouteName === "profile") return "Profile";
  return "Home";
}

export default function DrawerLayout() {
  return (
    <Drawer
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: theme.colors.surface,
        },
        headerTintColor: theme.colors.textPrimary,
        headerTitleStyle: {
          ...theme.typography.subheading,
          color: theme.colors.textPrimary,
        },
        drawerActiveTintColor: theme.colors.secondary,
        drawerInactiveTintColor: theme.colors.textSecondary,
        drawerStyle: {
          backgroundColor: theme.colors.background,
        },
        drawerLabelStyle: {
          ...theme.typography.label,
        },
      }}
    >
      <Drawer.Screen
        name="(tabs)"
        options={({ route }) => ({
          title: getActiveTabTitle(route),
          drawerIcon: ({ color, size }) => (
            <FontAwesome color={color} name="home" size={size} />
          ),
        })}
      />
      <Drawer.Screen
        name="index"
        options={{
          title: "Drawer Info",
        }}
      />
    </Drawer>
  );
}
