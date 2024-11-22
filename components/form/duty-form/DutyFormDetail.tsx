import { TDutyFormDetail } from "@/api/form/types";
import { ViewImageFullScreen } from "@/components/ViewImageFullScreen";
import { NunitoText } from "@/components/text/NunitoText";
import { OPACITY_TO_HEX } from "@/constants/Colors";
import { BoxStatus } from "@/ui/BoxStatus";
import moment from "moment";
import { memo } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { DutyFormDetailDutyTypes } from "./DutyFormDetailDutyTypes";

type DutyFormDetailProps = {
  form: TDutyFormDetail | null;
};
export const DutyFormDetail: React.FC<DutyFormDetailProps> = memo(({ form }) => {
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
