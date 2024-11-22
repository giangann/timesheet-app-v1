import { fetchDutyFormDetail } from "@/api/form";
import { TDutyFormDetail } from "@/api/form/types";
import { DutyFormDetail } from "@/components/form/duty-form/DutyFormDetail";
import { useSession } from "@/contexts/ctx";
import { MyToast } from "@/ui/MyToast";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";

export default function DetailForm() {
  const [form, setForm] = useState<TDutyFormDetail | null>(null);

  const { session } = useSession();
  const local = useLocalSearchParams();
  const formId = local.id;

  const onFetchDutyFormDetail = async (formId: string) => {
    const responseJson = await fetchDutyFormDetail(session, parseInt(formId));
    if (responseJson.statusCode === 200) {
      setForm(responseJson.data.dutyForm);
    } else {
      MyToast.error(responseJson.error ?? responseJson.message);
    }
  };

  useFocusEffect(
    useCallback(() => {
      onFetchDutyFormDetail(formId as string);
    }, [formId, session])
  );

  return (
    <>
      <DutyFormDetail form={form} />
    </>
  );
}
