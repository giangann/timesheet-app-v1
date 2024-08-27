import { OPACITY_TO_HEX } from "@/constants/Colors";
import { Text, TextInput, type TextProps, type TextInputProps, StyleSheet, View, Image, TouchableHighlight } from "react-native";
import { type UseFormReturn, type FieldValues } from "react-hook-form";
export type FormInputProps<T extends FieldValues> = {
  formInputProps: UseFormReturn<T>;
};

export type BaseInputProps<T extends FieldValues> = TextInputProps &
  FormInputProps<T> & {
    required?: boolean;
    error?: string;
    leftIconImage: any;
    rightIconImage: any;
    rightIconEl?: React.ReactNode;
  };

export function FormInput<T extends FieldValues>({ placeholder, leftIconImage, rightIconImage, rightIconEl, error }: BaseInputProps<T>) {
  return (
    <View style={{ position: "relative", marginBottom: 8 }}>
      {/* input */}
      <TextInput placeholder={placeholder} style={inputStyles.default} />

      {/* left icon */}
      <View style={{ position: "absolute", top: 0, left: 0, width: 36, height: "100%" }}>
        <View style={{ flex: 1, width: "100%", height: "100%", justifyContent: "center", alignItems: "center" }}>
          <Image source={leftIconImage} style={imageStyles.icon} />
        </View>
      </View>

      {/* right icon */}
      <View style={{ position: "absolute", top: 0, right: 0, width: 36, height: "100%" }}>
        <View style={{ flex: 1, width: "100%", height: "100%", justifyContent: "center", alignItems: "center" }}>
          {rightIconEl && rightIconEl}
          {!rightIconEl && (
            <TouchableHighlight>
              <View style={{ width: 18, height: 18 }}>
                <Image source={rightIconImage} style={imageStyles.icon} />
              </View>
            </TouchableHighlight>
          )}
        </View>
      </View>

      {error && <Text style={{ color: "red" }}>{error}</Text>}
    </View>
  );
}

const inputStyles = StyleSheet.create({
  default: {
    padding: 10,
    paddingLeft: 36,
    paddingRight: 36,
    borderWidth: 1,
    height: 40,
    borderRadius: 4,
    fontFamily: "Nunito",

    borderColor: `#000000${OPACITY_TO_HEX["20"]}`,
  },
  focus: {
    padding: 10,
    paddingLeft: 36,
    paddingRight: 36,
    borderWidth: 1,
    height: 40,
    borderRadius: 4,
    fontFamily: "Nunito",

    borderColor: `#000000`,
  },
  error: {
    padding: 10,
    paddingLeft: 36,
    paddingRight: 36,
    borderWidth: 1,
    height: 40,
    borderRadius: 4,
    fontFamily: "Nunito",

    borderColor: `red`,
  },
});

const imageStyles = StyleSheet.create({
  icon: {
    opacity: 0.5,
  },
});
