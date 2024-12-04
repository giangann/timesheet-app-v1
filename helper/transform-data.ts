import { TWeekCalendar } from "@/api/timesheet/type";
import { EVENT_ITEM_PREFIX } from "@/constants/Misc";
import { EventItem } from "@howljs/calendar-kit";
import { formatToISOWithMilliseconds } from "./date";
import moment from "moment";

export function weekCalendarToEventItems(weekCalendars: TWeekCalendar[]): EventItem[] {
  const res: EventItem[] = [];

  weekCalendars.forEach((calendar) => {
    const evenTime: Pick<EventItem, "start" | "end"> = calendar.isAllDay
      ? {
          start: {
            date: moment(calendar.startDate).format("YYYY-MM-DD"),
          },
          end: {
            date: moment(calendar.endDate).format("YYYY-MM-DD"),
          },
        }
      : {
          start: {
            dateTime: formatToISOWithMilliseconds(calendar.startDate),
          },
          end: {
            dateTime: formatToISOWithMilliseconds(calendar.endDate),
          },
        };
    const eventItem: EventItem = {
      id: `${EVENT_ITEM_PREFIX.CALENDAR}-${calendar.id}`,
      title: `${calendar.title}: ${calendar.description}`,
      ...evenTime,
    };

    res.push(eventItem);
  });

  return res;
}
