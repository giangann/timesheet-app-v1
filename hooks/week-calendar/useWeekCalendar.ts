import { createWeekCalendar, fetchWeekCalendar, fetchWeekCalendarDetail, updateWeekCalendar } from "@/api/timesheet";
import { TWeekCalendar, TWeekCalendarCreate, TWeekCalendarDetail, TWeekCalendarUpdate } from "@/api/timesheet/type";
import { useSession } from "@/contexts";
import { formatDateToISOString } from "@/helper/date";
import { TWeekCalendarCreateFormFields } from "@/types";
import { MyToast } from "@/ui/MyToast";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";

export function useWeekCalendar() {
  const { session } = useSession();
  const router = useRouter();

  const onCreate = useCallback(
    async (fields: TWeekCalendarCreateFormFields) => {
      try {
        // process data from form
        const userIds: TWeekCalendarCreate["userIds"] = fields.users.map((field) => field.userId); // ok

        const reqBodyData: TWeekCalendarCreate = {
          userIds: userIds,
          startDate: formatDateToISOString(fields.startDate ?? new Date()),
          endDate: formatDateToISOString(fields.endDate ?? new Date()),
          title: fields.title ?? "",
          description: fields.description ?? "",
          isAllDay: fields.isAllDay,
        };

        // make request
        const createResult = await createWeekCalendar(session, reqBodyData);

        // process response
        if (createResult.statusCode === 200) {
          MyToast.success("Thành công");
          router.back();
        } else {
          MyToast.error(createResult.error ?? createResult.message);
        }
      } catch (error: any) {
        MyToast.error(error.message);
      }
    },
    [session]
  );

  const onUpdate = useCallback(
    async (calendarId: number, fields: TWeekCalendarCreateFormFields) => {
      try {
        // process data from form
        const userIds: TWeekCalendarCreate["userIds"] = fields.users.map((field) => field.userId); // ok

        const reqBodyData: TWeekCalendarUpdate = {
          userIds: userIds,
          startDate: formatDateToISOString(fields.startDate ?? new Date()),
          endDate: formatDateToISOString(fields.endDate ?? new Date()),
          title: fields.title ?? "",
          description: fields.description ?? "",
          isAllDay: fields.isAllDay,
        };

        // make request
        const updateResult = await updateWeekCalendar(session, calendarId, reqBodyData);

        // process response
        if (updateResult.statusCode === 200) {
          MyToast.success("Thành công");
          router.back();
        } else {
          MyToast.error(updateResult.error ?? updateResult.message);
        }
      } catch (error: any) {
        MyToast.error(error.message);
      }
    },
    [session]
  );

  return { onCreate, onUpdate };
}

export function useFetchWeekCalendar() {
  const [weekCalendars, setWeekCalendars] = useState<TWeekCalendar[]>([]);
  const { session } = useSession();
  const [loading, setLoading] = useState(false);

  const onFetchWeekCalendars = async () => {
    try {
      setLoading(true);
      // create http request
      const responseJson = await fetchWeekCalendar(session);

      // handle response
      if (responseJson.statusCode === 200) {
        setWeekCalendars(responseJson.data.weekCalendars);
      } else {
        MyToast.error(responseJson.error ?? responseJson.message);
      }
    } catch (error: any) {
      MyToast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      onFetchWeekCalendars();
    }, [])
  );

  return { weekCalendars, refetch: onFetchWeekCalendars, isLoading: loading };
}

export function useFetchWeekCalendarDetail() {
  const [weekCalendar, setWeekCalendar] = useState<TWeekCalendarDetail | null>(null);
  const { session } = useSession();
  const [loading, setLoading] = useState(false);

  const onFetchWeekCalendarDetail = async (calendarId: number) => {
    try {
      setLoading(true);
      // create http request
      const responseJson = await fetchWeekCalendarDetail(session, calendarId);

      // handle response
      if (responseJson.statusCode === 200) {
        setWeekCalendar(responseJson.data.weekCalendar);
        return responseJson.data.weekCalendar;
      } else {
        MyToast.error(responseJson.error ?? responseJson.message);
      }
    } catch (error: any) {
      MyToast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { weekCalendar, onFetchWeekCalendarDetail, isLoading: loading };
}
