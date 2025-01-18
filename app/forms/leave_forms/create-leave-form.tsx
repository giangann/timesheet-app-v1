import { fetchListUserByRole } from "@/api/form";
import { FormInput } from "@/components/FormInput";
import { FormPickDateTime } from "@/components/FormPickDateTime";
import { FormSelectV2 } from "@/components/FormSelectV2";
import FormUploadImage from "@/components/FormUploadImage";
import { NunitoText } from "@/components/text/NunitoText";
import { Colors } from "@/constants/Colors";
import { ROLE_CODE } from "@/constants/Misc";
import { BASE_URL } from "@/constants/System";
import { useSession } from "@/contexts/ctx";
import { hasNullishValue, pickProperties } from "@/helper/common";
import { defaultLeaveFormDateTime, formatDateToLocalString, isMoreThanOneDay } from "@/helper/date";
import { useLeaveType } from "@/hooks/form";
import { MyToast } from "@/ui/MyToast";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import * as Progress from "react-native-progress";

type CreateItemForm = {
  startDate: Date;
  endDate: Date;
  leaveFormTypeId: number;
  userApproveIdentifyCard: number;
  attachFile: File | null;
  note: string | null;
};

type TUserApprove = {
  identifyCard: number;
  name: string;
};
export default function CreateLeaveForm() {
  const [userApproves, setUserApproves] = useState<TUserApprove[]>([]);

  const { leaveTypes } = useLeaveType();
  const { session, userInfo } = useSession();
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
    getValues,
  } = useForm<CreateItemForm>({
    defaultValues: { startDate: undefined, endDate: undefined },
  });

  const leaveTypeOpts = leaveTypes.map((leaveType) => ({ value: leaveType.id, label: leaveType.name }));
  const userApproveOpts = userApproves.map((user) => ({ value: user.identifyCard, label: user.name }));

  const fetchUserApproves = useCallback(
    async (role: ROLE_CODE) => {
      const responseJson = await fetchListUserByRole(session, { role, teamId: userInfo?.team?.id ?? -1 });

      if (responseJson.statusCode === 200) {
        setUserApproves(responseJson.data.users);
      } else {
        MyToast.error(responseJson.error);
      }
    },
    [session, userInfo, setUserApproves]
  );

  const fetchDepartmentDirector = useCallback(async () => {
    const responseJson = await fetchListUserByRole(session, { role: ROLE_CODE.DEPARTMENT_DIRECTOR });

    if (responseJson.statusCode === 200) {
      setUserApproves(responseJson.data.users);
    } else {
      MyToast.error(responseJson.error);
    }
  }, [session, setUserApproves]);

  const onStartDateTimeChange = useCallback(
    (newStartDateTime: Date) => {
      const endDate = getValues("endDate");
      if (isMoreThanOneDay(newStartDateTime, endDate)) {
        fetchDepartmentDirector();
      }
    },
    [getValues, fetchDepartmentDirector]
  );

  const onEndDateTimeChange = useCallback(
    (newEndDateTime: Date) => {
      const startDate = getValues("startDate");

      if (isMoreThanOneDay(startDate, newEndDateTime)) {
        fetchDepartmentDirector();
      }
    },
    [getValues, fetchDepartmentDirector]
  );

  const onCreate = async (value: CreateItemForm) => {
    try {
      const requiredValues = pickProperties(value, ["startDate", "endDate", "leaveFormTypeId", "userApproveIdentifyCard"]);
      if (hasNullishValue(requiredValues)) {
        MyToast.error("Hãy nhập đủ các thông tin yêu cầu");
        return;
      }
      const bodyData: CreateItemForm = {
        ...value,
      };

      const formData = new FormData();

      Object.entries(bodyData).forEach(([k, v]) => {
        if (v !== null && v !== undefined) {
          if (typeof v === "number") formData.append(k, v.toString());
          else if (v instanceof Date) {
            const formattedDate = formatDateToLocalString(v); // 'yyyy-MM-ddTHH:mm:ss'<=>(2024-09-11T23:25:00) if dont slice the format be like: '2024-09-11T23:25:00.000Z'
            formData.append(k, formattedDate);
          } else formData.append(k, v as File);
        }
      });

      const token = `Bearer ${session}`;
      const baseUrl = BASE_URL;
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

      if (responseJson.statusCode === 200) {
        MyToast.success("Thành công");
        router.back();
      } else {
        MyToast.error(responseJson.error ?? responseJson.message);
      }
    } catch (error: any) {
      MyToast.error(error.message);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchUserApproves(ROLE_CODE.TEAM_DIRECTOR);
    }, [])
  );

  return (
    <KeyboardAwareScrollView>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <FormPickDateTime
            useControllerProps={{ control: control, name: "startDate" }}
            label="Thời gian bắt đầu"
            required
            placeholder="Chọn ngày và giờ"
            leftIcon={<MaterialCommunityIcons name="calendar-start" size={18} color={Colors.light.inputIconNone} />}
            initDate={defaultLeaveFormDateTime().startDate}
            onDateTimeChange={onStartDateTimeChange}
          />
          <FormPickDateTime
            useControllerProps={{ control: control, name: "endDate" }}
            label="Thời gian kết thúc"
            required
            placeholder="Chọn ngày và giờ"
            leftIcon={<MaterialCommunityIcons name="calendar-end" size={18} color={Colors.light.inputIconNone} />}
            initDate={defaultLeaveFormDateTime().endDate}
            onDateTimeChange={onEndDateTimeChange}
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

          <FormInput formInputProps={{ control: control, name: "note" }} label="Ghi chú" placeholder="Nhập ghi chú..." />
          <FormUploadImage label="Ảnh đính kèm" useControllerProps={{ control: control, name: "attachFile" }} />
        </ScrollView>
        <TouchableOpacity onPress={handleSubmit(onCreate)} activeOpacity={0.8} style={styles.buttonContainer} disabled={isSubmitting}>
          <View style={styles.button}>
            {isSubmitting && <Progress.Circle indeterminate size={14} />}
            <NunitoText type="body3" style={{ color: "white" }}>
              Gửi duyệt
            </NunitoText>
          </View>
        </TouchableOpacity>
      </View>
    </KeyboardAwareScrollView>
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
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",

    backgroundColor: "#0B3A82",
    height: 44,
    borderRadius: 4,

    gap: 8,
  },
});
