import { Text, type TextProps, StyleSheet, TextStyle } from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";
import { UNIT_FONTSIZE } from "@/constants/Misc";

export type NunitoTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: "default" | "heading2" | "heading3" | "subtitle1" | "subtitle2" | "body1" | "body2" | "body3" | "body4" | "caption";
};

export function NunitoText({ style, lightColor = "black", darkColor = "black", type = "default", ...rest }: NunitoTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");

  return (
    <Text
      style={[
        { color },
        type === "default" ? styles.subtitle1 : undefined,
        type === "heading2" ? styles.heading2 : undefined,
        type === "heading3" ? styles.heading3 : undefined,
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

const styles = StyleSheet.create({
  default: {
    ...fontStyles,
    fontSize: 16 * UNIT_FONTSIZE,
  },
  heading2: {
    ...fontStyles,
    fontSize: 20 * UNIT_FONTSIZE,
    fontWeight: 700,
  },
  heading3: {
    ...fontStyles,
    fontSize: 16 * UNIT_FONTSIZE,
    fontWeight: "700",
  },
  subtitle1: {
    ...fontStyles,
    fontSize: 16 * UNIT_FONTSIZE,
    fontWeight: "700",
  },
  subtitle2: {
    ...fontStyles,
    fontSize: 13 * UNIT_FONTSIZE,
    fontWeight: "500",
  },
  body1: {
    ...fontStyles,
    fontSize: 16 * UNIT_FONTSIZE,
    fontWeight: "400",
  },
  body2: {
    ...fontStyles,
    fontSize: 14 * UNIT_FONTSIZE,
    fontWeight: "700",
  },
  body3: {
    ...fontStyles,
    fontSize: 14 * UNIT_FONTSIZE,
    fontWeight: "500",
  },
  body4: {
    ...fontStyles,
    fontSize: 13 * UNIT_FONTSIZE,
    fontWeight: "500",
  },
  caption: {
    ...fontStyles,
    fontSize: 10 * UNIT_FONTSIZE,
    fontWeight: "400",
  },
});
