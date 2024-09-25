import { NunitoText } from "@/components/text/NunitoText";
import { ROLE_CODE } from "@/constants/Misc";
import { AvatarByRole } from "@/ui/AvatarByRole";
import { ScrollView, StyleSheet, View } from "react-native";
export default function Noti() {
  return (
    <View style={styles.container}>
      <NotiList />
    </View>
  );
}

const NotiList = () => {
  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <NotiItem />
      <NotiItem />
      <NotiItem />
      <NotiItem />
      <NotiItem />
      <NotiItem />
      <NotiItem />
      <NotiItem />
      <NotiItem />
      <NotiItem />
      <NotiItem />
      <NotiItem />
      <NotiItem />
      <NotiItem />
      <NotiItem />
      <NotiItem />
      <NotiItem />
      <NotiItem />
      <NotiItem />
      <NotiItem />
      <NotiItem />
      <NotiItem />
      <NotiItem />
      <NotiItem />
      <NotiItem />

    </ScrollView>
  );
};

const NotiItem = () => {
  return (
    <View style={styles.itemWrapper}>
      <AvatarByRole role={ROLE_CODE.ARCHIVIST} />

      <View style={styles.itemContent}>
        <NunitoText type="body2">Yêu cầu phê duyệt mới</NunitoText>
        <NunitoText type="body4">
          <NunitoText type="body4">{"Chuyên viên"}</NunitoText>
          <NunitoText type="body4"> {"Đặng Xuân Tiến"} </NunitoText>
          yêu cầu phê duyệt
          <NunitoText type="body4" style={{ fontWeight: 700 }}>
            {" "}
            {"Đơn xin nghỉ"}
          </NunitoText>
        </NunitoText>
        <NunitoText type="body4" style={{ opacity: 0.5 }}>
          {"15 phút trước"}
        </NunitoText>
      </View>

      <BadgeUnreadNoti />
    </View>
  );
};

const BadgeUnreadNoti = () => {
  return (
    <View style={styles._absoluteLayer}>
      <View style={styles.badgeUnread} />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 32,
  },
  scrollContent: {
    gap: 12,
  },
  itemWrapper: {
    position: "relative",
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  itemContent: {
    flexShrink: 1,
    gap: 2,
  },
  _absoluteLayer: {
    position: "absolute",
    top: 4,
    right: 0,
  },
  badgeUnread: {
    backgroundColor: "#0B67CC",
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
