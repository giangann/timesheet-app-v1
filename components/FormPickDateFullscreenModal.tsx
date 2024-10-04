import { Colors, OPACITY_TO_HEX } from "@/constants/Colors";
import Fontisto from "@expo/vector-icons/Fontisto";
import moment from "moment";
import React, { memo, useCallback, useMemo, useState } from "react";
import { FieldValues, UseControllerProps, useController } from "react-hook-form";
import { ImageStyle, Pressable, StyleSheet, TextStyle, View, ViewStyle, TouchableOpacity, ScrollView } from "react-native";
import { Calendar, CalendarProps, DateData } from "react-native-calendars";
import { MyModalFullscreen } from "./MyModalFullscreen";
import { NunitoText } from "./text/NunitoText";
import { Delayed } from "./Delayed";

type TOption = {
  label: string;
  value: string | number | boolean;
};

type Props<T extends FieldValues> = {
  label?: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  value?: TOption["value"];
  onSelect?: (dateString: string) => void;
  rnCalendarProps?: CalendarProps;
  renderDateInfo?: (dateString: string) => React.ReactNode;
} & {
  useControllerProps: UseControllerProps<T>;
};

const INITIAL_DATE = moment(Date.now()).format("YYYY-MM-DD");
const DEFAULT_SELECTED_COLOR = "#00adf5";

function RawFormPickDateFullscreenModal<T extends FieldValues>({
  label,
  placeholder,
  required,
  error,
  disabled,
  leftIcon = <Fontisto name="date" size={18} color={Colors.light.inputIconNone} />,
  value,
  onSelect,
  useControllerProps,
  rnCalendarProps,
  renderDateInfo,
}: Props<T>) {
  const { field } = useController(useControllerProps);
  const { value: fieldValue, onChange } = field;
  const [openModal, setOpenModal] = useState(false);

  const [dateString, setDateString] = useState<string>(fieldValue ?? INITIAL_DATE);

  const labelDisplay = useMemo(() => (fieldValue ? moment(fieldValue).format("DD/MM/YYYY") : null), [fieldValue]);

  let showChooseValueBoxStyle: any;
  if (disabled) showChooseValueBoxStyle = styles.showChooseValueBoxDisabled;
  if (!disabled && !openModal) showChooseValueBoxStyle = styles.showChooseValueBox;
  if (!disabled && openModal) showChooseValueBoxStyle = styles.showChooseValueBoxFocus;

  const mergedMarkedDates = useMemo(() => {
    const parentMarkedDates = rnCalendarProps?.markedDates || {};
    return {
      ...parentMarkedDates,
      [dateString]: {
        ...(parentMarkedDates[dateString] || {}), // Keep parent's marked state if it exists
        selected: true, // Highlight the selected date
        selectedColor: DEFAULT_SELECTED_COLOR, // Apply background color for selected date
        marked: parentMarkedDates[dateString]?.marked || false, // Preserve marked if present from parent
      },
    };
  }, [rnCalendarProps, dateString]);

  const onToggleOpenModal = useCallback(() => setOpenModal(!openModal), [openModal]);

  const onDayPressHandler = useCallback((date: DateData | undefined) => {
    if (!date) return;
    //
    setDateString(date.dateString);
  }, []);

  const onDaySelect = useCallback(() => {
    onChange(dateString);
    onToggleOpenModal();
    onSelect?.(dateString);
  }, [dateString]);

  return (
    <View style={styles.container}>
      {/* label */}
      <View style={styles.labelWrapper}>
        {label && (
          <NunitoText type="body2" style={{ marginRight: 6 }}>
            {label}
          </NunitoText>
        )}
        {required && (
          <NunitoText type="body1" style={{ color: "red" }}>
            *
          </NunitoText>
        )}
      </View>

      <View>
        {/* select button*/}
        <Pressable onPress={onToggleOpenModal} disabled={disabled}>
          <View style={showChooseValueBoxStyle}>
            <View style={styles.valueBoxLeft}>
              {/* left icon */}
              {leftIcon}

              {/* label display */}
              {!labelDisplay && (
                <NunitoText type="body3" style={{ opacity: 0.5 }}>
                  {placeholder}
                </NunitoText>
              )}
              {labelDisplay && <NunitoText type="body3">{labelDisplay}</NunitoText>}
            </View>
          </View>
        </Pressable>
        {openModal && (
          <MyModalFullscreen title={placeholder} onClose={onToggleOpenModal}>
            <View style={styles.modalChildren}>
              <ScrollView contentContainerStyle={styles.scrollContent}>
                <Delayed>
                  <Calendar onDayPress={onDayPressHandler} {...rnCalendarProps} markedDates={mergedMarkedDates} current={dateString} />
                </Delayed>
                {renderDateInfo && renderDateInfo(dateString)}
              </ScrollView>
              <TouchableOpacity style={styles.button} onPress={onDaySelect}>
                <NunitoText type="body3" style={{ color: "white" }}>
                  Chọn
                </NunitoText>
              </TouchableOpacity>
            </View>
          </MyModalFullscreen>
        )}
      </View>
    </View>
  );
}
export const FormPickDateFullscreenModal = memo(RawFormPickDateFullscreenModal) as typeof RawFormPickDateFullscreenModal;

const showChooseValueBoxBaseStyles: ViewStyle | TextStyle | ImageStyle = {
  padding: 10,
  paddingLeft: 12,
  height: 44,

  borderWidth: 1,
  borderRadius: 4,

  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
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
  showChooseValueBox: {
    ...showChooseValueBoxBaseStyles,
    borderColor: `#000000${OPACITY_TO_HEX["20"]}`,
  },
  showChooseValueBoxDisabled: {
    ...showChooseValueBoxBaseStyles,
    borderColor: `#000000${OPACITY_TO_HEX["20"]}`,
    backgroundColor: `#000000${OPACITY_TO_HEX["10"]}`,
  },
  showChooseValueBoxFocus: {
    ...showChooseValueBoxBaseStyles,

    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderColor: `#000000`,
  },
  valueBoxLeft: {
    flexDirection: "row",
    justifyContent: "flex-start",
    gap: 12,
    flexShrink: 1,
    overflow: "hidden",
    alignItems: "center",
  },

  button: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0B3A82",
    height: 44,
    borderRadius: 4,

    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  modalChildren: {
    position: "relative",
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
    gap: 20,
  },
});
