import { createHoliday, deleteHoliday, editHoliday, fetchHoliday, fetchHolidaysByYear } from "@/api/setting";
import { THoliday, THolidayCreate, THolidayDetail, THolidayEdit } from "@/api/setting/type";
import { useSession } from "@/contexts";
import { MyToast } from "@/ui/MyToast";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";

export function useFetchHolidays(year: number) {
  const [holidays, setHolidays] = useState<THoliday[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { session } = useSession();

  const onFetchHolidays = useCallback(async () => {
    try {
      setLoading(true);
      const responseJson = await fetchHolidaysByYear(session, { year });

      if (responseJson.statusCode === 200) {
        setHolidays(responseJson.data.holidays);
      } else {
        MyToast.error(responseJson.error ?? responseJson.message);
      }
    } catch (error: any) {
      MyToast.error(error?.message || "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  }, [year, session]); // Include `session` in dependencies.

  useFocusEffect(
    useCallback(() => {
      onFetchHolidays();
    }, [onFetchHolidays]) // Depend only on `onFetchHolidays`.
  );

  return { holidays, loading, onFetchHolidays };
}

export function useHolidayDetail() {
  const { session } = useSession();
  const [loading, setLoading] = useState(false);
  const [holiday, setHoliday] = useState<THolidayDetail | null>(null);

  const onFetchHoliday = useCallback(
    async (holidayId: number) => {
      setLoading(true);
      try {
        const responseJson = await fetchHoliday(session, holidayId);

        if (responseJson.statusCode === 200) {
          setHoliday(responseJson.data.holiday);
          return responseJson.data.holiday;
        } else {
          MyToast.error(responseJson.error ?? responseJson.message);
        }
      } catch (error: any) {
        MyToast.error(error.message);
      } finally {
        setLoading(false);
      }
    },
    [session]
  );

  return { isLoading: loading, holiday, onFetchHoliday };
}

export function useCreateHoliday() {
  const [loading, setLoading] = useState(false);
  const { session } = useSession();
  const router = useRouter();

  const onCreateHoliday = useCallback(
    async (data: THolidayCreate) => {
      try {
        setLoading(true);

        const responseJson = await createHoliday(session, data);
        if (responseJson.statusCode === 200) {
          MyToast.success("Thành công");
          router.back();
        } else {
          MyToast.error(responseJson.error);
        }
      } catch (error: any) {
        MyToast.error(error.message);
      } finally {
        setLoading(false);
      }
    },
    [session, router]
  );

  return { onCreateHoliday, loading };
}

export function useEditHoliday() {
  const [loading, setLoading] = useState(false);
  const { session } = useSession();
  const router = useRouter();

  const onEditHoliday = useCallback(
    async (holidayId: number, data: THolidayEdit) => {
      try {
        setLoading(true);

        const responseJson = await editHoliday(session, holidayId, data);
        if (responseJson.statusCode === 200) {
          MyToast.success("Thành công");
          router.back();
        } else {
          MyToast.error(responseJson.error);
        }
      } catch (error: any) {
        MyToast.error(error.message);
      } finally {
        setLoading(false);
      }
    },
    [session, router]
  );

  return { onEditHoliday, loading };
}

export function useDeleteHoliday() {
  const [loading, setLoading] = useState(false);
  const { session } = useSession();

  const onDeleteHoliday = useCallback(
    async (holidayId: number) => {
      try {
        setLoading(true);
        const responseJson = await deleteHoliday(session, holidayId);
        if (responseJson.statusCode === 200) {
          MyToast.success("Xóa thành công");
        } else {
          MyToast.error(responseJson.error);
        }
      } catch (error: any) {
        MyToast.error(error.message);
      } finally {
        setLoading(false);
      }
    },
    [session]
  );
  return { loading, onDeleteHoliday };
}
