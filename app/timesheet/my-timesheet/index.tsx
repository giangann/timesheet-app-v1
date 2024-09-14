import { fetchDutyFormDetail, fetchLeaveFormDetail, fetchOvertimeFormDetail } from "@/api/form";
import { TDutyFormDetail, TLeaveFormDetail, TOvertimeFormDetail } from "@/api/form/types";
import { BasicCalendar } from "@/components/my-rn-calendar/BasicCalendar";
// import { BasicWeekCalendar } from "@/components/my-rn-calendar/BasicWeekCalendar";
import { NunitoText } from "@/components/text/NunitoText";
import { OPACITY_TO_HEX } from "@/constants/Colors";
import { useSession } from "@/contexts/ctx";
import { BoxStatus } from "@/ui/BoxStatus";
import { MyToast } from "@/ui/MyToast";
import SkeletonLoader from "@/ui/SkeletonLoader";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import moment from "moment";
import { useState } from "react";
import { View, StyleSheet, Pressable } from "react-native";

export default function MyTimeSheet() {
  const [leaveForm, setLeaveForm] = useState<TLeaveFormDetail | null>(null);
  const [otForm, setOTForm] = useState<TOvertimeFormDetail | null>(null);
  const [dutyForm, setDutyForm] = useState<TDutyFormDetail | null>(null);

  const [isFetching, setIsFetching] = useState<boolean>(false);
  const { session } = useSession();

  const onFetchForms = (lfId: number | null, otfId: number | null, dtfId: number | null) => {
    onFetchLeaveFrom(lfId);
    onFetchOvertimeFrom(otfId);
    onFetchDutyFrom(dtfId);
  };

  const onFetchLeaveFrom = (formId: number | null) => {
    if (!formId) {
      setLeaveForm(null);
      return;
    }
    fetchLFdetail(formId);
  };
  const onFetchOvertimeFrom = (formId: number | null) => {
    if (!formId) {
      setOTForm(null);
      return;
    }
    fetchOtFDetail(formId);
  };
  const onFetchDutyFrom = (formId: number | null) => {
    if (!formId) {
      setDutyForm(null);
      return;
    }
    fetchDtFDetail(formId);
  };

  const fetchLFdetail = async (formId: number) => {
    setIsFetching(true);

    try {
      const responseJson = await fetchLeaveFormDetail(session ?? "", formId);

      if (responseJson.statusCode === 200) {
        setLeaveForm(responseJson.data.leaveFormDetail);
      } else {
        MyToast.error(responseJson.error);
      }
    } catch (error: any) {
      MyToast.error(error.message);
    } finally {
      setIsFetching(false);
    }
  };

  const fetchOtFDetail = async (formId: number) => {
    setIsFetching(true);

    try {
      const responseJson = await fetchOvertimeFormDetail(session ?? "", formId);

      if (responseJson.statusCode === 200) {
        setOTForm(responseJson.data.overtimeFormDetail);
      } else {
        MyToast.error(responseJson.error);
      }
    } catch (error: any) {
      MyToast.error(error.message);
    } finally {
      setIsFetching(false);
    }
  };

  const fetchDtFDetail = async (formId: number) => {
    setIsFetching(true);

    try {
      const responseJson = await fetchDutyFormDetail(session ?? "", formId);

      if (responseJson.statusCode === 200) {
        setDutyForm(responseJson.data.dutyForm);
      } else {
        MyToast.error(responseJson.error);
      }
    } catch (error: any) {
      MyToast.error(error.message);
    } finally {
      setIsFetching(false);
    }
  };
  return (
    <View style={styles.container}>
      {/* <NunitoText>My Time Sheet</NunitoText> */}
      <BasicCalendar onFetchForms={onFetchForms} />
      {/* <BasicWeekCalendar /> */}
      <View style={styles.formsWrapper}>
        {isFetching && <SkeletonLoader />}
        {leaveForm && !isFetching && <LeaveFormInfo leaveForm={leaveForm} />}
        {otForm && !isFetching && <OTFormInfo otForm={otForm} />}
        {dutyForm && !isFetching && <DutyFormInfo dutyForm={dutyForm} />}
      </View>
    </View>
  );
}

const LeaveFormInfo = ({ leaveForm }: { leaveForm: TLeaveFormDetail }) => {
  const router = useRouter();
  const onGotoLeaveFormDetail = () => router.navigate({ pathname: "/forms/leave_forms/[id]", params: { id: leaveForm.id } });
  return (
    <View style={styles.formContainer}>
      <View style={styles.formTitleRow}>
        <NunitoText type="subtitle1">Đơn xin nghỉ</NunitoText>
        <Pressable onPress={onGotoLeaveFormDetail}>
          <View style={styles.gotoDetailButton}>
            <NunitoText type="body4" style={{ opacity: 1 }}>
              Chi tiết
            </NunitoText>
            <Ionicons name="arrow-forward" size={16} style={{ opacity: 0.75 }} />
          </View>
        </Pressable>
      </View>

      <View style={styles.formContentContainer}>
        <View style={styles.formContentItemLeft}>
          <NunitoText type="body3">{leaveForm.leaveFormType}</NunitoText>
        </View>

        <View style={styles.formContentItemRight}>
          <NunitoText type="body4">{`${moment(leaveForm.startDate).format("DD/MM/YYYY HH:mm")}`}</NunitoText>
          <NunitoText type="body4">{`${moment(leaveForm.endDate).format("DD/MM/YYYY HH:mm")}`}</NunitoText>
        </View>
      </View>
    </View>
  );
};

const OTFormInfo = ({ otForm }: { otForm: TOvertimeFormDetail }) => {
  const router = useRouter();
  const onGotoOvertimeFormDetail = () => {
    router.navigate({
      pathname: "/forms/overtime_forms/[id]",
      params: {
        id: otForm.id,
      },
    });
  };
  return (
    <View style={styles.formContainer}>
      <View style={styles.formTitleRow}>
        <NunitoText type="subtitle1">Đơn tăng ca</NunitoText>
        <Pressable onPress={onGotoOvertimeFormDetail}>
          <View style={styles.gotoDetailButton}>
            <NunitoText type="body4" style={{ opacity: 1 }}>
              Chi tiết
            </NunitoText>
            <Ionicons name="arrow-forward" size={16} style={{ opacity: 0.75 }} />
          </View>
        </Pressable>
      </View>

      <View style={styles.formContentContainer}>
        <View style={styles.formContentItemLeft}>
          <NunitoText type="body3">{`${otForm.salaryCoefficientType.name} (x${otForm.salaryCoefficientType.coefficient.toFixed(2)})`}</NunitoText>
        </View>

        <View style={styles.formContentItemRight}>
          <NunitoText type="body4">{`${moment(otForm.date).format("DD/MM/YYYY")}`}</NunitoText>
          <NunitoText type="body4">{`${otForm.startTime} - ${otForm.endTime}`}</NunitoText>
        </View>
      </View>
    </View>
  );
};

const DutyFormInfo = ({ dutyForm }: { dutyForm: TDutyFormDetail }) => {
  const router = useRouter();
  const onGotoDutyFormDetail = () => router.navigate({ pathname: "/forms/duty_forms/[id]", params: { id: dutyForm.id ?? 1 } });

  return (
    <View style={styles.formContainer}>
      <View style={styles.formTitleRow}>
        <NunitoText type="subtitle1">Đơn trực</NunitoText>
        <Pressable onPress={onGotoDutyFormDetail}>
          <View style={styles.gotoDetailButton}>
            <NunitoText type="body4" style={{ opacity: 1 }}>
              Chi tiết
            </NunitoText>
            <Ionicons name="arrow-forward" size={16} style={{ opacity: 0.75 }} />
          </View>
        </Pressable>
      </View>

      <View style={styles.formContentContainer}>
        <View style={styles.formContentItemLeft}>
          <NunitoText type="body3">{dutyForm.dutyCalendar.dutyType.name}</NunitoText>
          <NunitoText type="body3">{`${
            dutyForm.dutyCalendar.salaryCoefficientType.name
          } (x${dutyForm.dutyCalendar.salaryCoefficientType.coefficient.toFixed(2)}`}</NunitoText>
        </View>

        <View style={styles.formContentItemRight}>
          <NunitoText type="body4">{`${moment(dutyForm.dutyCalendar.date).format("DD/MM/YYYY")}`}</NunitoText>
          <NunitoText type="body4">{`${dutyForm.dutyCalendar.startTime} - ${dutyForm.dutyCalendar.endTime}`}</NunitoText>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 0,
    paddingBottom: 0,
    height: "100%",

    gap: 24,
  },
  selectedDateDetail: {
    paddingHorizontal: 16,
  },
  formsWrapper: {
    paddingHorizontal: 16,
    gap: 12,
  },
  formContainer: {
    borderWidth: 1,
    borderColor: `#000000${OPACITY_TO_HEX["25"]}`,
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 12,
  },
  formTitleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  gotoDetailButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  formContentContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  formContentItemLeft: {
    flexGrow: 1,
    flexBasis: 1,
  },
  formContentItemRight: {
    alignItems: "flex-end",
    flexGrow: 1,
    flexBasis: 1,
  },
});
