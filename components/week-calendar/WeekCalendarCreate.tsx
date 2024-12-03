import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { FormInput } from "../FormInput";
import { useFieldArray, useForm } from "react-hook-form";
import { TWeekCalendarCreateFormFields, TWeekCalendarCreateFormFieldsUser } from "@/types";
import { FormPickDate } from "../FormPickDate";
import { FormPickTime } from "../FormPickTime";
import { useCallback, useState } from "react";
import { FormPickDateTime } from "../FormPickDateTime";
import { NunitoText } from "../text/NunitoText";
import { Switch } from "react-native-paper";
import { WeekCalendarSelectUser } from "./WeekCalendarSelectUser";

export const WeekCalendarCreate = () => {
  const [isAllDay, setIsAllDay] = useState<boolean>(false);
  const { handleSubmit, control } = useForm<TWeekCalendarCreateFormFields>();
  const { fields, append, update, remove } = useFieldArray({ name: "users", control: control });

  const onToggleSwitch = () => setIsAllDay(!isAllDay);

  const onAddUser = useCallback(
    (user: TWeekCalendarCreateFormFieldsUser) => {
      append(user);
    },
    [append]
  );

  return (
    <KeyboardAwareScrollView>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <FormInput formInputProps={{ control: control, name: "title" }} label="Tiêu đề" placeholder="Nhập tiêu đề..." required />

          <View style={styles.formSwitch}>
            <NunitoText type="body2" style={{ marginRight: 6 }}>
              Cả ngày
            </NunitoText>
            <Switch value={isAllDay} onValueChange={onToggleSwitch} />;
          </View>

          {!isAllDay && (
            <View style={{ gap: 12 }}>
              <FormPickDateTime useControllerProps={{ control: control, name: "startDate" }} label="Ngày và giờ bắt đầu" />
              <FormPickDateTime useControllerProps={{ control: control, name: "endDate" }} label="Ngày và giờ kết thúc" />
            </View>
          )}
          {isAllDay && (
            <>
              <FormPickDate useControllerProps={{ control: control, name: "startDate" }} label="Ngày bắt đầu" />
              <FormPickDate useControllerProps={{ control: control, name: "endDate" }} label="Ngày kết thúc" />
            </>
          )}

          <WeekCalendarSelectUser/>
          <FormInput formInputProps={{ control: control, name: "description" }} label="Mô tả" placeholder="Nhập ghi chú..." />
        </ScrollView>
      </View>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    backgroundColor: "white",
  },
  scrollContent: {
    gap: 20,
    padding: 16,
    paddingBottom: 100, // Space at the bottom to prevent overlap with the button
  },
  formSwitch: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  actionContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
  },
  buttonContained: {
    borderRadius: 4,
    height: 44,
  },
  timeRangeContainer: {
    flexDirection: "row",
    gap: 12,
  },
  timeRangeItem: {
    flexGrow: 1,
  },
});
