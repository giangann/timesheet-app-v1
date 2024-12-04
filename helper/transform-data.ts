import { TWeekCalendar, TWeekCalendarDetail } from "@/api/timesheet/type";
import { EVENT_COLOR, EVENT_ITEM_PREFIX } from "@/constants/Misc";
import { EventItem } from "@howljs/calendar-kit";
import { formatToISOWithMilliseconds } from "./date";
import moment from "moment";
import { TWeekCalendarCreateFormFieldsUser } from "@/types";

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
      color: EVENT_COLOR[EVENT_ITEM_PREFIX.CALENDAR],
      ...evenTime,
    };

    res.push(eventItem);
  });

  return res;
}

export function weekCalendarUsersToUserFields(weekCalendarUsers: TWeekCalendarDetail["users"]): TWeekCalendarCreateFormFieldsUser[] {
  const res: TWeekCalendarCreateFormFieldsUser[] = [];

  weekCalendarUsers.forEach((user) => {
    const field: TWeekCalendarCreateFormFieldsUser = {
      name: user.name,
      roleName: user.roleName,
      teamName: user.team.name,
      userId: user.id,
    };
    res.push(field)
  });
  return res;
}
