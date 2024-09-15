import { ViewImageFullScreen } from "@/components/ViewImageFullScreen";
import { NunitoText } from "@/components/text/NunitoText";
import { OPACITY_TO_HEX } from "@/constants/Colors";
import { useSession } from "@/contexts/ctx";
import { BoxStatus } from "@/ui/BoxStatus";
import { MyToast } from "@/ui/MyToast";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import moment from "moment";
import { useCallback, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

type TOvertimeFormDetail = {
  id: number;
  userIdentifyCard: string;
  userName: string;
  note: string;
  attachFilePath: string;
  status: number;
  userRole: {
    id: number;
    code: string;
    name: string;
  };
  userTeam: {
    id: number;
    name: string;
    code: string | null;
    hotline: string;
  };
  reason: string | null;
  userApproveRole: {
    id: number;
    code: string;
    name: string;
  };
  userApproveIdentifyCard: string;
  userApproveName: string;
  approveDate: string | null;

  date: string;
  startTime: string;
  endTime: string;
  typeOfWorking: string | null;
  salaryCoefficientType: {
    id: number;
    name: string;
    coefficient: number;
  };
};

export default function DetailForm() {
  const [form, setForm] = useState<TOvertimeFormDetail | null>(null);

  const { session } = useSession();
  const local = useLocalSearchParams();
  const formId = local.id;

  const fetchOvertimeFormDetail = async (formId: string) => {
    const token = `Bearer ${session}` ?? "xxx";

    const baseUrl = "https://proven-incredibly-redbird.ngrok-free.app/api/v1";
    const endpoint = `/overtime-forms/${formId}`;
    const url = `${baseUrl}${endpoint}`;

    const response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json", Authorization: token },
      credentials: "include",
    });
    const responseJson = await response.json();

    if (responseJson.statusCode === 200) {
      setForm(responseJson.data.overtimeFormDetail);
    } else {
      MyToast.error(responseJson.error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchOvertimeFormDetail(formId as string);
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
            <Item title="Thời gian" content={`${moment(form.date).format("DD/MM/YYYY")} (${form.startTime} --> ${form.endTime})`} />
            <Item title="Loại ngoài giờ" content={`${form.salaryCoefficientType.name} (x${form.salaryCoefficientType.coefficient.toFixed(2)})`} />
            <Item title="Ghi chú" content={form.note} />
            <Item title="Người phê duyệt" content={`${form.userApproveName} (${form.userApproveRole.name})`} />

            {/* Attach Image */}
            <AttachImageFile path={form.attachFilePath} />
          </ScrollView>
        </View>
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

const AttachImageFile = ({ path }: { path: string }) => {
  return (
    <View>
      <NunitoText type="body3" style={{ opacity: 0.5, marginBottom: 4 }}>
        {"Ảnh đính kèm"}
      </NunitoText>
      <ViewImageFullScreen imagePath={path} />
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
    paddingBottom: 16,
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
