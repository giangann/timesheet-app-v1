import { EditButton } from "@/components/button";
import { OvertimeFormDetail, OvertimeFormEdit } from "@/components/form";
import { NunitoText } from "@/components/text/NunitoText";
import { FORM_STATUS } from "@/constants/Misc";
import { useDetailOvertimeForm } from "@/hooks/form";
import { useNavigation, useRouter } from "expo-router";
import { useLayoutEffect, useMemo, useState } from "react";
import { View } from "react-native";

export default function DetailForm() {
  const router = useRouter();
  const navigation = useNavigation();

  const [edit, setEdit] = useState(false);
  const { form, isLoading } = useDetailOvertimeForm();

  const toggleEditMode = () => setEdit((prev) => !prev);

  const isAllowEdit = useMemo(() => form?.status === FORM_STATUS.WATING_APPROVE, [form]);

  useLayoutEffect(() => {
    if (!isAllowEdit) return;
    navigation.setOptions({
      headerRight: () => <EditButton isEdit={edit} onToggleEdit={toggleEditMode} />,
    });
  }, [router, edit, toggleEditMode, isAllowEdit]);

  return (
    <>
      {!form && isLoading && (
        <View>
          <NunitoText>Fetching...</NunitoText>
        </View>
      )}

      {form && !edit && <OvertimeFormDetail form={form} />}

      {form && edit && <OvertimeFormEdit form={form} />}
    </>
  );
}
