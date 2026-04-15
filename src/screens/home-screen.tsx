import { Button, ButtonText } from "@/../components/ui/button";
import { AnimatedIcon } from "@/components/animated-icon";
import { HintRow } from "@/components/hint-row";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { WebBadge } from "@/components/web-badge";
import { BottomTabInset, Spacing } from "@/constants/theme";
import { useAppToast } from "@/hooks/use-app-toast";
import * as Device from "expo-device";
import { Platform, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function DevMenuHint() {
  if (Platform.OS === "web") {
    return <ThemedText type="small">use browser devtools</ThemedText>;
  }
  if (Device.isDevice) {
    return (
      <ThemedText type="small">
        shake device or press <ThemedText type="code">m</ThemedText> in terminal
      </ThemedText>
    );
  }
  const shortcut = Platform.OS === "android" ? "cmd+m (or ctrl+m)" : "cmd+d";
  return (
    <ThemedText type="small">
      press <ThemedText type="code">{shortcut}</ThemedText>
    </ThemedText>
  );
}

export function HomeScreen() {
  const { show } = useAppToast();

  return (
    <ThemedView className="flex-1 flex-row justify-center">
      {/* dynamic paddingBottom (platform runtime math) cannot be expressed as a Tailwind class */}
      <SafeAreaView
        style={styles.safeArea}
        className="flex-1 items-center gap-4 px-6 max-w-[800px]"
      >
        <ThemedView className="flex-1 items-center justify-center px-6 gap-6">
          <AnimatedIcon />
          <ThemedText type="title" className="text-center">
            Welcome to&nbsp;Expo
          </ThemedText>
          <ThemedView className="flex-1 items-center justify-center">
            <ThemedText className="text-xl italic">
              Welcome to Nativewind!
            </ThemedText>
          </ThemedView>
        </ThemedView>

        <ThemedText type="code" className="uppercase">
          get started
        </ThemedText>

        <ThemedView
          type="backgroundElement"
          className="gap-4 self-stretch px-4 py-6 rounded-3xl"
        >
          <HintRow
            title="Try editing"
            hint={
              <ThemedText type="code">src/screens/home-screen.tsx</ThemedText>
            }
          />
          <HintRow title="Dev tools" hint={<DevMenuHint />} />
          <HintRow
            title="Fresh start"
            hint={<ThemedText type="code">npm run reset-project</ThemedText>}
          />
          <HintRow
            title="Polish"
            hint={<ThemedText type="code">cow.tsx</ThemedText>}
          />

          <Button
            variant="solid"
            size="md"
            action="primary"
            onPress={() =>
              show({
                title: "Give me a toast",
                description: "with squirt of lemon",
                placement: "top",
              })
            }
          >
            <ButtonText>Click me</ButtonText>
          </Button>
        </ThemedView>

        {Platform.OS === "web" && <WebBadge />}
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    paddingBottom: BottomTabInset + Spacing.three,
  },
});
