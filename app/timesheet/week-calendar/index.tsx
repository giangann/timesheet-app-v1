import { TeamWeekCalendar } from "@/components/timesheet";
import { useLocalSearchParams } from "expo-router";

type SearchParams = { viewMode: string; numberOfDays: string };

export default function WeekCalendar() {
  const params = useLocalSearchParams<SearchParams>();

  console.log({ params });
  return (
    <>
      <TeamWeekCalendar />
    </>
  );
}
