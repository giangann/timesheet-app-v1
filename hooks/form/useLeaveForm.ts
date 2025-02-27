import { fetchLeaveFormDetail, fetchLeaveFormsInWeekCalendar } from "@/api/form";
import { TLeaveForm, TLeaveFormDetail, TLeaveFormEditFormFields } from "@/api/form/types";
import { useSession } from "@/contexts";
import { logFormData } from "@/helper/common";
import { formatDateToLocalString } from "@/helper/date";
import { TPagiParams } from "@/types";
import { MyToast } from "@/ui/MyToast";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { BASE_URL } from "@/constants/System";

export function useEditLeaveForm() {
  const { session } = useSession();
  const router = useRouter();

  const onEdit = useCallback(
    async (leaveFormId: number, fields: TLeaveFormEditFormFields) => {
      try {
        // process data from form
        console.log({ fields });

        const formData = new FormData();

        Object.entries(fields).forEach(([k, v]) => {
          if (v !== null && v !== undefined) {
            if (typeof v === "number") formData.append(k, v.toString());
            else if (v instanceof Date) {
              const formattedDate = formatDateToLocalString(v); // 'yyyy-MM-ddTHH:mm:ss'<=>(2024-09-11T23:25:00) if dont slice the format be like: '2024-09-11T23:25:00.000Z'
              formData.append(k, formattedDate);
            } else formData.append(k, v as File);
          }
        });
        logFormData(formData);

        // make request
        const token = `Bearer ${session}`;
        const baseUrl = BASE_URL;
        const endpoint = `/leave-forms?id=${leaveFormId}`;
        const url = `${baseUrl}${endpoint}`;

        const response = await fetch(url, {
          method: "PUT",
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: token,
          }, // do not set content-type for formData, let browser do it automatically
          body: formData,
          credentials: "include",
        });

        const responseJson = await response.json();

        // process response
        if (responseJson.statusCode === 200) {
          MyToast.success("Thành công");
          router.back();
        } else {
          MyToast.error(responseJson.error ?? responseJson.message);
        }
      } catch (error: any) {
        MyToast.error(error.message);
      }
    },
    [session]
  );

  return { onEdit };
}

export function useDetailLeaveForm() {
  const { session } = useSession();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<TLeaveFormDetail | null>(null);
  const local = useLocalSearchParams();
  const formId = local.id;

  const onFetchFormDetail = useCallback(async () => {
    setLoading(true);
    try {
      const responseJson = await fetchLeaveFormDetail(session, parseInt(String(formId)));

      if (responseJson.statusCode === 200) {
        setForm(responseJson.data.leaveFormDetail);
      } else {
        MyToast.error(responseJson.error ?? responseJson.message);
      }
    } catch (error: any) {
      MyToast.error(error.message);
    } finally {
      setLoading(false);
    }
  }, [session, formId]);

  useFocusEffect(
    useCallback(() => {
      onFetchFormDetail();
    }, [formId, session])
  );

  return { isLoading: loading, form, refetch: onFetchFormDetail };
}

export function useFetchLeaveFormsInWeekCalendar() {
  const [leaveForms, setLeaveForms] = useState<TLeaveForm[]>([]);
  const [loading, setLoading] = useState(false);
  const { session } = useSession();

  const onFetchLeaveForms = useCallback(
    async (pagiParams?: TPagiParams) => {
      setLoading(true);
      try {
        const responseJson = await fetchLeaveFormsInWeekCalendar(session, pagiParams);

        if (responseJson.statusCode === 200) {
          setLeaveForms(responseJson.data.leaveForms);
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

  useFocusEffect(
    useCallback(() => {
      onFetchLeaveForms({ page: 0, size: 50 });
    }, [session])
  );
  return { isLoading: loading, leaveForms, refetch: onFetchLeaveForms };
}
