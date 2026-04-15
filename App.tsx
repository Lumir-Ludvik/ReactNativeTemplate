import "./src/global.css";

import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from "@react-navigation/native";
import React from "react";
import { useColorScheme, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { AnimatedSplashOverlay } from "@/components/animated-icon";
import { RootNavigator } from "@/navigation/RootNavigator";
import { GluestackUIProvider } from "./components/ui/gluestack-ui-provider";

export default function App() {
  const colorScheme = useColorScheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <GluestackUIProvider mode={colorScheme === "dark" ? "dark" : "light"}>
        <NavigationContainer
          theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <View style={{ flex: 1 }}>
            <AnimatedSplashOverlay />
            <RootNavigator />
          </View>
        </NavigationContainer>
      </GluestackUIProvider>
    </GestureHandlerRootView>
  );
}
