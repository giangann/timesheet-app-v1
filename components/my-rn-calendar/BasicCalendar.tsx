import { MonthTimesheet, MonthTimesheetList, timesheetMockResponse } from "@/constants/Misc";
import moment from "moment";
import { useMemo, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Calendar, DateData } from "react-native-calendars";

const INITIAL_DATE = moment(Date.now()).format("YYYY-MM-DD");
// const INITIAL_DATE = "2024-09-10";

const DEFAULT_SELECTED_COLOR = "#00adf5";
export const BasicCalendar = ({ onFetchForms }: { onFetchForms: (lfId: number | null, otfId: number | null, dtfId: number | null) => void }) => {
  const [selectedDate, setSelectedDate] = useState(INITIAL_DATE);
  const timesheetDataMap = useMemo(() => timsheetDataToMap(timesheetMockResponse.timesheet), []);
  const onDayPressHandler = (date: DateData | undefined) => {
    if (!date) return;
    //
    const timesheetDate = timesheetDataMap[date.dateString];
    if (!timesheetDate) return;

    //
    onFetchForms(timesheetDate.leaveFormId, timesheetDate.overtimeFormId, timesheetDate.dutyFormId);

    //
    setSelectedDate(date.dateString);
  };
  return (
    <View>
      <Calendar
        current={selectedDate}
        initialDate={selectedDate}
        dayComponent={({ date, state }) => {
          // get key
          const dateKey = date?.dateString;

          // extract value from dateKey
          const timesheetDate = timesheetDataMap[dateKey ?? ""];
          const dateWkType = timesheetDate?.workingTypeId;
          const dateOtFormId = timesheetDate?.overtimeFormId;
          const dateDutyFormId = timesheetDate?.dutyFormId;
          const dateLeaveFormId = timesheetDate?.leaveFormId;

          const dateToday = moment(Date.now()).get("date");
          const monthToday = moment(Date.now()).get("month") + 1;
          const isDayOfDateGreaterThanDateToday = (date?.day ?? 0) >= dateToday; // 14
          const isMonthOfDateGreaterThanMonthToday = (date?.month ?? 0) > monthToday; // 10
          const isFuture = isDayOfDateGreaterThanDateToday || isMonthOfDateGreaterThanMonthToday;

          // declare style for wkType
          const enum WK_TYPE {
            ALL = 1,
            HALF = 2,
          }
          let dateBorderColor: string | undefined;
          switch (dateWkType) {
            case WK_TYPE.ALL:
              dateBorderColor = "#067D4E";
              break;
            case WK_TYPE.HALF:
              dateBorderColor = "#FF9C01";
              break;
            case null:
              dateBorderColor = "#F31121";
              break;
            default:
              dateBorderColor = "#F31121";
              break;
          }

          // declare style for forms
          const enum FORM_TYPE {
            LEAVE = 1,
            OT_OR_DUTY = 2,
          }
          const dots: FORM_TYPE[] = [];
          if (dateLeaveFormId) dots.push(FORM_TYPE.LEAVE);
          if (dateOtFormId || dateDutyFormId) dots.push(FORM_TYPE.OT_OR_DUTY);

          // Extracting text color logic
          const isSelected = date?.dateString === selectedDate;
          let textColor = "black";
          if (state === "disabled") {
            textColor = "gray";
          } else if (isSelected) {
            textColor = "white"; // Optional: Override for selected date
          } else if (state === "today") {
            textColor = DEFAULT_SELECTED_COLOR;
          }
          return (
            <TouchableOpacity onPress={() => onDayPressHandler(date)}>
              <View
                style={[
                  isSelected
                    ? [styles.dateContainer, { backgroundColor: DEFAULT_SELECTED_COLOR }]
                    : isFuture
                    ? { alignItems: "center" }
                    : [styles.dateContainer, { borderColor: dateBorderColor }],
                ]}
              >
                <Text style={{ color: textColor }}>{date?.day}</Text>
                {/* Custom Dot */}
                <View style={styles.dots}>
                  {dots.map((dot) => (
                    <View key={dot} style={[styles.dot, { backgroundColor: dot === FORM_TYPE.LEAVE ? "#AF32D0" : "#0B67CC" }]} />
                  ))}
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

function timsheetDataToMap(timesheetData: MonthTimesheetList) {
  //
  const timesheetDataMap: { [key: string]: MonthTimesheet } = {};
  timesheetData.forEach((dateTimesheet) => {
    timesheetDataMap[dateTimesheet.date] = dateTimesheet;
  });
  return timesheetDataMap;
}

const styles = StyleSheet.create({
  dateContainer: {
    alignItems: "center",
    borderColor: "red",
    width: 36,
    height: 36,
    borderWidth: 1,
    borderRadius: 18,
  },
  dots: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    marginTop: 2,
  },
  dot: {
    height: 8, // Dot height
    width: 8, // Dot width
    borderRadius: 4, // Circular dot
    backgroundColor: "blue", // Dot color
  },
});
