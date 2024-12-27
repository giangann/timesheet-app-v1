import { TOvertimeFormDetail, TOvertimeFormEditFormFields, TUserApprove } from "@/api/form/types";
import { FormInput } from "@/components/FormInput";
import { FormPickDate } from "@/components/FormPickDate";
import { FormPickTime } from "@/components/FormPickTime";
import { FormSelectV2 } from "@/components/FormSelectV2";
import FormUploadImage from "@/components/FormUploadImage";
import { NunitoText } from "@/components/text/NunitoText";
import { Colors } from "@/constants/Colors";
import { ROLE_CODE } from "@/constants/Misc";
import { useSession } from "@/contexts";
import { combineDateAndTimeToDateObject, dirtyValues, hasNullishValue, pickProperties } from "@/helper/common";
import { useEditOvertimeForm, useFetchSalaryCoefTypes, useUserApprovesByRole } from "@/hooks/form";
import { MyToast } from "@/ui/MyToast";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { memo, useCallback, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import * as Progress from "react-native-progress";

type OvertimeFormEditProps = { form: TOvertimeFormDetail };

export const OvertimeFormEdit: React.FC<OvertimeFormEditProps> = memo(({ form }) => {
  const [userApproves, setUserApproves] = useState<TUserApprove[]>([]);

  const { userInfo } = useSession();
  const { onEdit } = useEditOvertimeForm();
  const { onFetchUsers } = useUserApprovesByRole();
  const { salaryCoefficientTypes } = useFetchSalaryCoefTypes();

  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { isSubmitting, dirtyFields },
  } = useForm<TOvertimeFormEditFormFields>({
    defaultValues: {
      date: new Date(form.date),
      startTime: combineDateAndTimeToDateObject(form.date, form.startTime),
      endTime: combineDateAndTimeToDateObject(form.date, form.endTime),
      salaryCoefficientTypeId: form.salaryCoefficientType.id,
      userApproveIdentifyCard: form.userApproveIdentifyCard,
      note: form.note,
    },
  });

  const salaryCoefTypeOpts = useMemo(
    () =>
      salaryCoefficientTypes.map(({ id, name, coefficient }) => ({
        value: id,
        label: `${name} (x${coefficient.toFixed(2)})`,
      })),
    [salaryCoefficientTypes]
  );
  const userApproveOpts = useMemo(() => userApproves.map((user) => ({ value: user.identifyCard, label: user.name })), [userApproves]);

  const onCreate = useCallback(
    async (value: TOvertimeFormEditFormFields) => {
      try {
        const requiredValues = pickProperties(value, ["date", "startTime", "endTime", "salaryCoefficientTypeId", "userApproveIdentifyCard"]);
        if (hasNullishValue(requiredValues)) {
          MyToast.error("Hãy nhập đủ các thông tin yêu cầu");
          return;
        }

        const editedFields = dirtyValues(dirtyFields, value);
        onEdit(form.id, editedFields);
      } catch (error: any) {
        MyToast.error(error.message);
      }
    },
    [form, dirtyFields]
  );

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
            useControllerProps={{ control: control, name: "salaryCoefficientTypeId" }}
            options={salaryCoefTypeOpts}
            label="Loại ngoài giờ"
            required
            placeholder="Chọn loại ngoài giờ"
            leftIcon={<MaterialIcons name="more-time" size={18} color={Colors.light.inputIconNone} />}
          />
          <FormSelectV2
            useControllerProps={{ control: control, name: "userApproveIdentifyCard" }}
            options={userApproveOpts}
            label="Lãnh đạo phê duyệt"
            required
            placeholder="Chọn lãnh đạo phê duyệt"
            leftIcon={<MaterialCommunityIcons name="human-queue" size={18} color={Colors.light.inputIconNone} />}
          />

          <FormUploadImage defaultUri={form.attachFilePath} label="Ảnh đính kèm" useControllerProps={{ control: control, name: "attachFile" }} />

          <FormInput formInputProps={{ control: control, name: "note" }} label="Nội dung công việc" placeholder="Nhập dữ liệu..." />
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
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",

    backgroundColor: "#0B3A82",
    height: 44,
    borderRadius: 4,

    gap: 8,
  },
});
