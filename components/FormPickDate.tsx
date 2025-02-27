import { Colors, OPACITY_TO_HEX } from "@/constants/Colors";
import Fontisto from "@expo/vector-icons/Fontisto";
import moment from "moment";
import { useCallback, useMemo, useState } from "react";
import { FieldValues, UseControllerProps, useController } from "react-hook-form";
import { Platform, Pressable, StyleSheet, Text, View, ViewStyle } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { NunitoText } from "./text/NunitoText";

type FormPickDateProps<T extends FieldValues> = {
  useControllerProps: UseControllerProps<T>;
  placeholder?: string;
  label?: string;
  required?: boolean;
  leftIcon?: React.ReactNode;
  dateFormat?: string;
  locale?: string;
  initDate?: Date;
  disabled?: boolean;
};

export function FormPickDate<T extends FieldValues>({
  useControllerProps,
  label,
  required,
  leftIcon = <Fontisto name="date" size={18} color={Colors.light.inputIconNone} />,
  placeholder = "Select Date",
  dateFormat = "DD/MM/YYYY",
  locale = "en",
  initDate,
  disabled,
}: FormPickDateProps<T>) {
  const { field } = useController(useControllerProps);
  const { onChange, value } = field;
  const [showDatePicker, setShowDatePicker] = useState(false);

  const onShowDatePicker = useCallback(() => setShowDatePicker(true), [setShowDatePicker]);
  const onHideDatePicker = useCallback(() => setShowDatePicker(false), [setShowDatePicker]);

  const onDateConfirm = useCallback(
    (newValue: Date) => {
      onHideDatePicker();
      onChange(newValue);
    },
    [onHideDatePicker, onChange]
  );

  const onDateDismiss = useCallback(() => {
    onHideDatePicker();
  }, [onHideDatePicker]);

  const formattedDate = useMemo(() => (value ? moment(value).locale(locale).format(dateFormat) : placeholder), [value, locale, dateFormat]);

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
      <Pressable onPress={onShowDatePicker} disabled={disabled} accessible accessibilityLabel="Open date picker">
        <View style={[styles.showDateBox, disabled && styles.showDateBoxDisabled]}>
          {/* left icon */}
          {leftIcon}
          {/* display date */}
          <NunitoText type="body3" style={value ? null : styles.placeholderText}>
            {formattedDate}
          </NunitoText>
        </View>
      </Pressable>

      {/* date picker modal */}
      <DateTimePickerModal
        isVisible={showDatePicker}
        date={value ?? initDate}
        mode="date"
        onConfirm={onDateConfirm}
        onCancel={onDateDismiss}
        testID="dateTimePickerModal"
        is24Hour={true}
        display={Platform.OS === "ios" ? "spinner" : "default"}
        locale="vi-VN"
      />
    </View>
  );
}

/**
 * -------------------------------------------
 */
const showDateBoxCommon: ViewStyle = {
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
};
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
    ...showDateBoxCommon,
  },
  showDateBoxDisabled: {
    ...showDateBoxCommon,
    borderColor: `#000000${OPACITY_TO_HEX["20"]}`,
    backgroundColor: `#000000${OPACITY_TO_HEX["10"]}`,
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
