import { useCounterStore } from "@/stores/counter-store";
import { Button, ButtonText } from "../../components/ui/button";
import { ThemedText } from "./themed-text";
import { ThemedView } from "./themed-view";

export default function Counter() {
  const { count, increment, decrement, reset } = useCounterStore();

  return (
    <ThemedView>
      <ThemedText>{count}</ThemedText>
      <ThemedView className="flex-row gap-1">
        <Button onPress={increment}>
          <ButtonText>+</ButtonText>
        </Button>
        <Button onPress={decrement}>
          <ButtonText>-</ButtonText>
        </Button>
        <Button onPress={reset}>
          <ButtonText>Reset</ButtonText>
        </Button>
      </ThemedView>
    </ThemedView>
  );
}
