import { CreateNewButton } from "@/components/button";
import { TeamWeekCalendar } from "@/components/timesheet";
import { EVENT_ITEM_PREFIX } from "@/constants/Misc";
import { weekCalendarToEventItems } from "@/helper/transform-data";
import { useFetchWeekCalendar } from "@/hooks/week-calendar";
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

    // analyst eventId
    const [prefix, id] = event.id.split("-");
    if (prefix === EVENT_ITEM_PREFIX.CALENDAR) {
      router.navigate({
        pathname: "/timesheet/week-calendar/[id]",
        params: { id: id },
      });
    }
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
