import { fetchOvertimeFormDetail } from "@/api/form";
import { TOvertimeFormDetail, TOvertimeFormEdit, TOvertimeFormEditFormFields } from "@/api/form/types";
import { useSession } from "@/contexts";
import { logFormData } from "@/helper/common";
import { formatDateToLocalString } from "@/helper/date";
import { MyToast } from "@/ui/MyToast";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import moment from "moment";
import { useCallback, useState } from "react";
import { BASE_URL } from "@/constants/System";

export function useEditOvertimeForm() {
  const { session } = useSession();
  const router = useRouter();

  const onEdit = useCallback(
    async (overtimeFormId: number, fields: TOvertimeFormEditFormFields) => {
      try {
        // process data from form
        console.log({ fields });

        const bodyData: TOvertimeFormEdit = {};

        if (fields.date) bodyData["date"] = moment(fields.date).format("YYYY-MM-DD");
        if (fields.startTime) bodyData["startTime"] = moment(fields.startTime).format("HH:mm:ss");
        if (fields.endTime) bodyData["endTime"] = moment(fields.endTime).format("HH:mm:ss");
        if (fields.salaryCoefficientTypeId) bodyData["salaryCoefficientTypeId"] = fields.salaryCoefficientTypeId;
        if (fields.userApproveIdentifyCard) bodyData["userApproveIdentifyCard"] = fields.userApproveIdentifyCard;
        if (fields.note) bodyData["note"] = fields.note;
        if (fields.attachFile) bodyData["attachFile"] = fields.attachFile;

        const formData = new FormData();

        Object.entries(bodyData).forEach(([k, v]) => {
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
        const endpoint = `/overtime-forms?id=${overtimeFormId}`;
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
export function useDetailOvertimeForm() {
  const { session } = useSession();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<TOvertimeFormDetail | null>(null);
  const local = useLocalSearchParams();
  const formId = local.id;

  const onFetchFormDetail = useCallback(async () => {
    setLoading(true);
    try {
      const responseJson = await fetchOvertimeFormDetail(session, parseInt(String(formId)));

      if (responseJson.statusCode === 200) {
        setForm(responseJson.data.overtimeFormDetail);
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
