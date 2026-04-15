import { Platform, StyleSheet, type TextProps } from "react-native";

import { Fonts, ThemeColor } from "@/constants/theme";
import { Heading } from "../../components/ui/heading";
import { Text } from "../../components/ui/text";

export type ThemedTextProps = TextProps & {
  type?:
    | "default"
    | "title"
    | "small"
    | "smallBold"
    | "subtitle"
    | "link"
    | "linkPrimary"
    | "code";
  themeColor?: ThemeColor;
};

export function ThemedText({
  style,
  type = "default",
  themeColor,
  ...rest
}: ThemedTextProps) {
  return (
    <>
      {type === "title" ? (
        <Heading bold={true} size="4xl" {...rest}></Heading>
      ) : (
        <Text
          style={[
            type === "default" && styles.default,
            type === "small" && styles.small,
            type === "smallBold" && styles.smallBold,
            type === "subtitle" && styles.subtitle,
            type === "link" && styles.link,
            type === "linkPrimary" && styles.linkPrimary,
            type === "code" && styles.code,
            style,
          ]}
          {...rest}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  small: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: 500,
  },
  smallBold: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: 700,
  },
  default: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: 500,
  },
  subtitle: {
    fontSize: 32,
    lineHeight: 44,
    fontWeight: 600,
  },
  link: {
    lineHeight: 30,
    fontSize: 14,
  },
  linkPrimary: {
    lineHeight: 30,
    fontSize: 14,
    color: "#3c87f7",
  },
  code: {
    fontFamily: Fonts.mono,
    fontWeight: Platform.select({ android: 700 }) ?? 500,
    fontSize: 12,
  },
});
