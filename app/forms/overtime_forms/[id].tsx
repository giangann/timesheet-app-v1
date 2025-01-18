import { MyFAB } from "@/components/button";
import { OvertimeFormDetail, OvertimeFormEdit } from "@/components/form";
import { MyModal } from "@/components/MyModal";
import { NunitoText } from "@/components/text/NunitoText";
import { FORM_STATUS } from "@/constants/Misc";
import { BASE_URL } from "@/constants/System";
import { useSession } from "@/contexts";
import { paramsObjectToQueryString } from "@/helper/common";
import { useDetailOvertimeForm } from "@/hooks/form";
import { MyToast } from "@/ui/MyToast";
import { useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { View } from "react-native";
import { useTheme } from "react-native-paper/src/core/theming";

export default function DetailForm() {
  const router = useRouter();
  const [edit, setEdit] = useState(false);
  const { form, isLoading } = useDetailOvertimeForm();
  const [openCfCancelModal, setOpenCfCancelModal] = useState(false);
  const { session } = useSession();
  const theme = useTheme();

  const toggleEditMode = () => setEdit((prev) => !prev);

  const isAllowEdit = useMemo(
    () => form?.status === FORM_STATUS.WATING_APPROVE,
    [form]
  );

  const isAllowDelete = useMemo(
    () => form?.status === FORM_STATUS.WATING_APPROVE,
    [form]
  );

  const isShowFab = useMemo(
    () => form?.status !== FORM_STATUS.CANCELED,
    [form]
  );

  const onDeleteForm = useCallback(async () => {
    try {
      const token = `Bearer ${session}`;

      const baseUrl = BASE_URL;
      const endpoint = `/overtime-forms/cancel`;
      const querystring = paramsObjectToQueryString({ id: form?.id });
      const url = `${baseUrl}${endpoint}${querystring}`;

      const response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json", Authorization: token },
        credentials: "include",
      });
      const responseJson = await response.json();
      if (responseJson.statusCode === 200) {
        MyToast.success("Xóa thành công");
        router.back();
      } else {
        MyToast.error(responseJson.error);
      }
    } catch (error: any) {
      MyToast.error(error.message);
    }
  }, [form, session]);

  return (
    <View>
      {!form && isLoading && (
        <View>
          <NunitoText>Fetching...</NunitoText>
        </View>
      )}

      {form && !edit && <OvertimeFormDetail form={form} />}

      {form && edit && <OvertimeFormEdit form={form} />}

      {form && isShowFab && (
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
                  display: isAllowDelete ? "flex" : "none",
                },
                color: "white",
              },
              {
                icon: edit ? "eye-arrow-left" : "pencil",
                onPress: toggleEditMode,
                style: {
                  backgroundColor: theme.colors.tertiary,
                  display: isAllowEdit ? "flex" : "none",
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
            <NunitoText type="body3">
              Bạn có chắc xóa đơn làm ngoài giờ?
            </NunitoText>
          </View>
        </MyModal>
      )}
    </View>
  );
}
