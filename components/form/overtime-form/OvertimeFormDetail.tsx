import { TOvertimeFormDetail } from "@/api/form/types";
import { MyModal } from "@/components/MyModal";
import { ViewImageFullScreen } from "@/components/ViewImageFullScreen";
import { NunitoText } from "@/components/text/NunitoText";
import { OPACITY_TO_HEX } from "@/constants/Colors";
import { FORM_STATUS } from "@/constants/Misc";
import { useSession } from "@/contexts";
import { paramsObjectToQueryString } from "@/helper/common";
import { BoxStatus } from "@/ui/BoxStatus";
import { MyToast } from "@/ui/MyToast";
import { useRouter } from "expo-router";
import moment from "moment";
import { memo, useCallback, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button, useTheme } from "react-native-paper";

type OvertimeFormDetailProps = {
  form: TOvertimeFormDetail;
};

export const OvertimeFormDetail: React.FC<OvertimeFormDetailProps> = memo(({ form }) => {
  const [openCfCancelModal, setOpenCfCancelModal] = useState(false);
  const { session } = useSession();
  const router = useRouter();
  const theme = useTheme();

  const onDeleteForm = useCallback(async () => {
    try {
      const token = `Bearer ${session}`;

      const baseUrl = "https://chamcong.vptw.dcs.vn/api/api/v1";
      const endpoint = `/overtime-forms/cancel`;
      const querystring = paramsObjectToQueryString({ id: form.id });
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
    <>
      {!form && (
        <View>
          <NunitoText>Fetching...</NunitoText>
        </View>
      )}

      {form && (
        <View style={styles.container}>
          <ScrollView contentContainerStyle={styles.listBox}>
            <BoxStatus status={form.status} approveDate={form.approveDate} />
            <Item title="Thời gian" content={`${moment(form.date).format("DD/MM/YYYY")} (${form.startTime} --> ${form.endTime})`} />
            <Item title="Loại ngoài giờ" content={`${form.salaryCoefficientType.name} (x${form.salaryCoefficientType.coefficient.toFixed(2)})`} />
            <Item title="Nội dung công việc" content={form.note} />
            <Item title="Người phê duyệt" content={`${form.userApproveName} (${form.userApproveRole.name})`} />

            {/* Attach Image */}
            <AttachImageFile path={form.attachFilePath} />
          </ScrollView>

          {form.status === FORM_STATUS.WATING_APPROVE && (
            <View style={styles.approveContainer}>
              <Button
                onPress={() => setOpenCfCancelModal(true)}
                mode="contained"
                icon="delete-alert"
                buttonColor={theme.colors.error}
                style={styles.buttonContained}
              >
                Xóa đơn
              </Button>
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
                <NunitoText type="body3">Bạn có chắc xóa đơn làm ngoài giờ?</NunitoText>
              </View>
            </MyModal>
          )}
        </View>
      )}
    </>
  );
});

const Item = ({ title, content }: { title: string; content: string }) => {
  return (
    <View style={styles.item}>
      <NunitoText type="body3" style={{ opacity: 0.5 }}>
        {title}
      </NunitoText>
      <NunitoText type="body3">{content}</NunitoText>
    </View>
  );
};

const AttachImageFile = ({ path }: { path: string | null | undefined }) => {
  return (
    <View>
      <NunitoText type="body3" style={{ opacity: 0.5, marginBottom: 4 }}>
        {"Ảnh đính kèm"}
      </NunitoText>
      {!path && <NunitoText type="body3">{"Không có ảnh đính kèm"}</NunitoText>}
      {path && <ViewImageFullScreen imagePath={path} />}
    </View>
  );
};

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
