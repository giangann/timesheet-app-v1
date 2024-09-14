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
type TLeaveFormDetail = {
  id: number;
  userIdentifyCard: string;
  userName: string;
  startDate: string;
  endDate: string;
  note: string;
  leaveFormType: string;
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
};

export default function MyTimeSheet() {
  const [leaveForm, setLeaveForm] = useState<TLeaveFormDetail | null>(null);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const { session } = useSession();
  const onFetchLeaveFrom = (formId: number | null) => {
    if (!formId) {
      setLeaveForm(null);
      return;
    }
    fetchLeaveFormDetail(formId.toString());
  };

  const fetchLeaveFormDetail = async (formId: string) => {
    setIsFetching(true);

    try {
      const token = `Bearer ${session}` ?? "xxx";

      const baseUrl = "http://13.228.145.165:8080/api/v1";
      const endpoint = `/leave-forms/${formId}`;
      const url = `${baseUrl}${endpoint}`;

      const response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json", Authorization: token },
        credentials: "include",
      });
      const responseJson = await response.json();

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
  return (
    <View style={styles.container}>
      {/* <NunitoText>My Time Sheet</NunitoText> */}
      <BasicCalendar onFetchLeaveFrom={onFetchLeaveFrom} />
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
