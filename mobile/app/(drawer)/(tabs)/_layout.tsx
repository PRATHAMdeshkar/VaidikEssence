import { FontAwesome, FontAwesome6 } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";


export default function TabsLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                // headerTitleAlign: "center",
            }}
        >
            <Tabs.Screen name="home" options={{ title: "Home", tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />, }} />
            <Tabs.Screen name="chat" options={{
                title: "Chat", tabBarIcon: ({ color }) => <FontAwesome6    
                    size={25} name="robot" color={color} />,
            }} />
            <Tabs.Screen name="profile" options={{ title: "Profile", tabBarIcon: ({ color }) => <FontAwesome size={28} name="user" color={color} />, }} />
        </Tabs>
    );
}
