import { FormInput } from "@/components/FormInput";
import { FormPickDateTime } from "@/components/FormPickDateTime";
import { FormSelectV2 } from "@/components/FormSelectV2";
import FormUploadImage from "@/components/FormUploadImage";
import { NunitoText } from "@/components/text/NunitoText";
import { Colors } from "@/constants/Colors";
import { useSession } from "@/contexts/ctx";
import { hasNullishValue } from "@/helper/common";
import { MyToast } from "@/ui/MyToast";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

const LeaveTypeIconLeft = require("@/assets/images/identify-card.png");

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
  const router = useRouter();

  const { control, handleSubmit } = useForm<CreateItemForm>({
    defaultValues: { startDate: undefined, endDate: undefined },
  });

  const leaveTypeOpts = leaveTypes.map((leaveType) => ({ value: leaveType.id, label: leaveType.name }));
  const userApproveOpts = userApproves.map((user) => ({ value: user.identifyCard, label: user.name }));

  const onCreate = async (value: CreateItemForm) => {
    try {
      if (hasNullishValue(value)) return;
      const bodyData: CreateItemForm = {
        ...value,
      };

      const formData = new FormData();

      Object.entries(bodyData).forEach(([k, v]) => {
        if (typeof v === "number") formData.append(k, v.toString());
        else if (v instanceof Date) {
          const formattedDate = v.toISOString().slice(0, 19); // 'yyyy-MM-ddTHH:mm:ss'<=>(2024-09-11T23:25:00) if dont slice the format be like: '2024-09-11T23:25:00.000Z'
          formData.append(k, formattedDate);
        } else formData.append(k, v as File);
      });

      const token = `Bearer ${session}` ?? "xxx";
      const baseUrl = "http://13.228.145.165:8080/api/v1";
      const endpoint = "/leave-forms/create";
      const url = `${baseUrl}${endpoint}`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: token,
        }, // do not set content-type for formData, let browser do it automatically
        body: formData,
        credentials: "include",
      });

      const responseJson = await response.json();
      console.log(responseJson);

      if (responseJson.statusCode === 200) {
        MyToast.success("Thành công");
        router.back();
      } else {
        MyToast.error(responseJson.error);
        console.log(responseJson);
      }
    } catch (error: any) {
      MyToast.error(error.message);
      console.log(error);
    }
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
      MyToast.error(responseJson.error);
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
      MyToast.error(responseJson.error);
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
          label="Thời gian bắt đầu"
          required
          placeholder="Chọn ngày và giờ"
          leftIcon={<MaterialCommunityIcons name="calendar-start" size={18} color={Colors.light.inputIconNone} />}
        />
        <FormPickDateTime
          useControllerProps={{ control: control, name: "endDate" }}
          label="Thời gian kết thúc"
          required
          placeholder="Chọn ngày và giờ"
          leftIcon={<MaterialCommunityIcons name="calendar-end" size={18} color={Colors.light.inputIconNone} />}
        />
        <FormSelectV2
          useControllerProps={{ control: control, name: "leaveFormTypeId" }}
          options={leaveTypeOpts}
          label="Loại nghỉ"
          required
          placeholder="Chọn loại nghỉ"
          leftIcon={<MaterialCommunityIcons name="form-dropdown" size={18} color={Colors.light.inputIconNone} />}
        />
        <FormSelectV2
          useControllerProps={{ control: control, name: "userApproveIdentifyCard" }}
          options={userApproveOpts}
          label="Lãnh đạo phê duyệt"
          required
          placeholder="Chọn lãnh đạo phê duyệt"
          leftIcon={<MaterialCommunityIcons name="human-queue" size={18} color={Colors.light.inputIconNone} />}
        />

        <FormUploadImage label="Ảnh đính kèm" required useControllerProps={{ control: control, name: "attachFile" }} />

        <FormInput formInputProps={{ control: control, name: "note" }} label="Ghi chú" placeholder="Nhập ghi chú..." />
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
    height: 44,
    borderRadius: 4,
  },
});
