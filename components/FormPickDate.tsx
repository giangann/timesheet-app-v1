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
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { useState } from "react";

type FormPickDateProps<T extends FieldValues> = {
  placeholder?: string;
  label?: string;
  required?: boolean;
  useControllerProps: UseControllerProps<T>;
};

export function FormPickDate<T extends FieldValues>({ useControllerProps }: FormPickDateProps<T>) {
  const { field } = useController(useControllerProps);
  const { onChange, value } = field;
  const [showDatePicker, setShowDatePicker] = useState(false);

  const onToggleShowDatePicker = () => setShowDatePicker(!showDatePicker);

  const onDateChange = (e: DateTimePickerEvent, newValue: Date | undefined) => {
    if (newValue) {
      console.log(newValue.toLocaleString());
    }
    onChange(newValue);

    setShowDatePicker(false);
  };
  return (
    <View>
      {/* open date picker modal when press */}
      <Pressable onPress={onToggleShowDatePicker}>
        <View style={selectInputStyles.default}>
          {/* display date */}
          <Text>{value.toLocaleString()}</Text>
        </View>
      </Pressable>

      {/* date picker modal */}
      {showDatePicker && (
        <DateTimePicker testID="dateTimePicker" value={value} display="default" mode="date" is24Hour={true} onChange={onDateChange} />
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
