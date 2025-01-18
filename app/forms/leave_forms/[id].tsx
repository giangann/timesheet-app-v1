import { EditButton, MyFab } from "@/components/button";
import { LeaveFormDetail, LeaveFormEdit } from "@/components/form";
import { MyModal } from "@/components/MyModal";
import { NunitoText } from "@/components/text/NunitoText";
import { OPACITY_TO_HEX } from "@/constants/Colors";
import { FORM_STATUS } from "@/constants/Misc";
import { useSession } from "@/contexts";
import { paramsObjectToQueryString } from "@/helper/common";
import { useDetailLeaveForm } from "@/hooks/form";
import { MyToast } from "@/ui/MyToast";
import { useNavigation, useRouter } from "expo-router";
import { useCallback, useLayoutEffect, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, useTheme } from "react-native-paper";

export default function DetailOrEditForm() {
  const router = useRouter();
  const navigation = useNavigation();

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

  const onDeleteForm = useCallback(async () => {
    try {
      const token = `Bearer ${session}`;

      const baseUrl = "https://chamcong.vptw.dcs.vn/api/api/v1";
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

  useLayoutEffect(() => {
    if (!isAllowEdit) return;
    navigation.setOptions({
      headerRight: () => (
        <EditButton isEdit={edit} onToggleEdit={toggleEditMode} />
      ),
    });
  }, [router, edit, toggleEditMode, isAllowEdit]);

  return (
    <View>
      {!form && isLoading && (
        <View>
          <NunitoText>Fetching...</NunitoText>
        </View>
      )}

      {form && !edit && <LeaveFormDetail form={form} />}

      {form && edit && <LeaveFormEdit form={form} />}

      {form?.status === FORM_STATUS.WATING_APPROVE && (
        // <View style={styles.approveContainer}>
        //   <Button
        //     onPress={() => setOpenCfCancelModal(true)}
        //     mode="contained"
        //     icon="delete-alert"
        //     buttonColor={theme.colors.error}
        //     style={styles.buttonContained}
        //   >
        //     Xóa đơn
        //   </Button>
        // </View>
        <MyFab
          actions={[
            {
              icon: "delete",
              onPress: () => {},
              label: "Xoa don",
            },
            {
              icon: edit ? "eye-arrow-left" : "edit",
              onPress: () => setEdit(!edit),
              label: edit ? "Xem" : "Sua",
            },
          ]}
        />
      )}

      {/* Fab Group */}
      {/* Fab Item: delete onClick = ()=>{open confirm delete modal} */}
      {/* Fab Item: edit === true ? view mode onClick = ()=>setEdit(false) : edit mode onClick = ()=>setEdit(true) */}

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
