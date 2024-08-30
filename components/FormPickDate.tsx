import { Image, ImageStyle, StyleSheet, Text, TextStyle, View, ViewStyle, Pressable } from "react-native";
import { FieldValues, UseControllerProps, useController } from "react-hook-form";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { useState } from "react";
import moment from "moment";
import { NunitoText } from "./text/NunitoText";
import { OPACITY_TO_HEX } from "@/constants/Colors";

type FormPickDateProps<T extends FieldValues> = {
  useControllerProps: UseControllerProps<T>;
  placeholder?: string;
  label?: string;
  required?: boolean;
  leftIconImage: any;
  dateFormat?: string;
  locale?: string;
};

export function FormPickDate<T extends FieldValues>({
  useControllerProps,
  label,
  required,
  leftIconImage,
  placeholder = "Select Date",
  dateFormat = "DD/MM/YYYY",
  locale = "en",
}: FormPickDateProps<T>) {
  const { field } = useController(useControllerProps);
  const { onChange, value } = field;
  const [showDatePicker, setShowDatePicker] = useState(false);

  const onToggleShowDatePicker = () => setShowDatePicker(!showDatePicker);

  const onDateChange = (_e: DateTimePickerEvent, newValue: Date | undefined) => {
    if (_e.type === "set") {
      if (newValue) {
        onChange(new Date(newValue));
      }
    }
    setShowDatePicker(false);
  };

  const formattedDate = value ? moment(value).locale(locale).format(dateFormat) : placeholder;

  return (
    <View style={styles.container}>
      {/* label */}
      <View style={styles.labelWrapper}>
        {label && (
          <NunitoText type="body2" style={{ marginRight: 6 }}>
            {label}
          </NunitoText>
        )}
        {required && <Text style={{ color: "red" }}>*</Text>}
      </View>

      {/* open date picker modal when press */}
      <Pressable onPress={onToggleShowDatePicker} accessible accessibilityLabel="Open date picker">
        <View style={styles.showDateBox}>
          {/* left icon */}
          <Image source={leftIconImage} style={imageStyles.icon} />

          {/* display date */}
          <NunitoText type="body3" style={value ? null : styles.placeholderText}>
            {formattedDate}
          </NunitoText>
        </View>
      </Pressable>

      {/* date picker modal */}
      {showDatePicker && (
        <DateTimePicker testID="dateTimePicker" value={value || new Date()} display="default" mode="date" is24Hour={true} onChange={onDateChange} />
      )}
    </View>
  );
}

/**
 * -------------------------------------------
 */

const styles = StyleSheet.create({
  container: {
    gap: 6,
  },
  labelWrapper: {
    flexDirection: "row",
    alignContent: "flex-start",
    alignItems: "center",
  },
  showDateBox: {
    padding: 10,
    borderWidth: 1,
    height: 40,
    borderRadius: 4,
    borderColor: `#000000${OPACITY_TO_HEX["20"]}`,

    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 8,
  },
  placeholderText: {
    color: "#888",
  },
});

const imageStyles = StyleSheet.create({
  icon: {
    opacity: 0.5,
  },
});
