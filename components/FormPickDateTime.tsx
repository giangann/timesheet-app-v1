import { Image, StyleSheet, Text, Pressable, View } from "react-native";
import { FieldValues, UseControllerProps, useController } from "react-hook-form";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { useState } from "react";
import moment from "moment";
import { NunitoText } from "./text/NunitoText";
import { OPACITY_TO_HEX } from "@/constants/Colors";

type FormPickDateTimeProps<T extends FieldValues> = {
  useControllerProps: UseControllerProps<T>;
  placeholder?: string;
  label?: string;
  required?: boolean;
  leftIconImage: any;
  dateFormat?: string;
  timeFormat?: string;
  errorMessage?: string;
};

export function FormPickDateTime<T extends FieldValues>({
  useControllerProps,
  placeholder = "Select date and time",
  label,
  required,
  leftIconImage,
  dateFormat = "DD/MM/YYYY",
  timeFormat = "HH:mm:ss",
  errorMessage,
}: FormPickDateTimeProps<T>) {
  const { field, fieldState } = useController(useControllerProps);
  const { onChange, value } = field;
  const { error } = fieldState;
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const onOpenDatePicker = () => {
    setShowDatePicker(true);
  };
  const onCloseDatePicker = () => {
    setShowDatePicker(false);
  };
  const onOpenTimePicker = () => {
    setShowTimePicker(true);
  };
  const onCloseTimePicker = () => {
    setShowTimePicker(false);
  };

  const onDateChange = (_e: DateTimePickerEvent, newValue: Date | undefined) => {
    if (_e.type === "set") {
      if (newValue) {
        onChange(new Date(newValue));
        onCloseDatePicker();
        onOpenTimePicker();
      }
    }

    if (_e.type === "dismissed") {
      onCloseDatePicker();
    }
  };

  const onTimeChange = (_e: DateTimePickerEvent, newValue: Date | undefined) => {
    if (_e.type === "set") {
      if (newValue) {
        onChange(new Date(newValue));
        onCloseTimePicker();
      }
    }
    if (_e.type === "dismissed") {
      onCloseTimePicker();
    }
  };

  const formattedValue = value ? `${moment(value).format(dateFormat)} - ${moment(value).format(timeFormat)}` : placeholder;

  return (
    <View style={styles.container}>
      {/* Label */}
      <View style={styles.labelWrapper}>
        {label && (
          <NunitoText type="body2" style={{ marginRight: 6 }}>
            {label}
          </NunitoText>
        )}
        {required && <Text style={{ color: "red" }}>*</Text>}
      </View>

      {/* Open date picker modal when pressed */}
      <Pressable onPress={onOpenDatePicker}>
        <View style={styles.showDateBox}>
          {/* Left icon */}
          <Image source={leftIconImage} style={imageStyles.icon} />

          {/* Display selected date and time or placeholder */}
          <NunitoText type="body3" style={{ color: value ? "#000" : "#888" }}>
            {formattedValue}
          </NunitoText>
        </View>
      </Pressable>

      {/* Date picker modal */}
      {showDatePicker && (
        <DateTimePicker testID="dateTimePicker" value={value || new Date()} display="default" mode="date" is24Hour={true} onChange={onDateChange} />
      )}

      {/* Time picker modal */}
      {showTimePicker && (
        <DateTimePicker testID="dateTimePicker" value={value || new Date()} display="default" mode="time" is24Hour={true} onChange={onTimeChange} />
      )}

      {/* Error message */}
      {error && <Text style={styles.errorText}>{error.message || errorMessage}</Text>}
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
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 4,
  },
});

/**
 * --------------------------------------------
 */

const imageStyles = StyleSheet.create({
  icon: {
    opacity: 0.5,
  },
});
