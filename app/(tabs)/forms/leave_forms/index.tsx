import { OPACITY_TO_HEX } from "@/constants/Colors";
import { FORM_STATUS, FORM_STATUS_NAME, UNIT_DIMENSION } from "@/constants/Misc";
import { useSession } from "@/contexts/ctx";
import { MyToast } from "@/ui/MyToast";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Button, ScrollView, StyleSheet, View } from "react-native";
const AddNewIconImage = require("@/assets/images/add-new-icon.png");
const FilterIconImage = require("@/assets/images/filter-icon.png");
const LeaveTypeIconLeft = require("@/assets/images/identify-card.png");

type TLeaveForm = {
  id: number;
  startDate: string;
  endDate: string;
  note: string;
  userIdentifyCard: string;
  userName: string;
  userApproveName: string;
  leaveFormTypeName: string;
  status: FORM_STATUS;
  filePath: string;
  isDeleted: false;
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
};

export default function LeaveForms() {
  const [leaveForms, setLeaveForms] = useState<TLeaveForm[]>([]);
  const router = useRouter();
  const { session } = useSession();

  const fetchLeaveForms = async () => {
    const token = `Bearer ${session}` ?? "xxx";

    const baseUrl = "http://13.228.145.165:8080/api/v1";
    const endpoint = "/leave-forms/filter";
    const queryString = `?page=0&size=10&sort=endDate,desc`;
    const url = `${baseUrl}${endpoint}${queryString}`;

    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify({}),
      headers: { "Content-Type": "application/json", Authorization: token },
      credentials: "include",
    });
    const responseJson = await response.json();

    if (responseJson.statusCode === 200) {
      setLeaveForms(responseJson.data.leaveForms);
    } else {
      MyToast.error(responseJson.error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchLeaveForms();
    }, [])
  );

  return (
    <View style={styles.container}>
      <Button title="Tạo đơn xin nghỉ" onPress={() => router.push("/forms/leave_forms/create-leave-form")} />
      <ScrollView contentContainerStyle={[styles.listBox, { marginTop: 32 }]}>
        {leaveForms.map((leaveForm) => (
          <Button
            key={leaveForm.id}
            title={`${leaveForm.id} - ${FORM_STATUS_NAME[leaveForm.status]}`}
            onPress={() => {
              router.push({
                pathname: "/(tabs)/forms/leave_forms/[id]",
                params: { id: leaveForm.id },
              });
            }}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "white",
    minHeight: "100%",
  },
  toolbar: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 4,
    marginBottom: 20,
  },
  listBox: {
    gap: 10,
  },
  itemBox: {
    backgroundColor: `#0B3A82${OPACITY_TO_HEX["15"]}`,
    paddingHorizontal: 16 * UNIT_DIMENSION,
    paddingVertical: 12 * UNIT_DIMENSION,
    borderRadius: 8 * UNIT_DIMENSION,

    flexDirection: "row",
    alignItems: "center",
  },
  indexBox: {
    backgroundColor: `#0B3A82`,
    padding: 10 * UNIT_DIMENSION,
    borderRadius: 8 * UNIT_DIMENSION,
    marginRight: 12 * UNIT_DIMENSION,
  },
});
