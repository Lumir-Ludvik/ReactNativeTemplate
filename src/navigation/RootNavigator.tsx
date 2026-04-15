import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React, { useCallback } from "react";
import { Image, StyleSheet, useColorScheme } from "react-native";

import { ExploreScreen } from "@/screens/explore-screen";
import { HomeScreen } from "@/screens/home-screen";
import { Colors } from "@/constants/theme";
import type { RootTabParamList } from "@/types/navigation";

const Tab = createBottomTabNavigator<RootTabParamList>();

export function RootNavigator() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === "dark" ? "dark" : "light"];

  const renderHomeIcon = useCallback(
    ({ color, size }: { color: string; size: number }) => (
      <Image
        source={require("@/assets/images/tabIcons/home.png")}
        style={[styles.icon, { width: size, height: size, tintColor: color }]}
      />
    ),
    [],
  );

  const renderExploreIcon = useCallback(
    ({ color, size }: { color: string; size: number }) => (
      <Image
        source={require("@/assets/images/tabIcons/explore.png")}
        style={[styles.icon, { width: size, height: size, tintColor: color }]}
      />
    ),
    [],
  );

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.backgroundElement,
        },
        tabBarActiveTintColor: colors.text,
        tabBarInactiveTintColor: colors.textSecondary,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: renderHomeIcon,
        }}
      />
      <Tab.Screen
        name="Explore"
        component={ExploreScreen}
        options={{
          tabBarLabel: "Explore",
          tabBarIcon: renderExploreIcon,
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  icon: {
    resizeMode: "contain",
  },
});
