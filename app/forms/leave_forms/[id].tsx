import { MyFAB } from "@/components/button/MyFab";
import { LeaveFormDetail, LeaveFormEdit } from "@/components/form";
import { MyModal } from "@/components/MyModal";
import { NunitoText } from "@/components/text/NunitoText";
import { OPACITY_TO_HEX } from "@/constants/Colors";
import { FORM_STATUS } from "@/constants/Misc";
import { BASE_URL } from "@/constants/System";
import { useSession } from "@/contexts";
import { paramsObjectToQueryString } from "@/helper/common";
import { useDetailLeaveForm } from "@/hooks/form";
import { MyToast } from "@/ui/MyToast";
import { useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useTheme } from "react-native-paper";

export default function DetailOrEditForm() {
  const router = useRouter();
  const [edit, setEdit] = useState(false);
  const { form, isLoading } = useDetailLeaveForm();
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
      const endpoint = `/leave-forms/cancel`;
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

      {form && !edit && <LeaveFormDetail form={form} />}

      {form && edit && <LeaveFormEdit form={form} />}

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
            <NunitoText type="body3">Bạn có chắc xóa đơn xin nghỉ?</NunitoText>
          </View>
        </MyModal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    minHeight: "100%",
  },
  listBox: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 100,
    gap: 20,
  },
  item: {
    gap: 4,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: `#000000${OPACITY_TO_HEX["15"]}`,
  },
  approveContainer: {
    position: "absolute",
    bottom: 0,
    // left: 0, // make button on the right
    right: 0,
    padding: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 6,
  },
  buttonItem: {
    flexGrow: 1,
  },
  buttonContained: {
    height: 44,
  },
});
