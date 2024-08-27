import { OPACITY_TO_HEX } from "@/constants/Colors";
import React from "react";
import { UseControllerProps, useController, type FieldValues } from "react-hook-form";
import { Image, ImageStyle, StyleSheet, Text, TextInput, TextStyle, TouchableHighlight, View, ViewStyle, type TextInputProps } from "react-native";
const XClearIconImage = require("@/assets/images/x-clear.png");

export type FormInputProps<T extends FieldValues> = {
  formInputProps: UseControllerProps<T>;
};

export type BaseInputProps<T extends FieldValues> = TextInputProps &
  FormInputProps<T> & {
    required?: boolean;
    label?: string;
    leftIconImage: any;
    rightIconImage: any;
    rightIconEl?: React.ReactNode;
  };

export function FormInput<T extends FieldValues>({
  label,
  required,
  leftIconImage,
  rightIconImage,
  rightIconEl,
  formInputProps,
  ...rest
}: BaseInputProps<T>) {
  const { field, fieldState } = useController(formInputProps);
  const { value, onChange } = field;
  const { error } = fieldState;
  return (
    <View>
      {/* label */}
      <Text>
        {label} {required && <span style={{ color: "red" }}>*</span>}
      </Text>

      {/* input container */}
      <View style={{ position: "relative", marginBottom: 8 }}>
        {/* input */}
        <TextInput
          placeholderTextColor={`#000000${OPACITY_TO_HEX["50"]}`}
          value={value}
          onChangeText={onChange}
          style={error ? inputStyles.error : inputStyles.default}
          {...rest}
        />

        {/* left icon */}
        <View style={{ position: "absolute", top: 0, left: 0, width: 36, height: "100%" }}>
          <View style={{ flex: 1, width: "100%", height: "100%", justifyContent: "center", alignItems: "center" }}>
            <Image source={leftIconImage} style={{ ...imageStyles.icon }} />
          </View>
        </View>

        {/* right icon */}
        <View style={{ position: "absolute", top: 0, right: 0, width: 36, height: "100%" }}>
          <View style={{ flex: 1, width: "100%", height: "100%", justifyContent: "center", alignItems: "center" }}>
            {rightIconEl && rightIconEl}
            {!rightIconEl && (
              <TouchableHighlight
                onPress={() => {
                  /**clear value input */
                  onChange("");
                }}
              >
                <View style={{ width: 18, height: 18 }}>
                  <Image source={XClearIconImage} style={{ ...imageStyles.icon, opacity: value === "" ? 0.5 : 1 }} />
                </View>
              </TouchableHighlight>
            )}
          </View>
        </View>
      </View>
      {Boolean(error) && <Text style={{ color: "red" }}>{error?.message}</Text>}
    </View>
  );
}

// export const FormInput = React.memo(function FormInput<T extends FieldValues>({
//   placeholder,
//   leftIconImage,
//   rightIconImage,
//   rightIconEl,
//   formInputProps,
// }: BaseInputProps<T>) {
//   const { field, formState } = useController(formInputProps);
//   const error = formState.errors[field.name];
//   return (
//     <View style={{ position: "relative", marginBottom: 8 }}>
//       {/* input */}
//       <TextInput
//         placeholder={placeholder}
//         style={formState.errors[field.name] ? inputStyles.error : inputStyles.default}
//         value={field.value}
//         onChangeText={field.onChange}
//       />

//       {/* left icon */}
//       <View style={{ position: "absolute", top: 0, left: 0, width: 36, height: "100%" }}>
//         <View style={{ flex: 1, width: "100%", height: "100%", justifyContent: "center", alignItems: "center" }}>
//           <Image source={leftIconImage} style={imageStyles.icon} />
//         </View>
//       </View>

//       {/* right icon */}
//       <View style={{ position: "absolute", top: 0, right: 0, width: 36, height: "100%" }}>
//         <View style={{ flex: 1, width: "100%", height: "100%", justifyContent: "center", alignItems: "center" }}>
//           {rightIconEl && rightIconEl}
//           {!rightIconEl && (
//             <TouchableHighlight>
//               <View style={{ width: 18, height: 18 }}>
//                 <Image source={rightIconImage} style={imageStyles.icon} />
//               </View>
//             </TouchableHighlight>
//           )}
//         </View>
//       </View>

//       {Boolean(error) && <Text style={{ color: "red" }}>{error?.message as string}</Text>}
//     </View>
//   );
// });

const baseInputStyle: ViewStyle | TextStyle | ImageStyle = {
  padding: 10,
  paddingLeft: 36,
  paddingRight: 36,
  borderWidth: 1,
  height: 40,
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
});

const imageStyles = StyleSheet.create({
  icon: {
    opacity: 0.5,
  },
});
