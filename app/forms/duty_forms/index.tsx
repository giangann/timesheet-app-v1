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
import { Image, Pressable, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
const UserAvatar = require("@/assets/images/avatar-test.png");
const ExpandIcon = require("@/assets/images/arrow-down-expand.png");
const CollapseIcon = require("@/assets/images/arrow-up-collapse.png");

type TFormUserApply = {
  name: string;
  identifyCard: string;
  roleId: number;
  roleName: string;
  roleCode: string;
};

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
  users: TFormUserApply[];
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

export default function DutyForms() {
  const [isLoading, setIsLoading] = useState(false);
  const [dutyForms, setDutyForms] = useState<TDutyForm[]>([]);
  const { session } = useSession();

  const fetchDutyForms = async () => {
    setIsLoading(true);
    try {
      const token = `Bearer ${session}` ?? "xxx";

      const baseUrl = "https://proven-incredibly-redbird.ngrok-free.app/api/v1";
      const endpoint = "/duty-forms/filter/user";
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
      <ApplyNewForm />
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
  const { userInfo } = useSession();

  const onGoToFormDetail = () => {
    router.navigate({
      pathname: "/forms/duty_forms/[id]",
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
            <AvatarByRole role={dutyForm.userApproveRole.code} />
            <View style={{ gap: 4 }}>
              <NunitoText type="body3">{dutyForm.userApproveName}</NunitoText>
              <NunitoText type="body4" style={{ opacity: 0.75 }}>
                {dutyForm.userApproveRole.name}
              </NunitoText>
            </View>
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

const ApplyNewForm = () => {
  const router = useRouter();
  return (
    <TouchableOpacity onPress={() => router.push("/forms/duty_forms/create-duty-form")} activeOpacity={0.8} style={styles.buttonContainer}>
      <View style={styles.button}>
        <NunitoText type="body3" style={{ color: "white" }}>
          Tạo đơn mới
        </NunitoText>
      </View>
    </TouchableOpacity>
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
    paddingBottom: 100, // Space at the bottom to prevent overlap with the button
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
