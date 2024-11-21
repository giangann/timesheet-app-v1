import { fetchLeaveFormDetail } from "@/api/form";
import { TLeaveFormDetail, TLeaveFormEditFormFields } from "@/api/form/types";
import { useSession } from "@/contexts";
import { MyToast } from "@/ui/MyToast";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useState } from "react";

export function useEditLeaveForm() {
  const { session } = useSession();
  const router = useRouter();

  const onEdit = useCallback(
    async (fields: TLeaveFormEditFormFields) => {
      try {
        // process data from form
        console.log({ fields });
        // make request
        const createResult: any = {};

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
