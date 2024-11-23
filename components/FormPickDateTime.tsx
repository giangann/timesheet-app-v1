import { Colors, OPACITY_TO_HEX } from "@/constants/Colors";
import Fontisto from "@expo/vector-icons/Fontisto";
import moment from "moment";
import { useCallback, useMemo, useState } from "react";
import { FieldValues, UseControllerProps, useController } from "react-hook-form";
import { Pressable, StyleSheet, Text, View } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { NunitoText } from "./text/NunitoText";

type FormPickDateTimeProps<T extends FieldValues> = {
  useControllerProps: UseControllerProps<T>;
  placeholder?: string;
  label?: string;
  required?: boolean;
  leftIcon?: React.ReactNode;
  dateFormat?: string;
  timeFormat?: string;
  errorMessage?: string;
};

export function FormPickDateTime<T extends FieldValues>({
  useControllerProps,
  placeholder = "Select date and time",
  label,
  required,
  leftIcon = <Fontisto name="date" size={18} color={Colors.light.inputIconNone} />,
  dateFormat = "DD/MM/YYYY",
  timeFormat = "HH:mm:ss",
  errorMessage,
}: FormPickDateTimeProps<T>) {
  const { field, fieldState } = useController(useControllerProps);
  const { onChange, value } = field;
  const { error } = fieldState;
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const onShowDatePicker = useCallback(() => setShowDatePicker(true), [setShowDatePicker]);
  const onHideDatePicker = useCallback(() => setShowDatePicker(false), [setShowDatePicker]);

  const onShowTimePicker = useCallback(() => setShowTimePicker(true), [setShowDatePicker]);
  const onHideTimePicker = useCallback(() => setShowTimePicker(false), [setShowDatePicker]);

  const onDateConfirm = useCallback(
    (newValue: Date) => {
      onHideDatePicker();
      onChange(newValue);

      onShowTimePicker();
    },
    [onHideDatePicker, onShowTimePicker, onChange]
  );

  const onDateDismiss = useCallback(() => onHideDatePicker(), [onHideDatePicker]);

  const onTimeConfirm = useCallback(
    (newValue: Date) => {
      onHideTimePicker();
      onChange(newValue);
    },
    [onHideDatePicker, onShowTimePicker, onChange]
  );

  const formattedValue = useMemo(
    () => (value ? `${moment(value).format(dateFormat)} - ${moment(value).format(timeFormat)}` : placeholder),
    [value, dateFormat, timeFormat]
  );

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
      <Pressable onPress={onShowDatePicker}>
        <View style={styles.showDateBox}>
          {/* Left icon */}
          {leftIcon}
          {/* Display selected date and time or placeholder */}
          <NunitoText type="body3" style={{ color: value ? "#000" : "#888" }}>
            {formattedValue}
          </NunitoText>
        </View>
      </Pressable>

      {/* Date picker modal */}
      <DateTimePickerModal
        isVisible={showDatePicker}
        date={value}
        mode="date"
        onConfirm={onDateConfirm}
        onCancel={onDateDismiss}
        testID="datePickerModal"
        is24Hour={true}
      />

      {/* Time picker modal */}
      <DateTimePickerModal
        isVisible={showTimePicker}
        date={value}
        mode="time"
        onConfirm={onTimeConfirm}
        onCancel={() => {}}
        testID="timePickerModal"
        is24Hour={true}
      />

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
    paddingLeft: 12,
    borderWidth: 1,
    height: 44,
    borderRadius: 4,
    borderColor: `#000000${OPACITY_TO_HEX["20"]}`,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 12,
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
