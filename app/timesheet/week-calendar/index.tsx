import { NunitoText } from "@/components/text/NunitoText";
import { TeamWeekCalendar } from "@/components/timesheet";
import { View } from "react-native";

export default function WeekCalendarOfTeam() {
  return (
    <View>
      <NunitoText>Week calendars</NunitoText>

      <TeamWeekCalendar />
    </View>
  );
}
