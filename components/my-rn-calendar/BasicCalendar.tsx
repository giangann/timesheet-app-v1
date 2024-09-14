import { MonthTimesheet, MonthTimesheetList, timesheetMockResponse } from "@/constants/Misc";
import moment from "moment";
import { StyleSheet, Text, View } from "react-native";
import { Calendar } from "react-native-calendars";

export const BasicCalendar = () => {
  const timesheetDataMap = timsheetDataToMap(timesheetMockResponse.timesheet);
  return (
    <View>
      <Calendar
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

          return (
            <View style={isFuture ? { alignItems: "center" } : [styles.dateContainer, { borderColor: dateBorderColor }]}>
              <Text style={{ color: state === "disabled" ? "gray" : state === "today" ? "#00adf5" : "black" }}>{date?.day}</Text>
              {/* Custom Dot */}
              <View style={styles.dots}>
                {dots.map((dot) => (
                  <View style={[styles.dot, { backgroundColor: dot === FORM_TYPE.LEAVE ? "#AF32D0" : "#0B67CC" }]} />
                ))}
              </View>
            </View>
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
