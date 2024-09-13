import { Calendar, CalendarList, Agenda, CalendarProvider, LocaleConfig } from "react-native-calendars";
import { Text, View } from "react-native";
import { MonthTimesheet, MonthTimesheetList, timesheetMockResponse } from "@/constants/Misc";
import { DateData, MarkedDates } from "react-native-calendars/src/types";
import { MarkingProps } from "react-native-calendars/src/calendar/day/marking";
import { DayProps } from "react-native-calendars/src/calendar/day";

const renderCustomDay = ({
  date,
  state,
}: DayProps & {
  date?: DateData;
}) => {
  return (
    <View style={{ alignItems: "center" }}>
      <Text style={{ color: state === "disabled" ? "gray" : "black" }}>{date?.day}</Text>
      {/* Custom Dot */}
      <View
        style={{
          height: 10, // Dot height
          width: 10, // Dot width
          borderRadius: 5, // Circular dot
          backgroundColor: "red", // Dot color
          marginTop: 2,
        }}
      />
    </View>
  );
};

export const BasicCalendar = () => {
  const vacation = { key: "vacation", color: "red", selectedDotColor: "blue" };
  const massage = { key: "massage", color: "blue", selectedDotColor: "blue" };
  const workout = { key: "workout", color: "green" };

  const dataMap = processTimesheetDataList(timesheetMockResponse.timesheet);
  const markedDatesMap = dataMapToMarkDates(dataMap);

  console.log("dataMap", markedDatesMap);

  return (
    <View>
      <Calendar
        dayComponent={({ date, state }) => {
          return renderCustomDay({ date, state });
        }}
        // markedDates={{
        //   "2024-09-13": {
        //     customStyles: {
        //       container: {
        //         backgroundColor: "transparent", // Set background as needed
        //       },
        //       text: {
        //         color: "black", // Custom text color
        //       },
        //     },
        //     dots: [{ key: "customDot", color: "red", size: 10 }], // Add custom dot here
        //   },
        // }}
        // markingType={"multi-dot"} // Set to 'multi-dot' to control dot appearance
        // markedDates={{
        //   "2024-09-09": {
        //     // dots: [vacation, massage, workout],
        //     // selected: true,
        //     // selectedColor: "red",
        //     periods: [
        //       { startingDay: true, endingDay: true, color: "#5f9ea0" },
        //       { startingDay: false, endingDay: true, color: "#ffa500" },
        //       { startingDay: true, endingDay: false, color: "#f0e68c" },
        //     ],
        //   },
        //   "2024-09-08": { dots: [massage, workout], disabled: true },
        // }}
      />
    </View>
  );
};

function processTimesheetDataList(dataList: MonthTimesheetList): Map<string, MonthTimesheet> {
  const timesheetMap = new Map<string, MonthTimesheet>();

  for (const dataItem of dataList) {
    timesheetMap.set(dataItem.date, dataItem);
  }

  return timesheetMap;
}

type MarkDateObj = {
  date: string;
  marked: boolean;
  dotColor: string;
};
function dataMapToMarkDates(dataMap: Map<string, MonthTimesheet>): MarkedDates {
  const markedDatesArray: MarkDateObj[] = Array.from(dataMap.entries()).map(([key, monthTimesheet]) => {
    let color: string;
    switch (monthTimesheet.workingTypeId) {
      case 1:
        color = "green";
        break;
      case 2:
        color = "orange";
        break;
      default:
        color = "red";
        break;
    }
    return {
      date: key, // assuming `key` is the date
      marked: true,
      dotColor: color,
    };
  });

  const markDatesMap: MarkedDates = {};
  markedDatesArray.forEach(
    (markedDate) =>
      (markDatesMap[markedDate.date] = {
        marked: markedDate.marked,
        dotColor: markedDate.dotColor,
        customStyles: {
          container: {
            borderRadius: 5, // make the dot bigger
            height: 20, // control height
            width: 10, // control width
          },
        },
      })
  );

  return markDatesMap;
}
