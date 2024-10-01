import { fetchMyNotis, readNoti } from "@/api/noti";
import { TNoti } from "@/api/noti/type";
import { NunitoText } from "@/components/text/NunitoText";
import {
  DEFAULT_PAGI_PARAMS,
  FORM_NOTI_ACTION_TYPE,
  FORM_NOTI_NAME,
  FORM_NOTI_TYPE,
  FORM_STATUS_NAME,
  NOTI_STATUS
} from "@/constants/Misc";
import { useSession } from "@/contexts/ctx";
import { formatRelativeTime } from "@/helper/date";
import { TPageable, TPagiParams } from "@/types";
import { AvatarByRole } from "@/ui/AvatarByRole";
import { MyToast } from "@/ui/MyToast";
import { NoData } from "@/ui/NoData";
import { SkeletonRectangleLoader } from "@/ui/skeletons";
import { useFocusEffect, useRouter } from "expo-router";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";

export default function Noti() {
  const [isLoading, setIsLoading] = useState(false);
  const [notis, setNotis] = useState<TNoti[]>([]);
  const [pageable, setPageable] = useState<TPageable | null>(null);
  const { session } = useSession();
  const isFirstRender = useRef(true);
  const pagiParamsRef = useRef<TPagiParams>(DEFAULT_PAGI_PARAMS);

  const handleEndListReached = () => {
    if (!isLoading && (pageable?.currentPage ?? -2) < (pageable?.totalPages ?? 0) - 1) {
      // calculate new pagi (next page)
      const { page: currentPage, size } = pagiParamsRef.current;
      const newPagiParams: TPagiParams = { page: currentPage + 1, size };

      // fetch data with next page
      fetchAndUpdateNotis(newPagiParams);

      // update current pagi to new pagi (next page)
      pagiParamsRef.current = newPagiParams;
    }
  };

  const fetchAndUpdateNotis = async (pagiParams: TPagiParams) => {
    setIsLoading(true);
    try {
      const responseJson = await fetchMyNotis(session, pagiParams);
      if (responseJson.statusCode === 200) {
        const moreNotis = responseJson.data.notifications;
        setNotis((prev) => [...prev, ...moreNotis]);
        setPageable(responseJson.data.pageable);
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
    const pagiParams = pagiParamsRef.current;
    fetchAndUpdateNotis(pagiParams);

    setTimeout(() => {
      isFirstRender.current = false;
    }, 1000);
  }, []);

  const fetchAndOverrideNotis = async (pagiParams: TPagiParams) => {
    try {
      const responseJson = await fetchMyNotis(session, pagiParams);
      if (responseJson.statusCode === 200) {
        const overrideNotis = responseJson.data.notifications;
        setNotis(overrideNotis);
      } else {
        MyToast.error(responseJson.error);
      }
    } catch (error: any) {
      MyToast.error(error.message);
    }
  };
  useFocusEffect(
    useCallback(() => {
      // Fetch notifications only when navigating back to this screen, not on first render
      if (isFirstRender.current === false) {
        // Calculate pagi params
        const { page: currentPage, size } = pagiParamsRef.current;
        const overridePagiParams: TPagiParams = { page: 0, size: (currentPage + 1) * size };

        // Fetch and override list with pagi params
        fetchAndOverrideNotis(overridePagiParams);
      }
      // We still want to update the callback when pagiParams changes, but not trigger it
    }, [session]) // Only depend on `session` here, or any other non-changing dependencies
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={notis}
        renderItem={({ item }) => <NotiItem noti={item} />}
        keyExtractor={(_item) => _item.id.toString()}
        onEndReached={handleEndListReached}
        onEndReachedThreshold={0.15}
        ListFooterComponent={(pageable?.currentPage ?? -2) < (pageable?.totalPages ?? 0) - 1 ? <SkeletonRectangleLoader height={300} /> : null}
        ListEmptyComponent={isLoading ? null : <NoData message="Không có thông báo" />}
      />
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
      const responseJson = await readNoti(session, noti.id);
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
        <AvatarByRole role={noti.senderRoleCode} />

        <View style={styles.itemContent}>
          {/* Titile */}
          {noti.actionType === FORM_NOTI_ACTION_TYPE.NEW_FORM && <NunitoText type="body2">Yêu cầu phê duyệt mới</NunitoText>}
          {noti.actionType === FORM_NOTI_ACTION_TYPE.APPROVE_FORM && <NunitoText type="body2">Đơn được phê duyệt mới</NunitoText>}
          <NunitoText type="body4">{noti.id}</NunitoText>
          {/* Content */}
          {noti.actionType === FORM_NOTI_ACTION_TYPE.NEW_FORM && (
            <NunitoText type="body4">
              <NunitoText type="body4">{noti.senderRoleName}</NunitoText>
              <NunitoText type="body4"> {noti.senderName} </NunitoText>
              yêu cầu phê duyệt
              <NunitoText type="body4" style={{ fontWeight: 700 }}>
                {" "}
                {FORM_NOTI_NAME[noti.type]}
              </NunitoText>
            </NunitoText>
          )}
          {noti.actionType === FORM_NOTI_ACTION_TYPE.APPROVE_FORM && (
            <NunitoText type="body4">
              <NunitoText type="body4">{noti.senderRoleName}</NunitoText>
              <NunitoText type="body4"> {noti.senderName} </NunitoText>
              phê duyệt
              <NunitoText type="body4" style={{ fontWeight: 700 }}>
                {" "}
                {FORM_STATUS_NAME[noti.obj.status]}
              </NunitoText>{" "}
              cho
              <NunitoText type="body4" style={{ fontWeight: 700 }}>
                {" "}
                {FORM_NOTI_NAME[noti.type]}
              </NunitoText>{" "}
              của bạn.
            </NunitoText>
          )}

          {/* Created At */}
          <NunitoText type="body4" style={{ opacity: 0.5 }}>
            {formatRelativeTime(noti.createdAt)}
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
