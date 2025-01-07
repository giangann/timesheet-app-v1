import React, { memo } from "react";
import { GestureResponderEvent, StyleSheet, ViewStyle } from "react-native";
import { TouchableRipple, TouchableRippleProps } from "react-native-paper";

type Props = {
  onPressed:
    | (((event: GestureResponderEvent) => void) &
        ((e: GestureResponderEvent) => void))
    | undefined;
  iconElement?: React.ReactNode;
  paddingSize?: number;
  circular?: boolean;
  touchableRippleProps?: TouchableRippleProps;
  extendStyles?: ViewStyle;
};
export const MyIconButton: React.FC<Props> = memo(
  ({
    onPressed,
    iconElement,
    paddingSize,
    circular = true,
    touchableRippleProps,
    extendStyles,
  }) => {
    return (
      <TouchableRipple
        borderless
        onPress={onPressed}
        style={[
          styles.button,
          Boolean(paddingSize) && { padding: paddingSize },
          circular && { borderRadius: 999 },
          extendStyles,
        ]}
        {...touchableRippleProps}
      >
        {iconElement}
      </TouchableRipple>
    );
  }
);

const styles = StyleSheet.create({
  button: {
    padding: 8,
  },
});
