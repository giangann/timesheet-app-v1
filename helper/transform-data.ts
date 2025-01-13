import { TWeekCalendar, TWeekCalendarDetail } from "@/api/timesheet/type";
import { EVENT_COLOR, EVENT_ITEM_PREFIX } from "@/constants/Misc";
import { EventItem } from "@howljs/calendar-kit";
import { formatToISOWithMilliseconds } from "./date";
import moment from "moment";
import { TWeekCalendarCreateFormFieldsUser } from "@/types";
import { TDutyForm, TDutyFormDetailDutyType, TLeaveForm } from "@/api/form/types";
import { arrayStringToString, combineDateAndTimeToDateObject } from "./common";

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

export function dutyFormToEventItems(dutyForms: TDutyForm[]): EventItem[] {
  const res: EventItem[] = [];

  dutyForms.forEach((form) => {
    const eventItem: EventItem = {
      id: `${EVENT_ITEM_PREFIX.DUTY_FORM}-${form.id}`,
      title: `${form.salaryCoefficientTypeName} (x${form.salaryCoefficient.toFixed(2)}); ${form.dutyTypeNames.join("+ ")}; ${arrayStringToString(form.userNames.map((user) => user.name))}`,
      color: EVENT_COLOR[EVENT_ITEM_PREFIX.DUTY_FORM],
      start: { dateTime: combineDateAndTimeToDateObject(form.date, form.startTime).toISOString() },
      end: { dateTime: combineDateAndTimeToDateObject(form.date, form.endTime).toISOString() },
    };

    res.push(eventItem);
  });

  return res;
}

export function leaveFormToEventItems(leaveForm: TLeaveForm[]): EventItem[] {
  const res: EventItem[] = [];

  leaveForm.forEach((form) => {
    const eventItem: EventItem = {
      id: `${EVENT_ITEM_PREFIX.LEAVE_FORM}-${form.id}`,
      title: `${form.leaveFormTypeName} - ${form.userName}, P.${form.userTeam.name} ${form.note ?? `- ${form.note}`}`,
      color: EVENT_COLOR[EVENT_ITEM_PREFIX.LEAVE_FORM],
      start: { date: moment(form.startDate).format("YYYY-MM-DD") },
      end: { date: moment(form.endDate).format("YYYY-MM-DD") },
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
    res.push(field);
  });
  return res;
}

export function dutyTypesToUsers(dutyTypes:TDutyFormDetailDutyType[] ):TDutyFormDetailDutyType['users'] {
  const users: TDutyFormDetailDutyType['users'] = []

  dutyTypes.forEach((dtType)=>{
    users.push(...dtType.users)
  })

  return users
}

export function dutyTypeUsersToName (dtTypeUsers: TDutyFormDetailDutyType['users']):string{
  return dtTypeUsers.map((user)=>user.name).join(', ')
}