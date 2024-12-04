import { TWeekCalendarDetail } from "@/api/timesheet/type";
import { hasNullishValue, pickProperties } from "@/helper/common";
import { weekCalendarUsersToUserFields } from "@/helper/transform-data";
import { useFetchWeekCalendarDetail, useWeekCalendar } from "@/hooks/week-calendar";
import { useWeekCalendarCreateProvider } from "@/providers";
import { TWeekCalendarCreateFormFields } from "@/types";
import { MyToast } from "@/ui/MyToast";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Button, Switch } from "react-native-paper";
import { FormInput } from "../FormInput";
import { FormPickDate } from "../FormPickDate";
import { FormPickDateTime } from "../FormPickDateTime";
import { NunitoText } from "../text/NunitoText";
import { WeekCalendarSelectUser } from "./WeekCalendarSelectUser";

type Props = {
  calendarId?: number;
};
export const WeekCalendarCreate = ({ calendarId }: Props) => {
  const [isAllDay, setIsAllDay] = useState<boolean>(false);
  const { useFormReturn } = useWeekCalendarCreateProvider();
  const { onCreate, onUpdate } = useWeekCalendar();
  const { onFetchWeekCalendarDetail } = useFetchWeekCalendarDetail();
  const onToggleSwitch = () => setIsAllDay(!isAllDay);

  const onSubmit = useCallback(
    async (values: TWeekCalendarCreateFormFields) => {
      try {
        const requiredValues = pickProperties(values, ["startDate", "endDate", "title"]);
        if (hasNullishValue(requiredValues)) {
          MyToast.error("Hãy nhập đủ các thông tin yêu cầu");
          return;
        }

        if (calendarId) {
          await onUpdate(calendarId, { ...values, isAllDay: isAllDay });
        } else {
          await onCreate({ ...values, isAllDay: isAllDay });
        }

        useFormReturn?.reset({ description: undefined, endDate: undefined, startDate: undefined, isAllDay: false, title: undefined, users: [] });
      } catch (error: any) {
        MyToast.error(error.message);
      }
    },
    [onCreate, onUpdate, isAllDay, useFormReturn, calendarId]
  );

  useFocusEffect(
    useCallback(() => {
      async function fetchDetail() {
        if (calendarId) {
          const formDetail: TWeekCalendarDetail = await onFetchWeekCalendarDetail(calendarId);
          useFormReturn?.setValue("startDate", new Date(formDetail.startDate));
          useFormReturn?.setValue("endDate", new Date(formDetail.endDate));
          useFormReturn?.setValue("title", formDetail.title);
          useFormReturn?.setValue("isAllDay", formDetail.isAllDay);
          useFormReturn?.setValue("description", formDetail.description);
          useFormReturn?.setValue("users", weekCalendarUsersToUserFields(formDetail.users));
          setIsAllDay(formDetail.isAllDay);
        }
      }

      fetchDetail();
    }, [useFormReturn, calendarId, setIsAllDay])
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
              <FormPickDateTime useControllerProps={{ control: useFormReturn?.control, name: "endDate" }} label="Ngày và giờ kết thúc" required />
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
