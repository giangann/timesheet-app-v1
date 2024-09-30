import { THoliday } from "@/api/setting/type";
import { useMemo } from "react";
import { Calendar } from "react-native-calendars";
import { DateData, MarkedDates } from "react-native-calendars/src/types";

type Props = {
  holidays: THoliday[];
  onDateChange: (newDateString: string) => void;
};
export const HolidaysCalendar: React.FC<Props> = ({ holidays, onDateChange }) => {
  const markedHolidays = useMemo(() => holidaysToMarkedDates(holidays), [holidays]);

  const onDayPressHandler = (date: DateData | undefined) => {
    if (!date) return;
    //
    onDateChange(date.dateString);
  };
  return (
    <Calendar
      // Collection of dates that have to be marked. Default = {}
      markedDates={markedHolidays}
      onDayPress={onDayPressHandler}
    />
  );
};

function holidaysToMarkedDates(holidays: THoliday[]): MarkedDates {
  const markedDates: MarkedDates = {};

  for (const hol of holidays) {
    markedDates[hol.date] = { marked: true, dotColor: "green" };
  }

  return markedDates;
}
