import { Colors, OPACITY_TO_HEX } from "@/constants/Colors";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import moment from "moment";
import { memo, useCallback, useMemo, useState } from "react";
import { FieldValues, UseControllerProps, useController } from "react-hook-form";
import { Pressable, StyleSheet, Text, View, Platform, ViewStyle, TextStyle, ImageStyle } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { NunitoText } from "./text/NunitoText";

type FormPickTimeProps<T extends FieldValues> = {
  useControllerProps: UseControllerProps<T>;
  placeholder?: string;
  label?: string;
  required?: boolean;
  leftIcon?: React.ReactNode;
  timeFormat?: string;
  locale?: string;
  initTime?: Date;
  disabled?: boolean;
};

function RawFormPickTime<T extends FieldValues>({
  useControllerProps,
  label,
  required,
  leftIcon = <MaterialCommunityIcons name="timer-cog-outline" size={18} color={Colors.light.inputIconNone} />,
  placeholder = "Select Date",
  timeFormat = "HH:mm",
  locale = "en",
  initTime,
  disabled,
}: FormPickTimeProps<T>) {
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
  const formattedDate = useMemo(() => (value ? moment(value).locale(locale).format(timeFormat) : placeholder), [value, locale, timeFormat]);
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
      <Pressable onPress={onShowDatePicker} accessible accessibilityLabel="Open date picker">
        <View style={disabled ? styles.showDateBoxDisabled : styles.showDateBox}>
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
        date={value ?? initTime}
        mode="time"
        onConfirm={onDateConfirm}
        onCancel={onDateDismiss}
        testID="dateTimePickerModal"
        is24Hour={true}
        display={Platform.OS === "ios" ? "spinner" : "default"}
      />
    </View>
  );
}

export const FormPickTime = memo(RawFormPickTime) as typeof RawFormPickTime;

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
