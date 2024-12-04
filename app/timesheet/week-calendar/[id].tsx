import { WeekCalendarCreate } from "@/components/week-calendar";
import { WeekCalendarCreateProvider } from "@/providers";
import { useLocalSearchParams } from "expo-router";

export default function WeekCalendarDetail() {
  const local = useLocalSearchParams();
  const calendarId = local.id;

  return (
    <WeekCalendarCreateProvider>
      <WeekCalendarCreate calendarId={parseInt(String(calendarId))} />
    </WeekCalendarCreateProvider>
  );
}
