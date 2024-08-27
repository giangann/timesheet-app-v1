import { Text, type TextProps, StyleSheet, TextStyle } from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";

export type NunitoTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: "default" | "heading3" | "subtitle1" | "subtitle2" | "body1" | "body2" | "body3" | "body4" | "caption";
};

export function NunitoText({ style, lightColor, darkColor, type = "default", ...rest }: NunitoTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");

  return (
    <Text
      style={[
        { color },
        type === "default" ? styles.subtitle1 : undefined,
        type === "heading3" ? styles.subtitle1 : undefined,
        type === "subtitle1" ? styles.subtitle1 : undefined,
        type === "subtitle2" ? styles.subtitle2 : undefined,
        type === "body1" ? styles.body1 : undefined,
        type === "body2" ? styles.body2 : undefined,
        type === "body3" ? styles.body3 : undefined,
        type === "body4" ? styles.body4 : undefined,
        type === "caption" ? styles.caption : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const fontStyles: TextStyle = {
  fontFamily: "Nunito",
};

const unit = 1.125;

const styles = StyleSheet.create({
  default: {
    ...fontStyles,
    fontSize: 16 * unit,
  },
  heading3: {
    ...fontStyles,
    fontSize: 16 * unit,
    fontWeight: "700",
  },
  subtitle1: {
    ...fontStyles,
    fontSize: 16 * unit,
    fontWeight: "700",
  },
  subtitle2: {
    ...fontStyles,
    fontSize: 13 * unit,
    fontWeight: "500",
  },
  body1: {
    ...fontStyles,
    fontSize: 16 * unit,
    fontWeight: "400",
  },
  body2: {
    ...fontStyles,
    fontSize: 14 * unit,
    fontWeight: "700",
  },
  body3: {
    ...fontStyles,
    fontSize: 14 * unit,
    fontWeight: "500",
  },
  body4: {
    ...fontStyles,
    fontSize: 13 * unit,
    fontWeight: "500",
  },
  caption: {
    ...fontStyles,
    fontSize: 10 * unit,
    fontWeight: "400",
  },
});
