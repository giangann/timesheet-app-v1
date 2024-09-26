import { fetchApproveDutyForms } from "@/api/form";
import { TApproveDutyForm } from "@/api/form/types";
import { NunitoText } from "@/components/text/NunitoText";
import { OPACITY_TO_HEX } from "@/constants/Colors";
import { DEFAULT_PAGI_PARAMS } from "@/constants/Misc";
import { useSession } from "@/contexts/ctx";
import { TPageable, TPagiParams } from "@/types";
import { AvatarByRole } from "@/ui/AvatarByRole";
import { ChipStatus } from "@/ui/ChipStatus";
import { MyToast } from "@/ui/MyToast";
import SkeletonLoader from "@/ui/SkeletonLoader";
import { useFocusEffect, useRouter } from "expo-router";
import moment from "moment";
import { useCallback, useEffect, useRef, useState } from "react";
import { FlatList, Image, Pressable, StyleSheet, View } from "react-native";
const ExpandIcon = require("@/assets/images/arrow-down-expand.png");
const CollapseIcon = require("@/assets/images/arrow-up-collapse.png");

export default function ApproveDutyForms() {
  const [dutyForms, setDutyForms] = useState<TApproveDutyForm[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pageable, setPageable] = useState<TPageable | null>(null);
  const isFirstRender = useRef(true);
  const pagiParamsRef = useRef<TPagiParams>(DEFAULT_PAGI_PARAMS);

  const { session } = useSession();

  const handleEndListReached = () => {
    if (!isLoading && (pageable?.currentPage ?? -2) < (pageable?.totalPages ?? 0) - 1) {
      // calculate new pagi (next page)
      const { page: currentPage, size } = pagiParamsRef.current;
      const newPagiParams: TPagiParams = { page: currentPage + 1, size };

      // fetch data with next page
      fetchAndUpdateListForms(newPagiParams);

      // update current pagi to new pagi (next page)
      pagiParamsRef.current = newPagiParams;
    }
  };

  const fetchAndUpdateListForms = async (pagiParams: TPagiParams) => {
    setIsLoading(true);
    try {
      const responseJson = await fetchApproveDutyForms(session, pagiParams);
      if (responseJson.statusCode === 200) {
        const moreDutyForms = responseJson.data.dutyForm;
        setDutyForms((prev) => [...prev, ...moreDutyForms]);
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
    fetchAndUpdateListForms(pagiParams);

    setTimeout(() => {
      isFirstRender.current = false;
    }, 1000);
  }, []);

  const fetchAndOverrideListForms = async (pagiParams: TPagiParams) => {
    try {
      const responseJson = await fetchApproveDutyForms(session, pagiParams);
      if (responseJson.statusCode === 200) {
        const overrideDutyForms = responseJson.data.dutyForm;
        setDutyForms(overrideDutyForms);
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
        fetchAndOverrideListForms(overridePagiParams);
      }
      // We still want to update the callback when pagiParams changes, but not trigger it
    }, [session]) // Only depend on `session` here, or any other non-changing dependencies
  );
  return (
    <View style={styles.container}>
      <FlatList
        data={dutyForms}
        renderItem={({ item }) => <Item dutyForm={item} />}
        keyExtractor={(item) => item.id.toString()}
        onEndReached={handleEndListReached}
        onEndReachedThreshold={0.15}
        ListFooterComponent={(pageable?.currentPage ?? -2) < (pageable?.totalPages ?? 0) - 1 ? <SkeletonLoader /> : null}
        style={styles.flatList}
      />
    </View>
  );
}

type ItemProps = {
  dutyForm: TApproveDutyForm;
};
const Item: React.FC<ItemProps> = ({ dutyForm }) => {
  const [isExpand, setIsExpand] = useState(false);
  const router = useRouter();

  const onGoToFormDetail = () => {
    router.navigate({
      pathname: "/approve-forms/duty_forms/[id]",
      params: { id: dutyForm.id },
    });
  };

  const onToggleExpand = () => setIsExpand(!isExpand);

  return (
    <View style={styles.itemBox}>
      {/* sumary */}
      <Pressable onPress={onGoToFormDetail}>
        <View style={styles.itemBoxSumary}>
          <View style={styles.userInfo}>
            {dutyForm.users.length > 0 && (
              <>
                <AvatarByRole role={dutyForm.users[0].roleCode} />
                <View style={{ gap: 4 }}>
                  <NunitoText type="body3">{dutyForm.users[0].name}</NunitoText>
                  <NunitoText type="body4" style={{ opacity: 0.75 }}>
                    {dutyForm.users[0].roleName}
                  </NunitoText>
                </View>
              </>
            )}
          </View>
          <View style={styles.formInfo}>
            <ChipStatus status={dutyForm.status} />
            <View>
              <View>
                <NunitoText type="body4" style={{ opacity: 0.675 }}>
                  {moment(dutyForm.date).format("DD/MM/YYYY")}
                </NunitoText>
                <NunitoText type="body4" style={{ opacity: 0.675 }}>
                  {`${dutyForm.startTime} - ${dutyForm.endTime}`}
                </NunitoText>
              </View>
            </View>
          </View>
        </View>
      </Pressable>

      {/* Extra info, only display when expand is true */}
      {isExpand && (
        <View style={styles.extraInfo}>
          <NunitoText type="body4">
            <NunitoText type="body2">Loại trực: </NunitoText>
            {dutyForm.dutyTypeName}
          </NunitoText>
          <NunitoText type="body4">
            <NunitoText type="body2">Loại ngoài giờ: </NunitoText>
            {`${dutyForm.salaryCoefficientTypeName} (x${dutyForm.salaryCoefficient.toFixed(2)})`}
          </NunitoText>
          <NunitoText type="body4">
            <NunitoText type="body2">Ghi chú: </NunitoText>
            {dutyForm.note}
          </NunitoText>

          {dutyForm.users.length > 1 && (
            <NunitoText type="body4">
              <NunitoText type="body2">Danh sách thành viên trong đơn: </NunitoText>
              {dutyForm.users.map((user, index) => (
                <NunitoText key={user.identifyCard} type="body4">
                  {`(${index + 1}) ${user.name} (${user.roleName})`}
                </NunitoText>
              ))}
            </NunitoText>
          )}

          {dutyForm.approveDate && (
            <NunitoText type="body4">
              <NunitoText type="body2">Phê duyệt lúc: </NunitoText>
              {moment(dutyForm.approveDate).format("DD/MM/YYYY HH:mm")}
            </NunitoText>
          )}
        </View>
      )}

      {/* expand button */}
      <Pressable onPress={onToggleExpand}>
        <View style={styles.itemExpandBtn}>
          <Image source={isExpand ? CollapseIcon : ExpandIcon} />
        </View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 0,
    backgroundColor: "white",
    minHeight: "100%",
    height: "100%",
    /**
     * if not set height 100%, container will overflow screen,
     * so scrollView will fill container => scrollView also overflow screen
     * => can't see all element inside scrollView
     */
  },
  toolbar: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 4,
    marginBottom: 20,
  },
  flatList: {
    paddingTop: 16,
  },
  itemBox: {
    borderRadius: 8,
    borderColor: "#B0CEFF",
    borderWidth: 1,
    //
    marginBottom: 20,
  },
  itemBoxSumary: {
    backgroundColor: "#EFF5FF",
    paddingVertical: 16,
    paddingHorizontal: 12,

    flexDirection: "row",
    justifyContent: "space-between",

    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  userInfo: {
    justifyContent: "space-between",
    gap: 16,
  },
  userAvatar: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: `${OPACITY_TO_HEX["15"]}`,
  },
  formInfo: {
    justifyContent: "space-between",
  },
  extraInfo: {
    padding: 16,
    gap: 10,
  },
  itemExpandBtn: {
    backgroundColor: "#B0CEFF",
    alignItems: "center",
    paddingVertical: 2,

    borderBottomLeftRadius: 8,
    borderBottomStartRadius: 6,
    borderBottomEndRadius: 6,
    borderBottomRightRadius: 8,
  },
});
