import { Colors, OPACITY_TO_HEX } from "@/constants/Colors";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React, { memo } from "react";
import { UseControllerProps, useController, type FieldValues } from "react-hook-form";
import { ImageStyle, StyleSheet, Text, TextInput, TextStyle, View, ViewStyle, type TextInputProps } from "react-native";
import { NunitoText } from "./text/NunitoText";

export type FormInputProps<T extends FieldValues> = {
  formInputProps: UseControllerProps<T>;
};

export type RawFormInputProps<T extends FieldValues> = TextInputProps &
  FormInputProps<T> & {
    required?: boolean;
    label?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    disabled?: boolean;
  };

function RawFormInputMultilne<T extends FieldValues>({
  label,
  required,
  leftIcon = <MaterialCommunityIcons name="tooltip-text-outline" size={18} color={Colors.light.inputIconNone} />,
  rightIcon = <MaterialIcons name="clear" size={18} color={Colors.light.inputIconNone} />,
  formInputProps,
  disabled,
  ...rest
}: RawFormInputProps<T>) {
  const { field, fieldState } = useController(formInputProps);
  const { value, onChange } = field;
  const { error } = fieldState;

  return (
    <View style={styles.container}>
      {/* label */}
      <View style={{ flexDirection: "row", alignContent: "flex-start", alignItems: "center" }}>
        {label && (
          <NunitoText type="body2" style={{ marginRight: 6 }}>
            {label}
          </NunitoText>
        )}
        {required && <Text style={{ color: "red" }}>*</Text>}
      </View>

      {/* input container */}
      <View style={{ position: "relative" }}>
        {/* input */}
        <TextInput
          placeholderTextColor={`#000000${OPACITY_TO_HEX["50"]}`}
          value={value}
          onChangeText={onChange}
          style={[inputStyles.default, error && inputStyles.error, disabled && inputStyles.disabled, rest.multiline && { height: 120 }]}
          clearButtonMode="always"
          textAlignVertical="top"
          editable={!disabled}
          {...rest}
        />

        {/* left icon */}
        <View style={{ position: "absolute", top: 0, left: 0, width: 42, height: 42 }}>
          <View style={{ flex: 1, width: "100%", height: "100%", justifyContent: "center", alignItems: "center" }}>{leftIcon}</View>
        </View>
      </View>
      {Boolean(error) && (
        <NunitoText type="body4" style={{ color: "red" }}>
          {error?.message}
        </NunitoText>
      )}
    </View>
  );
}

export const FormInputMultilne = memo(RawFormInputMultilne) as typeof RawFormInputMultilne;

const baseInputStyle: ViewStyle | TextStyle | ImageStyle = {
  padding: 10,
  paddingLeft: 42,
  paddingRight: 42,
  borderWidth: 1,
  height: 44,
  borderRadius: 4,
  fontFamily: "Nunito",
};

const inputStyles = StyleSheet.create({
  default: {
    ...baseInputStyle,
    borderColor: `#000000${OPACITY_TO_HEX["20"]}`,
  },
  focus: {
    ...baseInputStyle,
    borderColor: `pink`,
  },
  error: {
    ...baseInputStyle,
    borderColor: `red`,
  },
  disabled: {
    borderColor: `#000000${OPACITY_TO_HEX["20"]}`,
    backgroundColor: `#000000${OPACITY_TO_HEX["10"]}`,
  },
});

const styles = StyleSheet.create({
  container: {
    gap: 6,
  },
});
