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
import moment from "moment";
import { useState } from "react";
import { View, StyleSheet } from "react-native";

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
        setOTForm(responseJson.data.leaveFormDetail);
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
        setDutyForm(responseJson.data.leaveFormDetail);
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
      {isFetching && <SkeletonLoader />}
      {leaveForm && !isFetching && (
        <View style={styles.selectedDateDetail}>
          <BoxStatus status={leaveForm.status} approveDate={leaveForm.approveDate} />
          <Item
            title="Ngày xin nghỉ"
            content={`${moment(leaveForm.startDate).format("DD/MM/YYYY <HH:mm>")} --> ${moment(leaveForm.endDate).format("DD/MM/YYYY <HH:mm>")}`}
          />
          <Item title="Loại nghỉ" content={leaveForm.leaveFormType} />
          <Item title="Người phê duyệt" content={`${leaveForm.userApproveName} (${leaveForm.userApproveRole.name})`} />
        </View>
      )}
    </View>
  );
}

const LeaveFormInfo = (leaveForm: TLeaveFormDetail) => {
  return (
    <View>
      <NunitoText type="subtitle1">Đơn xin nghỉ</NunitoText>
    </View>
  );
};

const OTFormInfo = (otForm: any) => {
  return (
    <View>
      <NunitoText type="subtitle1">Đơn tăng ca</NunitoText>
    </View>
  );
};

const DutyFormInfo = (dutyForm: any) => {
  return (
    <View>
      <NunitoText type="subtitle1">Đơn trực</NunitoText>
    </View>
  );
};

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
  item: {
    gap: 4,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: `#000000${OPACITY_TO_HEX["15"]}`,
  },
});
