import { NunitoText } from "@/components/text/NunitoText";
import { OPACITY_TO_HEX } from "@/constants/Colors";
import { FORM_STATUS, FORM_STATUS_NAME, ROLE_CODE } from "@/constants/Misc";
import { useSession } from "@/contexts/ctx";
import { AvatarByRole } from "@/ui/AvatarByRole";
import { ChipStatus } from "@/ui/ChipStatus";
import { MyToast } from "@/ui/MyToast";
import { useFocusEffect, useRouter } from "expo-router";
import moment from "moment";
import { useCallback, useState } from "react";
import { Button, Image, Pressable, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
const UserAvatar = require("@/assets/images/avatar-test.png");
const ExpandIcon = require("@/assets/images/arrow-down-expand.png");
const CollapseIcon = require("@/assets/images/arrow-up-collapse.png");

type TOvertimeForm = {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
  userApproveIdentifyCard: string;
  userApproveName: string;
  note: string;
  status: FORM_STATUS;
  isDeleted: boolean;
  typeOfWorking: any;
  reason: string | null;
  approveDate: string | null;
  attachFilePath: string;
  salaryCoefficientName: string;
  salaryCoefficient: number;
  userName: string;
  userIdentifyCard: string;
  userRole: {
    id: number;
    code: string;
    name: string;
  };
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
export default function OvertimeForms() {
  const [overtimeForms, setOvertimeForms] = useState<TOvertimeForm[]>([]);
  const router = useRouter();
  const { session } = useSession();

  const fetchOvertimeForms = async () => {
    const token = `Bearer ${session}` ?? "xxx";

    const baseUrl = "http://13.228.145.165:8080/api/v1";
    const endpoint = "/overtime-forms/filter/user";
    const queryString = `?page=0&size=10`;
    const url = `${baseUrl}${endpoint}${queryString}`;

    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify({}),
      headers: { "Content-Type": "application/json", Authorization: token },
      credentials: "include",
    });
    const responseJson = await response.json();
    console.log("responseJson", responseJson);
    if (responseJson.statusCode === 200) {
      setOvertimeForms(responseJson.data.overtimeForms);
    } else {
      MyToast.error(responseJson.error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchOvertimeForms();
    }, [])
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={[styles.listBox, { marginTop: 32 }]}>
        <List overtimeForms={overtimeForms} />
      </ScrollView>
      <ApplyNewForm />
    </View>
  );
}
type ListProps = {
  overtimeForms: TOvertimeForm[];
};
const List: React.FC<ListProps> = ({ overtimeForms }) => {
  return (
    <View style={styles.listBox}>
      {overtimeForms.map((form) => (
        <Item key={form.id} overtimeForm={form} />
      ))}
    </View>
  );
};

type ItemProps = {
  overtimeForm: TOvertimeForm;
};
const Item: React.FC<ItemProps> = ({ overtimeForm }) => {
  const [isExpand, setIsExpand] = useState(false);
  const router = useRouter();

  const onGoToFormDetail = () => {
    router.navigate({
      pathname: "/forms/leave_forms/[id]",
      params: { id: overtimeForm.id },
    });
  };

  const onToggleExpand = () => setIsExpand(!isExpand);

  return (
    <View style={styles.itemBox}>
      {/* sumary */}
      <Pressable onPress={onGoToFormDetail}>
        <View style={styles.itemBoxSumary}>
          <View style={styles.userInfo}>
            <AvatarByRole role={overtimeForm.userApproveRole.code} />
            <View style={{ gap: 4 }}>
              <NunitoText type="body3">{overtimeForm.userApproveName}</NunitoText>
              <NunitoText type="body4" style={{ opacity: 0.75 }}>
                {overtimeForm.userApproveRole.name}
              </NunitoText>
            </View>
          </View>
          <View style={styles.formInfo}>
            <ChipStatus status={overtimeForm.status} />
            <View>
              <View>
                <NunitoText type="body4" style={{ opacity: 0.675 }}>
                  {overtimeForm.startTime}
                </NunitoText>
                <NunitoText type="body4" style={{ opacity: 0.675 }}>
                  {overtimeForm.endTime}
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
            <NunitoText type="body2">Loại ngoài giờ: </NunitoText>
            {`${overtimeForm.salaryCoefficientName} (x${overtimeForm.salaryCoefficient.toFixed(2)})`}
          </NunitoText>

          <NunitoText type="body4">
            <NunitoText type="body2">Người phê duyệt: </NunitoText>
            {overtimeForm.userApproveName}
          </NunitoText>
          <NunitoText type="body4">
            <NunitoText type="body2">Ghi chú: </NunitoText>
            {overtimeForm.note}
          </NunitoText>
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
    <TouchableOpacity onPress={() => router.push("/forms/overtime_forms/create-overtime-form")} activeOpacity={0.8} style={styles.buttonContainer}>
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
