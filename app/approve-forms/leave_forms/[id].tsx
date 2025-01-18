import { TLeaveFormDetail } from "@/api/form/types";
import { MyModal } from "@/components/MyModal";
import { ViewImageFullScreen } from "@/components/ViewImageFullScreen";
import { NunitoText } from "@/components/text/NunitoText";
import { OPACITY_TO_HEX } from "@/constants/Colors";
import { FORM_STATUS } from "@/constants/Misc";
import { BASE_URL } from "@/constants/System";
import { useSession } from "@/contexts/ctx";
import { BoxStatus } from "@/ui/BoxStatus";
import { MyToast } from "@/ui/MyToast";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import moment from "moment";
import { useCallback, useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

export default function DetailForm() {
  const [form, setForm] = useState<TLeaveFormDetail | null>(null);
  const [openCfAcceptModal, setOpenCfAcceptModal] = useState(false);
  const [openCfRejectModal, setOpenCfRejectModal] = useState(false);

  const { session } = useSession();
  const local = useLocalSearchParams();
  const formId = local.id;

  const onApproveReject = async (formId: string) => {
    try {
      const bodyData = {
        status: FORM_STATUS.REJECTED,
        leaveFormId: parseInt(formId),
        reason: "ok",
      };
      const token = `Bearer ${session}`;

      const baseUrl = BASE_URL;
      const endpoint = `/leave-forms/approve`;
      const url = `${baseUrl}${endpoint}`;

      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(bodyData),
        headers: { "Content-Type": "application/json", Authorization: token },
        credentials: "include",
      });
      const responseJson = await response.json();
      if (responseJson.statusCode === 200) {
        if (form) {
          setForm({ ...form, status: FORM_STATUS.REJECTED });
        }
        MyToast.success("Thành công");
      } else {
        MyToast.error(responseJson.error);
      }
    } catch (error: any) {
      MyToast.error(error.message);
    }
  };
  const onApproveRejectCache = useCallback(() => {
    onApproveReject(formId as string);
  }, [formId, form]);

  const onApproveAccept = async (formId: string) => {
    try {
      const bodyData = {
        status: FORM_STATUS.ACCEPTED,
        leaveFormId: parseInt(formId),
        reason: "ok",
      };
      const token = `Bearer ${session}`;

      const baseUrl = BASE_URL;
      const endpoint = `/leave-forms/approve`;
      const url = `${baseUrl}${endpoint}`;

      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(bodyData),
        headers: { "Content-Type": "application/json", Authorization: token },
        credentials: "include",
      });
      const responseJson = await response.json();
      if (responseJson.statusCode === 200) {
        if (form) {
          setForm({ ...form, status: FORM_STATUS.ACCEPTED });
        }
        MyToast.success("Thành công");
      } else {
        MyToast.error(responseJson.error);
      }
    } catch (error: any) {
      MyToast.error(error.message);
    }
  };

  const onApproveAcceptCache = useCallback(() => {
    onApproveAccept(formId as string);
  }, [formId, form]);

  const fetchLeaveFormDetail = async (formId: string) => {
    const token = `Bearer ${session}`;

    const baseUrl = BASE_URL;
    const endpoint = `/leave-forms/${formId}`;
    const url = `${baseUrl}${endpoint}`;

    const response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json", Authorization: token },
      credentials: "include",
    });
    const responseJson = await response.json();

    if (responseJson.statusCode === 200) {
      setForm(responseJson.data.leaveFormDetail);
    } else {
      MyToast.error(responseJson.error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchLeaveFormDetail(formId as string);
    }, [formId])
  );

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
            <Item title="Nhân viên" content={form.userName} />
            <Item title="Chức vụ" content={form.userRole.name} />
            <Item title="Phòng" content={form.userTeam.name} />
            <Item title="Liên hệ (phòng)" content={form.userTeam.hotline} />
            <Item
              title="Ngày xin nghỉ"
              content={`${moment(form.startDate).format("DD/MM/YYYY <HH:mm>")} --> ${moment(form.endDate).format("DD/MM/YYYY <HH:mm>")}`}
            />
            <Item title="Loại nghỉ" content={form.leaveFormType} />
            <Item title="Ghi chú" content={form.note} />
            {/* Attach Image */}
            <AttachImageFile path={form.attachFilePath} />
          </ScrollView>

          {form.status === FORM_STATUS.WATING_APPROVE && (
            <View style={styles.approveContainer}>
              <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={() => setOpenCfRejectModal(true)} activeOpacity={0.8} style={styles.buttonItem}>
                  <View style={styles.buttonOutlined}>
                    <NunitoText type="body3" style={{ color: "#0B3A82" }}>
                      Từ chối
                    </NunitoText>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setOpenCfAcceptModal(true)} activeOpacity={0.8} style={styles.buttonItem}>
                  <View style={styles.buttonContained}>
                    <NunitoText type="body3" style={{ color: "white" }}>
                      Chấp thuận
                    </NunitoText>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      )}

      {openCfRejectModal && (
        <MyModal
          title={"Xác nhận phê duyệt Từ Chối"}
          onClose={() => setOpenCfRejectModal(false)}
          cb={onApproveRejectCache}
          modalProps={{ animationType: "slide", transparent: true }}
        >
          <View>
            <NunitoText type="body3">Từ chối đơn xin nghỉ?</NunitoText>
          </View>
        </MyModal>
      )}

      {openCfAcceptModal && (
        <MyModal
          title={"Xác nhận phê duyệt Chấp Thuận"}
          onClose={() => setOpenCfAcceptModal(false)}
          cb={onApproveAcceptCache}
          modalProps={{ animationType: "slide", transparent: true }}
        >
          <View>
            <NunitoText type="body3">Chấp Thuận đơn xin nghỉ?</NunitoText>
          </View>
        </MyModal>
      )}
    </>
  );
}

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
    padding: 16,
    paddingBottom: 0,
    backgroundColor: "white",
    minHeight: "100%",
  },
  listBox: {
    paddingBottom: 100, // Space at the bottom to prevent overlap with the button
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
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: "white", // Optional: To give the button a distinct background
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 6,
  },
  buttonItem: {
    flexGrow: 1,
  },
  buttonContained: {
    justifyContent: "center",
    alignItems: "center",
    height: 44,
    backgroundColor: "#0B3A82",
    borderRadius: 4,
  },
  buttonOutlined: {
    justifyContent: "center",
    alignItems: "center",
    height: 44,
    borderColor: "#0B3A82",
    borderWidth: 1,
    borderRadius: 4,
  },
});
