import { Calendar, CalendarList, Agenda, CalendarProvider, LocaleConfig } from "react-native-calendars";
import { View } from "react-native";

export const BasicCalendar = () => {
  const vacation = { key: "vacation", color: "red", selectedDotColor: "blue" };
  const massage = { key: "massage", color: "blue", selectedDotColor: "blue" };
  const workout = { key: "workout", color: "green" };
  return (
    <View>
      <Calendar
        // markedDates={{
        //   "2024-09-10": { marked: true, dotColor: "red" },
        // }}

        markingType={"multi-period"}
        markedDates={{
          "2024-09-09": {
            // dots: [vacation, massage, workout],
            // selected: true,
            // selectedColor: "red",
            periods: [
              { startingDay: true, endingDay: true, color: "#5f9ea0" },
              { startingDay: false, endingDay: true, color: "#ffa500" },
              { startingDay: true, endingDay: false, color: "#f0e68c" },
            ],
          },
          "2024-09-08": { dots: [massage, workout], disabled: true },
        }}
      />
    </View>
  );
};
