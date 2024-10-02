import { fetchListDutyCalendarByDateRange } from "@/api/form";
import { TDutyCalendar, TDutyCalendarFilterParams } from "@/api/form/types";
import { FormSelectV2WithFullscreenModal } from "@/components/FormSelectV2WithFullscreenModal";
import { NunitoText } from "@/components/text/NunitoText";
import { Colors } from "@/constants/Colors";
import { useSession } from "@/contexts/ctx";
import { getDayOfWeekNameInVietnamese, sortByDate } from "@/helper/date";
import { MyToast } from "@/ui/MyToast";
import { FontAwesome } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import moment from "moment";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import * as Progress from "react-native-progress";

type CreateItemForm = {
  dutyCalendarId: number;
  userIdentifyCard: string;
  userApproveIdentifyCard: number;
  attachFile?: File | null;
  note?: string | null;
};

export default function CreateDutyForm() {
  const [dutyCalendars, setDutyCalendars] = useState<TDutyCalendar[]>([]);
  const { session, userInfo } = useSession();

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<CreateItemForm>({
    defaultValues: { userIdentifyCard: userInfo?.identifyCard },
  });

  const dutyCalendarOpts = dutyCalendars.map((calendar) => ({
    value: calendar.dutyFormId,
    label: `${moment(calendar.date).format("DD/MM/YYYY")} - (${getDayOfWeekNameInVietnamese(calendar.date)})`,
  }));

  const onCreate = async (fieldValues: CreateItemForm) => {
    console.log("fieldValues", fieldValues);
  };

  const fetchDutyCalendars = async () => {
    const calendarFilterParams: TDutyCalendarFilterParams = {
      startDate: "2024-01-01",
      endDate: "2024-12-30",
    };
    const responseJson = await fetchListDutyCalendarByDateRange(session, calendarFilterParams);

    if (responseJson.statusCode === 200) {
      const dutyCalendarsSorted = sortByDate<TDutyCalendar>(responseJson.data.dutyCalendar, "ASC");
      setDutyCalendars(dutyCalendarsSorted);
    } else {
      MyToast.error(responseJson.error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchDutyCalendars();
    }, [])
  );

  return (
    <KeyboardAwareScrollView>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <FormSelectV2WithFullscreenModal
            useControllerProps={{ control: control, name: "dutyCalendarId" }}
            options={dutyCalendarOpts}
            leftIcon={<FontAwesome name="list-alt" size={18} color={Colors.light.inputIconNone} />}
          />
        </ScrollView>
        <TouchableOpacity onPress={handleSubmit(onCreate)} activeOpacity={0.8} style={styles.buttonContainer} disabled={isSubmitting}>
          <View style={styles.button}>
            {isSubmitting && <Progress.Circle indeterminate size={14} />}
            <NunitoText type="body3" style={{ color: "white" }}>
              Gửi duyệt
            </NunitoText>
          </View>
        </TouchableOpacity>
      </View>
    </KeyboardAwareScrollView>
  );
}

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
  timeContainer: {
    flexDirection: "row",
    gap: 10,
  },
  timeItem: {
    flexBasis: 1,
    flexGrow: 1,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: "white", // Optional: To give the button a distinct background
  },
  button: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",

    backgroundColor: "#0B3A82",
    height: 44,
    borderRadius: 4,

    gap: 8,
  },
});
