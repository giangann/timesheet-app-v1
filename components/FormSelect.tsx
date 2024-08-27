import {
  Image,
  ImageStyle,
  StyleSheet,
  Text,
  TextInput,
  TextStyle,
  TouchableHighlight,
  View,
  ViewStyle,
  type TextInputProps,
  Pressable,
} from "react-native";
import { FieldValues, UseControllerProps, useController } from "react-hook-form";
import { useState } from "react";
import { OPACITY_TO_HEX } from "@/constants/Colors";
const ArrowDownSelectIconImage = require("@/assets/images/arrow-down-select.png");

type TOption = {
  value: any;
  label: string;
};
type FormSelectProps<T extends FieldValues> = {
  label?: string;
  required?: boolean;
  options: TOption[];
} & {
  useControllerProps: UseControllerProps<T>;
};

export function FormSelect<T extends FieldValues>({ label, required, options, useControllerProps }: FormSelectProps<T>) {
  const [openModal, setOpenModal] = useState(false);
  const [labelOfValue, setLabelOfValue] = useState<string | null>(null);
  const { field } = useController(useControllerProps);
  const { value, onChange } = field;

  const onToggleOpenModal = () => setOpenModal(!openModal);

  const onSelect = (value: any, label: string) => {
    // update value
    onChange(value);

    // update display label of value
    setLabelOfValue(label);

    // close modal
    setOpenModal(false);
  };

  return (
    <View>
      {/* label */}
      <Text>
        {label} {required && <span style={{ color: "red" }}>*</span>}
      </Text>

      {/* select button*/}
      <Pressable onPress={onToggleOpenModal}>
        <View style={selectInputStyles.default}>
          <View style={{ flex: 1, justifyContent: "space-between", alignItems: "center" }}>
            {!value && <Text>Select</Text>}
            {value && <Text>{labelOfValue}</Text>}
            <Image source={ArrowDownSelectIconImage} style={{ ...imageStyles.icon }} />
          </View>
        </View>
      </Pressable>

      {/* select modal */}
      {openModal && (
        // modal
        <View style={{ padding: 10, backgroundColor: `#000000${OPACITY_TO_HEX["10"]}` }}>
          {options.map((opt) => (
            //item
            <Pressable key={opt.value} onPress={() => onSelect(opt.value, opt.label)}>
              <Text>{opt.label}</Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

const baseSelectInputStyle: ViewStyle | TextStyle | ImageStyle = {
  padding: 10,
  paddingLeft: 36,
  paddingRight: 36,
  borderWidth: 1,
  height: 40,
  borderRadius: 4,
  fontFamily: "Nunito",
};

const selectInputStyles = StyleSheet.create({
  default: {
    ...baseSelectInputStyle,
  },
  error: {
    ...baseSelectInputStyle,
    borderColor: "red",
  },
});

const imageStyles = StyleSheet.create({
  icon: {
    opacity: 0.5,
  },
});
