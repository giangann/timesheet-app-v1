import { createWeekCalendar } from "@/api/timesheet";
import { TWeekCalendarCreate } from "@/api/timesheet/type";
import { useSession } from "@/contexts";
import { formatDateToISOString } from "@/helper/date";
import { TWeekCalendarCreateFormFields } from "@/types";
import { MyToast } from "@/ui/MyToast";
import { useRouter } from "expo-router";
import { useCallback } from "react";

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

  return { onCreate };
}
