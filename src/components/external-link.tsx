import {
  openBrowserAsync,
  WebBrowserPresentationStyle,
} from "expo-web-browser";
import { type ComponentProps } from "react";
import { Platform, Pressable } from "react-native";

type Props = ComponentProps<typeof Pressable> & {
  href: string;
};

export function ExternalLink({ href, onPress, children, ...rest }: Props) {
  return (
    <Pressable
      {...rest}
      onPress={async (event) => {
        onPress?.(event);
        if (Platform.OS === "web") {
          window.open(href, "_blank", "noopener,noreferrer");
        } else {
          await openBrowserAsync(href, {
            presentationStyle: WebBrowserPresentationStyle.AUTOMATIC,
          });
        }
      }}
    >
      {children}
    </Pressable>
  );
}
