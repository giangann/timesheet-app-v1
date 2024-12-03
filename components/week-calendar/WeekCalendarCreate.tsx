import { hasNullishValue, pickProperties } from "@/helper/common";
import { useWeekCalendar } from "@/hooks/week-calendar";
import { useWeekCalendarCreateProvider } from "@/providers";
import { TWeekCalendarCreateFormFields } from "@/types";
import { MyToast } from "@/ui/MyToast";
import { useCallback, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Button, Switch } from "react-native-paper";
import { FormInput } from "../FormInput";
import { FormPickDate } from "../FormPickDate";
import { FormPickDateTime } from "../FormPickDateTime";
import { NunitoText } from "../text/NunitoText";
import { WeekCalendarSelectUser } from "./WeekCalendarSelectUser";

export const WeekCalendarCreate = () => {
  const [isAllDay, setIsAllDay] = useState<boolean>(false);
  const { useFormReturn } = useWeekCalendarCreateProvider();
  const { onCreate } = useWeekCalendar();
  const onToggleSwitch = () => setIsAllDay(!isAllDay);

  const onSubmit = useCallback(
    async (values: TWeekCalendarCreateFormFields) => {
      try {
        const requiredValues = pickProperties(values, ["startDate", "endDate", "title"]);
        if (hasNullishValue(requiredValues)) {
          MyToast.error("Hãy nhập đủ các thông tin yêu cầu");
          return;
        }

        await onCreate({ ...values, isAllDay: isAllDay });
      } catch (error: any) {
        MyToast.error(error.message);
      }
    },
    [onCreate, isAllDay]
  );

  return (
    <KeyboardAwareScrollView>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <FormInput formInputProps={{ control: useFormReturn?.control, name: "title" }} label="Tiêu đề" placeholder="Nhập tiêu đề..." required />

          <View style={styles.formSwitch}>
            <NunitoText type="body2" style={{ marginRight: 6 }}>
              Cả ngày
            </NunitoText>
            <Switch value={isAllDay} onValueChange={onToggleSwitch} />;
          </View>

          {!isAllDay && (
            <View style={{ gap: 12 }}>
              <FormPickDateTime useControllerProps={{ control: useFormReturn?.control, name: "startDate" }} label="Ngày và giờ bắt đầu" required />
              <FormPickDateTime useControllerProps={{ control: useFormReturn?.control, name: "endDate" }} label="Ngày và giờ kết thúc" required/>
            </View>
          )}
          {isAllDay && (
            <>
              <FormPickDate useControllerProps={{ control: useFormReturn?.control, name: "startDate" }} label="Ngày bắt đầu" />
              <FormPickDate useControllerProps={{ control: useFormReturn?.control, name: "endDate" }} label="Ngày kết thúc" />
            </>
          )}

          <WeekCalendarSelectUser />
          <FormInput formInputProps={{ control: useFormReturn?.control, name: "description" }} label="Mô tả" placeholder="Nhập ghi chú..." />

          <View style={styles.actionContainer}>
            <Button
              onPress={useFormReturn?.handleSubmit(onSubmit)}
              mode="contained"
              icon="content-save-all-outline"
              loading={useFormReturn?.formState.isSubmitting}
              style={styles.buttonContained}
            >
              Lưu
            </Button>
          </View>
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
