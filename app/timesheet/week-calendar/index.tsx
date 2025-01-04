import { Delayed } from "@/components/Delayed";
import { TeamWeekCalendar } from "@/components/timesheet";
import { EVENT_ITEM_PREFIX } from "@/constants/Misc";
import { dutyFormToEventItems, leaveFormToEventItems, weekCalendarToEventItems } from "@/helper/transform-data";
import { useFetchGroupDutyForms, useFetchLeaveFormsInWeekCalendar } from "@/hooks/form";
import { useFetchWeekCalendar } from "@/hooks/week-calendar";
import { EventItem, OnEventResponse } from "@howljs/calendar-kit";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";

export default function WeekCalendar() {
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>();
  const router = useRouter();

  const { weekCalendars } = useFetchWeekCalendar();
  const { dutyForms } = useFetchGroupDutyForms();
  const { leaveForms } = useFetchLeaveFormsInWeekCalendar();

  const weekCalendarEventItems = useMemo(() => weekCalendarToEventItems(weekCalendars), [weekCalendars]);
  const dutyEventItems = useMemo(() => dutyFormToEventItems(dutyForms), [dutyForms]);
  const leaveEventItems = useMemo(() => leaveFormToEventItems(leaveForms), [leaveForms]);

  const allEvents = useMemo(
    () => [...weekCalendarEventItems, ...dutyEventItems, ...leaveEventItems],
    [weekCalendarEventItems, dutyEventItems, leaveEventItems]
  );

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
    if (prefix === EVENT_ITEM_PREFIX.DUTY_FORM) {
      router.navigate({
        pathname: "/forms/duty_forms/[id]",
        params: { id: id },
      });
    }
    if (prefix === EVENT_ITEM_PREFIX.LEAVE_FORM) {
      router.navigate({
        pathname: "/forms/leave_forms/[id]",
        params: { id: id },
      });
    }
  };


  return (
    <Delayed waitBeforeShow={1000}>
      <TeamWeekCalendar onEventSelected={onEventSelected} events={allEvents} />
    </Delayed>
  );
}
