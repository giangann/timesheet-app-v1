import { fetchListDutyCalendarByDateRange } from "@/api/form";
import { TDutyCalendar, TDutyCalendarFilterParams } from "@/api/form/types";
import { FormPickDate } from "@/components/FormPickDate";
import { FormSelectContext, FormSelectContextProps, FormSelectFullscreenModal } from "@/components/FormSelectFullscreenModal";
import { FormSelectV2WithFullscreenModal } from "@/components/FormSelectV2WithFullscreenModal";
import { NunitoText } from "@/components/text/NunitoText";
import { Colors } from "@/constants/Colors";
import { useSession } from "@/contexts/ctx";
import { getDayOfWeekNameInVietnamese, sortByDate } from "@/helper/date";
import { MyToast } from "@/ui/MyToast";
import { FontAwesome } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import moment from "moment";
import { useCallback, useContext, useEffect, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
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
          <FormSelectFullscreenModal
            useControllerProps={{ control: control, name: "dutyCalendarId" }}
            modalChildren={<SelectDutyCalendarModalChildren />}
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

type SelectDutyCalendarModalChildrenProps = {};
type TFilterFields = {
  startDate: Date | undefined;
  endDate: Date | undefined;
};
const SelectDutyCalendarModalChildren: React.FC<SelectDutyCalendarModalChildrenProps> = () => {
  const defaultFieldValues: TFilterFields = getDefaultDateRange();

  const [dutyCalendars, setDutyCalendars] = useState<TDutyCalendar[]>([]);
  const { session } = useSession();

  const { handleSubmit, control } = useForm<TFilterFields>({ defaultValues: defaultFieldValues });

  const { onSelectOption, fieldValue } = useContext(FormSelectContext) as FormSelectContextProps<Pick<CreateItemForm, "dutyCalendarId">>;

  const onApplyFilter = async (fieldValues: TFilterFields) => {
    fetchDutyCalendars(fieldValues);
  };

  const fetchDutyCalendars = useCallback(
    async (fieldValues: TFilterFields) => {
      const calendarFilterParams: TDutyCalendarFilterParams = {
        startDate: moment(fieldValues.startDate).format("YYYY-MM-DD"),
        endDate: moment(fieldValues.endDate).format("YYYY-MM-DD"),
      };
      const responseJson = await fetchListDutyCalendarByDateRange(session, calendarFilterParams);

      if (responseJson.statusCode === 200) {
        const dutyCalendarsSorted = sortByDate<TDutyCalendar>(responseJson.data.dutyCalendar, "ASC");
        setDutyCalendars(dutyCalendarsSorted);
      } else {
        MyToast.error(responseJson.error);
      }
    },
    [session]
  );

  const onOptionPress = (calendarId: number, label: string) => {
    onSelectOption(calendarId, label);
  };

  useEffect(() => {
    fetchDutyCalendars(defaultFieldValues);
  }, []);

  return (
    <View>
      <ScrollView>
        <FormPickDate useControllerProps={{ control: control, name: "startDate" }} />
        <FormPickDate useControllerProps={{ control: control, name: "endDate" }} />
        <TouchableOpacity style={styles.button} onPress={handleSubmit(onApplyFilter)}>
          <NunitoText type="body3" style={{ color: "white" }}>
            Chọn
          </NunitoText>
        </TouchableOpacity>

        <View style={{ gap: 4 }}>
          {dutyCalendars.map((cal) => (
            <View key={cal.dutyFormId} style={{ paddingHorizontal: 16, paddingVertical: 8, borderWidth: 1, borderColor: "black" }}>
              <TouchableOpacity onPress={() => onOptionPress(cal.dutyFormId, `${cal.date} - ${cal.dutyType}`)}>
                <NunitoText>
                  <NunitoText style={{ color: "black" }}>
                    {cal.dutyFormId}-{cal.date}
                  </NunitoText>
                </NunitoText>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

function getDefaultDateRange(): TFilterFields {
  // Calculate next week's Monday and Sunday
  const nextWeekMonday = moment().startOf("isoWeek").add(7, "days").format("YYYY-MM-DD");
  const nextWeekSunday = moment().startOf("isoWeek").add(13, "days").format("YYYY-MM-DD");

  const dateRange: TFilterFields = { startDate: new Date(nextWeekMonday), endDate: new Date(nextWeekSunday) };

  return dateRange;
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
