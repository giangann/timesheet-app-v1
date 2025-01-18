import { TOvertimeFormDetail } from "@/api/form/types";
import { ViewImageFullScreen } from "@/components/ViewImageFullScreen";
import { NunitoText } from "@/components/text/NunitoText";
import { OPACITY_TO_HEX } from "@/constants/Colors";
import { BoxStatus } from "@/ui/BoxStatus";
import moment from "moment";
import { memo } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

type OvertimeFormDetailProps = {
  form: TOvertimeFormDetail;
};

export const OvertimeFormDetail: React.FC<OvertimeFormDetailProps> = memo(
  ({ form }) => {
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
              <Item
                title="Thời gian"
                content={`${moment(form.date).format("DD/MM/YYYY")} (${
                  form.startTime
                } --> ${form.endTime})`}
              />
              <Item
                title="Loại ngoài giờ"
                content={`${
                  form.salaryCoefficientType.name
                } (x${form.salaryCoefficientType.coefficient.toFixed(2)})`}
              />
              <Item title="Nội dung công việc" content={form.note} />
              <Item
                title="Người phê duyệt"
                content={`${form.userApproveName} (${form.userApproveRole.name})`}
              />

              {/* Attach Image */}
              <AttachImageFile path={form.attachFilePath} />
            </ScrollView>
          </View>
        )}
      </>
    );
  }
);

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
});
