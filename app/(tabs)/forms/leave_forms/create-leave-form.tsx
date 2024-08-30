import { FormInput } from "@/components/FormInput";
import { FormPickDate } from "@/components/FormPickDate";
import { FormPickDateTime } from "@/components/FormPickDateTime";
import { FormPickTime } from "@/components/FormPickTime";
import { FormSelect } from "@/components/FormSelect";
import FormUploadImage from "@/components/FormUploadImage";
import { NunitoText } from "@/components/text/NunitoText";
import { useSession } from "@/contexts/ctx";
import { useFocusEffect, useRouter } from "expo-router";
import moment from "moment";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { ScrollView, Image, Text, TouchableOpacity, View, StyleSheet } from "react-native";
import Toast, { ToastOptions } from "react-native-root-toast";

const LeaveTypeIconLeft = require("@/assets/images/identify-card.png");

type CreateItem = {
  startDate: string | Date;
  endDate: string | Date;
  leaveFormTypeId: number;
  userApproveIdentifyCard: number;
  attachFile: File;
  note: string;
};
type CreateItemForm = {
  startDate: string | Date;
  endDate: string | Date;
  leaveFormTypeId: number;
  userApproveIdentifyCard: number;
  attachFile: File;
  note: string;
};

type TLeaveType = {
  id: number;
  name: string;
};
type TUserApprove = {
  identifyCard: number;
  name: string;
};
export default function CreateLeaveForm() {
  const [leaveTypes, setLeaveTypes] = useState<TLeaveType[]>([]);
  const [userApproves, setUserApproves] = useState<TUserApprove[]>([]);
  const { session } = useSession();
  const { control, handleSubmit } = useForm<CreateItemForm>({
    defaultValues: { startDate: undefined, endDate: undefined },
  });

  const leaveTypeOpts = leaveTypes.map((leaveType) => ({ value: leaveType.id, label: leaveType.name }));
  const userApproveOpts = userApproves.map((user) => ({ value: user.identifyCard, label: user.name }));

  const onCreate = async (value: CreateItemForm) => {
    const bodyData: CreateItem = {
      ...value,
    };
    console.log(bodyData);
  };

  const fetchLeaveTypes = async () => {
    const token = `Bearer ${session}` ?? "xxx";

    const baseUrl = "http://13.228.145.165:8080/api/v1";
    const endpoint = "/leave-form-types";
    const url = `${baseUrl}${endpoint}`;

    const response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json", Authorization: token },
      credentials: "include",
    });
    const responseJson = await response.json();

    if (responseJson.statusCode === 200) {
      setLeaveTypes(responseJson.data.leaveFormTypes);
    } else {
      let toastEl: any = null;
      let toastOptions: ToastOptions;
      toastEl = (
        <>
          <NunitoText lightColor="white" type="body3">
            {responseJson.error}
          </NunitoText>
        </>
      );
      toastOptions = {
        backgroundColor: "#C84851",
      };
    }
  };

  const fetchUserApproves = async () => {
    const token = `Bearer ${session}` ?? "xxx";

    const baseUrl = "http://13.228.145.165:8080/api/v1";
    const endpoint = "/users/list-user-by-role?role=TEAM_DIRECTOR";
    const url = `${baseUrl}${endpoint}`;

    const response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json", Authorization: token },
      credentials: "include",
    });
    const responseJson = await response.json();

    if (responseJson.statusCode === 200) {
      setUserApproves(responseJson.data.users);
    } else {
      let toastEl: any = null;
      let toastOptions: ToastOptions;
      toastEl = (
        <>
          <NunitoText lightColor="white" type="body3">
            {responseJson.error}
          </NunitoText>
        </>
      );
      toastOptions = {
        backgroundColor: "#C84851",
      };
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchLeaveTypes();
    }, [])
  );

  useFocusEffect(
    useCallback(() => {
      fetchUserApproves();
    }, [])
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <FormPickDateTime
          useControllerProps={{ control: control, name: "startDate" }}
          leftIconImage={LeaveTypeIconLeft}
          label="Ngày giờ bắt đầu"
          required
          placeholder="Chọn ngày và giờ"
        />
        <FormPickDateTime
          useControllerProps={{ control: control, name: "endDate" }}
          leftIconImage={LeaveTypeIconLeft}
          label="Ngày giờ bắt đầu"
          required
          placeholder="Chọn ngày và giờ"
        />
        <FormSelect
          useControllerProps={{ control: control, name: "leaveFormTypeId" }}
          options={leaveTypeOpts}
          label="Loại nghỉ"
          required
          placeholder="Chọn loại nghỉ"
        />
        <FormSelect
          useControllerProps={{ control: control, name: "userApproveIdentifyCard" }}
          options={userApproveOpts}
          label="Lãnh đạo phê duyệt"
          required
          placeholder="Chọn lãnh đạo phê duyệt"
        />

        <FormUploadImage />

        <FormInput
          formInputProps={{ control: control, name: "note" }}
          leftIconImage={LeaveTypeIconLeft}
          rightIconImage={LeaveTypeIconLeft}
          label="Ghi chút"
          placeholder="Nhập ghi chú..."
        />
      </ScrollView>
      <TouchableOpacity onPress={handleSubmit(onCreate)} activeOpacity={0.8} style={styles.buttonContainer}>
        <View style={styles.button}>
          <NunitoText type="body3" style={{ color: "white" }}>
            Tạo mới
          </NunitoText>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    backgroundColor: "white",
  },
  scrollContent: {
    gap: 20,
    padding: 16,
    paddingBottom: 100, // Space at the bottom to prevent overlap with the button
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
    height: 40,
    borderRadius: 4,
  },
});
