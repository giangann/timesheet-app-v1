import { fetchMyNotis, readNoti } from "@/api/noti";
import { TNoti } from "@/api/noti/type";
import { NunitoText } from "@/components/text/NunitoText";
import { DEFAULT_PAGI_PARAMS, FORM_NOTI_NAME, FORM_NOTI_TYPE, NOTI_STATUS, ROLE_CODE } from "@/constants/Misc";
import { useSession } from "@/contexts/ctx";
import { formatRelativeTime } from "@/helper/date";
import { TPageable, TPagiParams } from "@/types";
import { AvatarByRole } from "@/ui/AvatarByRole";
import { MyToast } from "@/ui/MyToast";
import SkeletonLoader from "@/ui/SkeletonLoader";
import { useRouter } from "expo-router";
import { memo, useCallback, useEffect, useState } from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";

export default function Noti() {
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchMore, setIsFetchMore] = useState(false);
  const [notis, setNotis] = useState<TNoti[]>([]);
  const [pageable, setPageable] = useState<TPageable | null>(null);
  const { session } = useSession();

  const [pagiParams, setPagiParams] = useState<TPagiParams>(DEFAULT_PAGI_PARAMS);

  const handleEndListReached = () => {
    console.log("end list reached!");

    const newPagiParams = { ...pagiParams, page: pagiParams.page + 1 };

    fetchMoreNotis(newPagiParams);
    setPagiParams(newPagiParams);
  };

  const fetchNotis = useCallback(async () => {
    setIsLoading(true);
    try {
      const responseJson = await fetchMyNotis(session);
      if (responseJson.statusCode === 200) {
        console.log(responseJson.data.pageable);

        setNotis(responseJson.data.notifications);
        setPageable(responseJson.data.pageable);
      } else {
        MyToast.error(responseJson.error);
      }
    } catch (error: any) {
      MyToast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  }, [session]);

  const fetchMoreNotis = async (pagiParams: TPagiParams) => {
    setIsFetchMore(true);
    try {
      const responseJson = await fetchMyNotis(session, pagiParams);
      if (responseJson.statusCode === 200) {
        console.log(responseJson.data.pageable);

        const moreNotis = responseJson.data.notifications;
        setNotis((prev) => [...prev, ...moreNotis]);
        setPageable(responseJson.data.pageable);
      } else {
        MyToast.error(responseJson.error);
      }
    } catch (error: any) {
      MyToast.error(error.message);
    } finally {
      setIsFetchMore(false);
    }
  };

  useEffect(() => {
    fetchNotis();
  }, []);

  return (
    <View style={styles.container}>
      {isLoading && <SkeletonLoader />}
      {!isLoading && (
        <FlatList
          data={notis}
          renderItem={({ item }) => <NotiItem noti={item} />}
          keyExtractor={(_item, index) => index.toString()}
          onEndReached={isFetchMore ? () => {} : handleEndListReached}
          onEndReachedThreshold={0.15}
          ListFooterComponent={(pageable?.currentPage ?? 0) < (pageable?.totalPages ?? 0) ? <SkeletonLoader /> : null}
        />
      )}
    </View>
  );
}

type NotiItemProps = {
  noti: TNoti;
};
const NotiItem = memo(({ noti }: NotiItemProps) => {
  const router = useRouter();
  const { session } = useSession();

  const onNotiPress = () => {
    onReadNoti();
    onGotoFormDetail();
  };

  const onReadNoti = async () => {
    try {
      const responseJson = await readNoti(session, 363);
      if (responseJson.statusCode !== 200) {
        MyToast.error(responseJson.error);
      }
    } catch (error: any) {
      MyToast.error(error.message);
    }
  };

  const onGotoFormDetail = () => {
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
          <NunitoText type="subtitle1">{noti.status}</NunitoText>

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

        {noti.status === NOTI_STATUS.UNREAD && <BadgeUnreadNoti />}
      </View>
    </TouchableOpacity>
  );
});

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

    //
    marginBottom: 12,
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
