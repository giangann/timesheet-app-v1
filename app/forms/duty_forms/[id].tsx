import { fetchDutyFormDetail } from "@/api/form";
import { TDutyFormDetail } from "@/api/form/types";
import { EditButton } from "@/components/button";
import { DutyFormEdit } from "@/components/form";
import { DutyFormDetail } from "@/components/form/duty-form/DutyFormDetail";
import { NunitoText } from "@/components/text/NunitoText";
import { useSession } from "@/contexts/ctx";
import { MyToast } from "@/ui/MyToast";
import { useFocusEffect, useLocalSearchParams, useNavigation } from "expo-router";
import { useCallback, useLayoutEffect, useState } from "react";
import { View } from "react-native";

export default function DetailForm() {
  const [form, setForm] = useState<TDutyFormDetail | null>(null);
  const [edit, setEdit] = useState(false);

  const navigation = useNavigation();
  const { session } = useSession();
  const local = useLocalSearchParams();
  const formId = local.id;

  const toggleEditMode = () => setEdit((prev) => !prev);

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

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <EditButton isEdit={edit} onToggleEdit={toggleEditMode} />,
    });
  }, [edit, toggleEditMode]);

  return (
    <>
      {!form && (
        <View>
          <NunitoText>Fetching...</NunitoText>
        </View>
      )}

      {form && !edit && <DutyFormDetail form={form} />}

      {form && edit && <DutyFormEdit form={form} />}
    </>
  );
}
