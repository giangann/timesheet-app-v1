import { CreateNewButton } from "@/components/button";
import { TeamWeekCalendar } from "@/components/timesheet";
import { weekCalendarToEventItems } from "@/helper/transform-data";
import { useFetchWeekCalendar, useWeekCalendar } from "@/hooks/week-calendar";
import { EventItem, OnEventResponse } from "@howljs/calendar-kit";
import { useNavigation, useRouter } from "expo-router";
import { useLayoutEffect, useMemo, useState } from "react";

export default function WeekCalendar() {
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>();
  const navigation = useNavigation();
  const router = useRouter();

  const { weekCalendars } = useFetchWeekCalendar();

  const weekCalendarEventItems = useMemo(() => weekCalendarToEventItems(weekCalendars), [weekCalendars]);

  const onEventSelected = (event: OnEventResponse) => {
    console.log("Selected Event:", event); // Debugging line
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <CreateNewButton
          onPressedButton={() => {
            router.navigate("/timesheet/week-calendar/create-week-calendar");
          }}
        />
      ),
    });
  }, []);
  return (
    <>
      <TeamWeekCalendar onEventSelected={onEventSelected} events={weekCalendarEventItems} />
    </>
  );
}
