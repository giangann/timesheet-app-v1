import { fetchAllMyNotis } from "@/api/noti";
import { TNoti } from "@/api/noti/type";
import { NunitoText } from "@/components/text/NunitoText";
import { FORM_NOTI_NAME, FORM_NOTI_TYPE, FORM_STATUS_NAME, ROLE_CODE } from "@/constants/Misc";
import { useSession } from "@/contexts/ctx";
import { formatRelativeTime } from "@/helper/date";
import { AvatarByRole } from "@/ui/AvatarByRole";
import { MyToast } from "@/ui/MyToast";
import SkeletonLoader from "@/ui/SkeletonLoader";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

export default function Noti() {
  const [isLoading, setIsLoading] = useState(false);
  const [notis, setNotis] = useState<TNoti[]>([]);
  const { session } = useSession();

  const fetchAllNotis = async () => {
    setIsLoading(true);
    try {
      const responseJson = await fetchAllMyNotis(session);
      if (responseJson.statusCode === 200) {
        setNotis(responseJson.data.notifications);
      } else {
        MyToast.error(responseJson.error);
      }
    } catch (error: any) {
      MyToast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllNotis();
  }, []);

  return (
    <View style={styles.container}>
      {isLoading && <SkeletonLoader />}
      {!isLoading && <NotiList notis={notis} />}
    </View>
  );
}

type NotiListProps = {
  notis: TNoti[];
};
const NotiList: React.FC<NotiListProps> = ({ notis }) => {
  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      {notis.map((noti, index) => (
        <NotiItem key={index} noti={noti} />
      ))}
    </ScrollView>
  );
};

type NotiItemProps = {
  noti: TNoti;
};
const NotiItem: React.FC<NotiItemProps> = ({ noti }) => {
  const router = useRouter();
  const onNotiPress = () => {
    if (noti.type === FORM_NOTI_TYPE.LEAVE_FORM) router.navigate({ pathname: "/approve-forms/leave_forms/[id]", params: { id: noti.obj.id } });
    if (noti.type === FORM_NOTI_TYPE.OVERTIME_FORM) router.navigate({ pathname: "/approve-forms/overtime_forms/[id]", params: { id: noti.obj.id } });
    if (noti.type === FORM_NOTI_TYPE.DUTY_FORM) router.navigate({ pathname: "/approve-forms/duty_forms/[id]", params: { id: noti.obj.id } });
  };
  return (
    <TouchableOpacity onPress={onNotiPress}>
      <View style={styles.itemWrapper}>
        <AvatarByRole role={ROLE_CODE.ARCHIVIST} />

        <View style={styles.itemContent}>
          <NunitoText type="body2">Yêu cầu phê duyệt mới</NunitoText>
          <NunitoText type="subtitle1">{noti.obj.id}</NunitoText>
          <NunitoText type="body4">
            <NunitoText type="body4">{"__Role Name__"}</NunitoText>
            <NunitoText type="body4"> {"__User Name__"} </NunitoText>
            yêu cầu phê duyệt
            <NunitoText type="body4" style={{ fontWeight: 700 }}>
              {" "}
              {FORM_NOTI_NAME[noti.type]}
            </NunitoText>
          </NunitoText>
          <NunitoText type="body4" style={{ opacity: 0.5 }}>
            {formatRelativeTime(noti.obj.createdAt)}
          </NunitoText>
        </View>

        <BadgeUnreadNoti />
      </View>
    </TouchableOpacity>
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
