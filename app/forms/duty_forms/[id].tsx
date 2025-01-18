import { fetchDutyFormDetail } from "@/api/form";
import { TDutyFormDetail } from "@/api/form/types";
import { EditButton, MyFAB } from "@/components/button";
import { DutyFormEdit } from "@/components/form";
import { DutyFormDetail } from "@/components/form/duty-form/DutyFormDetail";
import { MyModal } from "@/components/MyModal";
import { NunitoText } from "@/components/text/NunitoText";
import { FORM_STATUS } from "@/constants/Misc";
import { useSession } from "@/contexts/ctx";
import { useDeleteForm } from "@/hooks/form";
import { MyToast } from "@/ui/MyToast";
import {
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
} from "expo-router";
import { useCallback, useLayoutEffect, useMemo, useState } from "react";
import { View } from "react-native";
import { useTheme } from "react-native-paper";

export default function DetailForm() {
  const [form, setForm] = useState<TDutyFormDetail | null>(null);
  const [edit, setEdit] = useState(false);
  const [openCfCancelModal, setOpenCfCancelModal] = useState(false);

  const navigation = useNavigation();
  const { session, userInfo } = useSession();
  const local = useLocalSearchParams();
  const theme = useTheme();

  const { onDelete } = useDeleteForm();

  const formId = local.id;
  const isShowFab = useMemo(
    () => form?.status !== FORM_STATUS.CANCELED,
    [form]
  );
  const ableToDeleteOrCancel = userInfo?.id === form?.createdUserId;

  const toggleEditMode = () => setEdit((prev) => !prev);

  const onFetchDutyFormDetail = async (formId: string) => {
    const responseJson = await fetchDutyFormDetail(session, parseInt(formId));
    if (responseJson.statusCode === 200) {
      setForm(responseJson.data.dutyForm);
    } else {
      MyToast.error(responseJson.error ?? responseJson.message);
    }
  };

  const onDeleteForm = useCallback(() => {
    onDelete(form?.id ?? 0);
  }, [form]);

  useFocusEffect(
    useCallback(() => {
      onFetchDutyFormDetail(formId as string);
    }, [formId, session])
  );

    return (
    <>
      {!form && (
        <View>
          <NunitoText>Fetching...</NunitoText>
        </View>
      )}

      {form && !edit && <DutyFormDetail form={form} />}

      {form && edit && <DutyFormEdit form={form} />}

      {form && isShowFab && ableToDeleteOrCancel && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        >
          <MyFAB
            actions={[
              {
                icon: "delete",
                onPress: () => {
                  console.log("deleted");
                  setOpenCfCancelModal(true);
                },
                style: {
                  backgroundColor: theme.colors.error,
                  display: "flex",
                },
                color: "white",
              },
              {
                icon: edit ? "eye-arrow-left" : "pencil",
                onPress: toggleEditMode,
                style: {
                  backgroundColor: theme.colors.tertiary,
                  display: "flex",
                },
                color: "white",
              },
            ]}
            closingIcon={"menu"}
          />
        </View>
      )}

      {openCfCancelModal && (
        <MyModal
          title={"Xác nhận xóa đơn"}
          onClose={() => setOpenCfCancelModal(false)}
          cb={onDeleteForm}
          modalProps={{ animationType: "slide", transparent: true }}
        >
          <View>
            <NunitoText type="body3">Bạn có chắc xóa đơn trực?</NunitoText>
          </View>
        </MyModal>
      )}
    </>
  );
}
