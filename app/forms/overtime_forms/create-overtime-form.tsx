import { FormInput } from "@/components/FormInput";
import { FormPickDate } from "@/components/FormPickDate";
import { FormPickDateTime } from "@/components/FormPickDateTime";
import { FormPickTime } from "@/components/FormPickTime";
import { FormSelectV2 } from "@/components/FormSelectV2";
import FormUploadImage from "@/components/FormUploadImage";
import { NunitoText } from "@/components/text/NunitoText";
import { Colors } from "@/constants/Colors";
import { useSession } from "@/contexts/ctx";
import { hasNullishValue } from "@/helper/common";
import { MyToast } from "@/ui/MyToast";
import { MaterialIcons } from "@expo/vector-icons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useFocusEffect, useRouter } from "expo-router";
import moment from "moment";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

type CreateItemForm = {
  date: Date | null;
  startTime: Date | null;
  endTime: Date | null;
  salaryCoefFormTypeId: number | null;
  userApproveIdentifyCard: number | null;
  attachFile: File | null;
  note: string | null;
};

type CreateItem = {
  date: string;
  startTime: string;
  endTime: string;
  salaryCoefFormTypeId: number;
  userApproveIdentifyCard: number;
  attachFile: File;
  note: string;
};

type TSalaryCoefficientType = {
  id: number;
  name: string;
  coefficient: number;
};
type TUserApprove = {
  identifyCard: number;
  name: string;
};
export default function CreateOvertimeForm() {
  const [salaryCoefficientTypes, setSalaryCoefficientTypes] = useState<TSalaryCoefficientType[]>([]);
  const [userApproves, setUserApproves] = useState<TUserApprove[]>([]);

  const { session } = useSession();
  const router = useRouter();
  const { control, handleSubmit } = useForm<CreateItemForm>();

  const salaryCoefTypeOpts = salaryCoefficientTypes.map(({ id, name, coefficient }) => ({
    value: id,
    label: `${name} (x${coefficient.toFixed(2)})`,
  }));
  const userApproveOpts = userApproves.map((user) => ({ value: user.identifyCard, label: user.name }));

  const onCreate = async (value: CreateItemForm) => {
    try {
      if (hasNullishValue(value)) return;

      const bodyData: CreateItem = {
        date: value.date ? moment(value.date).format("YYYY-MM-DD") : "", // Handle null or Date
        startTime: value.startTime ? moment(value.startTime).format("HH:mm:ss") : "", // Handle null or Date
        endTime: value.endTime ? moment(value.endTime).format("HH:mm:ss") : "", // Handle null or Date
        salaryCoefFormTypeId: value.salaryCoefFormTypeId ?? 0, // Handle null or number
        userApproveIdentifyCard: value.userApproveIdentifyCard ?? 0, // Handle null or number
        attachFile: value.attachFile ?? new File([], ""), // Handle null or File
        note: value.note ?? "", // Handle null or string
      };
      console.log("bodyData", bodyData);
      const formData = new FormData();
      Object.entries(bodyData).forEach(([k, v]) => {
        if (typeof v === "number") formData.append(k, v.toString());
        else if (v instanceof Date) formData.append(k, moment(v).format("YYYY-MM-DD"));
        else if (v instanceof File) formData.append(k, v as File);
      });

      const token = `Bearer ${session}` ?? "xxx";
      const baseUrl = "http://13.228.145.165:8080/api/v1";
      const endpoint = "/overtime-forms";
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

  const fetchSalaryCoefTypes = async () => {
    const token = `Bearer ${session}` ?? "xxx";

    const baseUrl = "http://13.228.145.165:8080/api/v1";
    const endpoint = "/salary-coefficient-types";
    const url = `${baseUrl}${endpoint}`;

    const response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json", Authorization: token },
      credentials: "include",
    });
    const responseJson = await response.json();

    if (responseJson.statusCode === 200) {
      setSalaryCoefficientTypes(responseJson.data.salaryCoefficientTypes);
    } else {
      MyToast.error(responseJson.error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchSalaryCoefTypes();
    }, [])
  );

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
      fetchUserApproves();
    }, [])
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <FormPickDate useControllerProps={{ control: control, name: "date" }} label="Ngày" required placeholder="Chọn ngày..." />

        <View style={styles.timeRangeContainer}>
          <View style={styles.timeRangeItem}>
            <FormPickTime
              useControllerProps={{ control: control, name: "startTime" }}
              label="Giờ bắt đầu"
              placeholder="Chọn giờ"
              required
              leftIcon={<MaterialCommunityIcons name="clock-start" size={18} color={Colors.light.inputIconNone} />}
            />
          </View>
          <View style={styles.timeRangeItem}>
            <FormPickTime
              useControllerProps={{ control: control, name: "endTime" }}
              label="Giờ kết thúc"
              placeholder="Chọn giờ"
              required
              leftIcon={<MaterialCommunityIcons name="clock-end" size={18} color={Colors.light.inputIconNone} />}
            />
          </View>
        </View>
        <FormSelectV2
          useControllerProps={{ control: control, name: "salaryCoefFormTypeId" }}
          options={salaryCoefTypeOpts}
          label="Loại ngoài giờ"
          required
          placeholder="Chọn loại ngoài giờ"
          leftIcon={<MaterialIcons name="more-time" size={18} color={Colors.light.inputIconNone} />}

          //   leftIcon={<MaterialCommunityIcons name="form-dropdown" size={18} color={Colors.light.inputIconNone} />}
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
  timeRangeContainer: {
    flexDirection: "row",
    gap: 12,
  },
  timeRangeItem: {
    flexGrow: 1,
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
