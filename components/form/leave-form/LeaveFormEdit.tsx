import { TLeaveFormDetail, TLeaveFormEditFormFields, TUserApprove } from "@/api/form/types";
import { FormInput } from "@/components/FormInput";
import { FormPickDateTime } from "@/components/FormPickDateTime";
import { FormSelectV2 } from "@/components/FormSelectV2";
import FormUploadImage from "@/components/FormUploadImage";
import { NunitoText } from "@/components/text/NunitoText";
import { Colors } from "@/constants/Colors";
import { ROLE_CODE } from "@/constants/Misc";
import { useSession } from "@/contexts";
import { hasNullishValue, pickProperties } from "@/helper/common";
import { useEditLeaveForm, useLeaveType, useUserApprovesByRole } from "@/hooks/form";
import { MyToast } from "@/ui/MyToast";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { memo, useCallback, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import * as Progress from "react-native-progress";

type LeaveFormEditProps = { form: TLeaveFormDetail };

export const LeaveFormEdit: React.FC<LeaveFormEditProps> = memo(({ form }) => {
  const { userInfo } = useSession();
  const { onFetchUsers } = useUserApprovesByRole();

  const { leaveTypes } = useLeaveType();
  const [userApproves, setUserApproves] = useState<TUserApprove[]>([]);

  const leaveTypeOpts = useMemo(() => leaveTypes.map((leaveType) => ({ value: leaveType.id, label: leaveType.name })), [leaveTypes]);
  const userApproveOpts = useMemo(() => userApproves.map((user) => ({ value: user.identifyCard, label: user.name })), [userApproves]);

  const { onEdit } = useEditLeaveForm();
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<TLeaveFormEditFormFields>({
    defaultValues: {
      startDate: new Date(form.startDate),
      endDate: new Date(form.endDate),
      leaveFormTypeId: 202,
      userApproveIdentifyCard: form.userApproveIdentifyCard,
      note: form.note
    },
  });

  const onSave = async (value: TLeaveFormEditFormFields) => {
    try {
      const requiredValues = pickProperties(value, ["startDate", "endDate", "leaveFormTypeId", "userApproveIdentifyCard"]);
      if (hasNullishValue(requiredValues)) {
        MyToast.error("Hãy nhập đủ các thông tin yêu cầu");
        return;
      }
      onEdit(value);
    } catch (error: any) {
      MyToast.error(error.message);
    }
  };

  const fetchUserApproves = async () => {
    const users = await onFetchUsers({ role: ROLE_CODE.TEAM_DIRECTOR, teamId: userInfo?.team?.id ?? -1 });
    setUserApproves(users);
  };

  useFocusEffect(
    useCallback(() => {
      fetchUserApproves();
    }, [userInfo])
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

          <FormUploadImage label="Ảnh đính kèm" useControllerProps={{ control: control, name: "attachFile" }} defaultUri={form.attachFilePath} />

          <FormInput formInputProps={{ control: control, name: "note" }} label="Ghi chú" placeholder="Nhập ghi chú..." />
        </ScrollView>
        <TouchableOpacity onPress={handleSubmit(onSave)} activeOpacity={0.8} style={styles.buttonContainer} disabled={isSubmitting}>
          <View style={styles.button}>
            {isSubmitting && <Progress.Circle indeterminate size={14} />}
            <NunitoText type="body3" style={{ color: "white" }}>
              Cập nhật
            </NunitoText>
          </View>
        </TouchableOpacity>
      </View>
    </KeyboardAwareScrollView>
  );
});
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
