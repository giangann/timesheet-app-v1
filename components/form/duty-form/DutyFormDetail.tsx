import { TDutyFormDetail } from "@/api/form/types";
import { MyModal } from "@/components/MyModal";
import { ViewImageFullScreen } from "@/components/ViewImageFullScreen";
import { NunitoText } from "@/components/text/NunitoText";
import { OPACITY_TO_HEX } from "@/constants/Colors";
import { useSession } from "@/contexts";
import { BoxStatus } from "@/ui/BoxStatus";
import { MyToast } from "@/ui/MyToast";
import { useRouter } from "expo-router";
import moment from "moment";
import { memo, useCallback, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button, useTheme } from "react-native-paper";
import { DutyFormDetailDutyTypes } from "./DutyFormDetailDutyTypes";

type DutyFormDetailProps = {
  form: TDutyFormDetail | null;
};
export const DutyFormDetail: React.FC<DutyFormDetailProps> = memo(({ form }) => {
  const [openCfCancelModal, setOpenCfCancelModal] = useState(false);
  const { session, userInfo } = useSession();
  const router = useRouter();
  const theme = useTheme();

  const ableToDeleteOrCancel = userInfo?.id === form?.createdUserId;

  const onDeleteForm = useCallback(async () => {
    try {
      const token = `Bearer ${session}`;

      const baseUrl = "https://proven-incredibly-redbird.ngrok-free.app/api/v1";
      const endpoint = `/duty-forms/${form?.id}`;
      const url = `${baseUrl}${endpoint}`;

      const response = await fetch(url, {
        method: "DELETE",
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
            <Item title="Ngày trực" content={`${moment(form.date).format("DD/MM/YYYY")}`} />
            <Item title="Giờ trực" content={`${form.startTime} --> ${form.endTime}`} />

            <Item title="Loại trực" content={<DutyFormDetailDutyTypes formDutyTypes={form.dutyTypes} />} />
            <Item title="Loại ngoài giờ" content={`${form.salaryCoefficientTypeName} (x${form.salaryCoefficient.toFixed(2)})`} />

            <Item title="Ghi chú" content={form.note ?? "Không có ghi chú"} />
            <Item title="Người phê duyệt" content={`${form.approvedUserName}`} />

            {/* Attach Image */}
            <AttachImageFile path={form?.attachFileUrl} />
          </ScrollView>

          {ableToDeleteOrCancel && (
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
                <NunitoText type="body3">Bạn có chắc xóa đơn trực?</NunitoText>
              </View>
            </MyModal>
          )}
        </View>
      )}
    </>
  );
});

const Item = ({ title, content }: { title: string; content: string | React.ReactNode }) => {
  return (
    <View style={styles.item}>
      <NunitoText type="body3" style={{ opacity: 0.5 }}>
        {title}
      </NunitoText>
      {typeof content === "string" && <NunitoText type="body3">{content}</NunitoText>}
      {typeof content === "object" && content}
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
