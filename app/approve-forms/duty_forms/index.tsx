import { NunitoText } from "@/components/text/NunitoText";
import { OPACITY_TO_HEX } from "@/constants/Colors";
import { FORM_STATUS, ROLE_CODE } from "@/constants/Misc";
import { useSession } from "@/contexts/ctx";
import { AvatarByRole } from "@/ui/AvatarByRole";
import { ChipStatus } from "@/ui/ChipStatus";
import { MyToast } from "@/ui/MyToast";
import SkeletonLoader from "@/ui/SkeletonLoader";
import { useFocusEffect, useRouter } from "expo-router";
import moment from "moment";
import { useCallback, useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, View } from "react-native";
const UserAvatar = require("@/assets/images/avatar-test.png");
const ExpandIcon = require("@/assets/images/arrow-down-expand.png");
const CollapseIcon = require("@/assets/images/arrow-up-collapse.png");

type TDutyForm = {
  id: number;
  startTime: string;
  endTime: string;
  date: string;
  status: FORM_STATUS;
  userApproveName: string;
  userApproveIdentifyCard: string;
  note: string;
  reason: string | null;
  approveDate: string | null;
  attachFilePath: string;
  isDeleted: boolean;
  dutyTypeName: string;
  salaryCoefficientTypeName: string;
  salaryCoefficient: number;
  users: [
    {
      name: string;
      identifyCard: string;
      roleId: number;
      roleName: string;
      roleCode: ROLE_CODE;
    }
  ];
  userTeam: {
    id: number;
    name: string;
    code: string | null;
    hotline: string | null;
  };
  userApproveRole: {
    id: number;
    code: ROLE_CODE;
    name: string;
  };
};

export default function ApproveDutyForms() {
  const [isLoading, setIsLoading] = useState(false);
  const [dutyForms, setDutyForms] = useState<TDutyForm[]>([]);
  const { session } = useSession();

  const fetchDutyForms = async () => {
    setIsLoading(true);

    try {
      const token = `Bearer ${session}` ?? "xxx";

      const baseUrl = "https://proven-incredibly-redbird.ngrok-free.app/api/v1";
      const endpoint = "/duty-forms/filter/user-approve";
      const queryString = `?page=0&size=20`;
      const url = `${baseUrl}${endpoint}${queryString}`;

      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify({}),
        headers: { "Content-Type": "application/json", Authorization: token },
        credentials: "include",
      });
      const responseJson = await response.json();
      if (responseJson.statusCode === 200) {
        setDutyForms(responseJson.data.dutyForm);
      } else {
        MyToast.error(responseJson.error);
      }
    } catch (error: any) {
      MyToast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchDutyForms();
    }, [])
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {isLoading && <SkeletonLoader />}
        <List dutyForms={dutyForms} />
      </ScrollView>
    </View>
  );
}

type ListProps = {
  dutyForms: TDutyForm[];
};
const List: React.FC<ListProps> = ({ dutyForms }) => {
  return (
    <View style={styles.listBox}>
      {dutyForms.map((form) => (
        <Item key={form.id} dutyForm={form} />
      ))}
    </View>
  );
};

type ItemProps = {
  dutyForm: TDutyForm;
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
    padding: 16,
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
  scrollContent: {
    gap: 20,
    paddingBottom: 16,
  },
  listBox: {
    paddingBottom: 16,
    gap: 20,
  },
  itemBox: {
    borderRadius: 8,
    borderColor: "#B0CEFF",
    borderWidth: 1,
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
  buttonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: "white", // Optional: To give the button a distinct background
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0B3A82",
    height: 44,
    borderRadius: 4,
  },
});
