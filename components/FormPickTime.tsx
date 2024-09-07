import { Colors, OPACITY_TO_HEX } from "@/constants/Colors";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import moment from "moment";
import { useState } from "react";
import { FieldValues, UseControllerProps, useController } from "react-hook-form";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { NunitoText } from "./text/NunitoText";

type FormPickTimeProps<T extends FieldValues> = {
  useControllerProps: UseControllerProps<T>;
  placeholder?: string;
  label?: string;
  required?: boolean;
  leftIcon?: React.ReactNode;
  timeFormat?: string;
  locale?: string;
};

export function FormPickTime<T extends FieldValues>({
  useControllerProps,
  label,
  required,
  leftIcon = <MaterialCommunityIcons name="timer-cog-outline" size={18} color={Colors.light.inputIconNone} />,
  placeholder = "Select Date",
  timeFormat = "HH:mm",
  locale = "en",
}: FormPickTimeProps<T>) {
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

  const formattedDate = value ? moment(value).locale(locale).format(timeFormat) : placeholder;

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
          {leftIcon}

          {/* display date */}
          <NunitoText type="body3" style={value ? null : styles.placeholderText}>
            {formattedDate}
          </NunitoText>
        </View>
      </Pressable>

      {/* date picker modal */}
      {showDatePicker && (
        <DateTimePicker testID="dateTimePicker" value={value || new Date()} display="default" mode="time" is24Hour={true} onChange={onDateChange} />
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
  placeholderText: {
    color: "#888",
  },
});

const imageStyles = StyleSheet.create({
  icon: {
    opacity: 0.5,
  },
});
