import { FormInput } from "@/components/FormInput";
import { FormPickDate } from "@/components/FormPickDate";
import { FormPickTime } from "@/components/FormPickTime";
import { FormSelectV2 } from "@/components/FormSelectV2";
import FormUploadImage from "@/components/FormUploadImage";
import { ChooseDutyTypesAndDutyTypeUsers } from "@/components/form";
import { Colors } from "@/constants/Colors";
import { ROLE_CODE } from "@/constants/Misc";
import { DutyFormCreateContext } from "@/contexts";
import { hasNullishValue, pickProperties } from "@/helper/common";
import { useCreateNewForm, useFetchSalaryCoefTypes, useUserApprovesByRole } from "@/hooks/form";
import { TDutyFormAttendanceInfo, TDutyFormCreateDutyTypeInfo, TDutyFormCreateFormField } from "@/types";
import { MyToast } from "@/ui/MyToast";
import { SkeletonRectangleLoader } from "@/ui/skeletons";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { useCallback } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { ScrollView, StyleSheet, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Button } from "react-native-paper";

export default function CreateDutyForm() {
  const { salaryCoefficientTypes } = useFetchSalaryCoefTypes();
  const { isLoading: isFetchingUserApproves, users, onFetchUserApprovesInMultiTeams } = useUserApprovesByRole();
  const { onCreate } = useCreateNewForm();
  const {
    control,
    getValues,
    formState: { isSubmitting },
    handleSubmit,
  } = useForm<TDutyFormCreateFormField>();
  const { fields, append, update, remove } = useFieldArray({ name: "dutyTypes", control: control });

  const onAddDutyType = useCallback(
    (newDutyType: TDutyFormCreateDutyTypeInfo) => {
      const { dutyTypeId, dutyTypeName } = newDutyType;
      append({ dutyTypeName, dutyTypeId, dutyTypeUsers: [] });
    },
    [append, fields]
  );

  const onRemoveDutyType = useCallback(
    (index: number) => {
      remove(index);
    },
    [remove]
  );

  const updateDutyTypeUser = useCallback(
    (fieldArrayIndex: number, user: TDutyFormAttendanceInfo, action: "add" | "remove") => {
      const userId = user.id;
      const dutyType = fields[fieldArrayIndex];

      if (action === "add") {
        update(fieldArrayIndex, { ...dutyType, dutyTypeUsers: [...dutyType.dutyTypeUsers, user] });
      }
      if (action === "remove") {
        const newDutyTypeUsers = dutyType.dutyTypeUsers.filter((user) => user.id !== userId);
        update(fieldArrayIndex, { ...dutyType, dutyTypeUsers: newDutyTypeUsers });
      }
    },
    [fields]
  );

  const updateUserApproves = useCallback(() => {
    // get teamIds from dutyTypes field of form
    const teamIds: number[] = [];
    getValues("dutyTypes").forEach((dutyType) => {
      dutyType.dutyTypeUsers.forEach((user) => {
        teamIds.push(user.teamId);
      });
    });
    // refetch user apporves
    onFetchUserApprovesInMultiTeams({ role: ROLE_CODE.TEAM_DIRECTOR, teamIds: teamIds });
  }, [getValues, onFetchUserApprovesInMultiTeams]);

  const salaryCoefTypeOpts = salaryCoefficientTypes.map(({ id, name, coefficient }) => ({
    value: id,
    label: `${name} (x${coefficient.toFixed(2)})`,
  }));
  const userApproveOpts = users.map(({ identifyCard, name }) => ({ value: identifyCard, label: `${name}` }));

  const onSubmit = useCallback(async (values: TDutyFormCreateFormField) => {
    try {
      const requiredValues = pickProperties(values, [
        "date",
        "startTime",
        "endTime",
        "salaryCoefficientTypeId",
        "dutyTypes",
        "userApproveIdentifyCard",
      ]);
      if (hasNullishValue(requiredValues)) {
        MyToast.error("Hãy nhập đủ các thông tin yêu cầu");
        return;
      }

      await onCreate(values);
    } catch (error: any) {
      MyToast.error(error.message);
    }
  }, []);
  return (
    <DutyFormCreateContext.Provider
      value={{ updateUserApproves, onAddDutyType, onRemoveDutyType, updateDutyTypeUser, formDutyTypes: getValues("dutyTypes") ?? [] }}
    >
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

            <ChooseDutyTypesAndDutyTypeUsers control={control} />

            {isFetchingUserApproves && <SkeletonRectangleLoader height={60} />}
            {!isFetchingUserApproves && (
              <FormSelectV2
                useControllerProps={{ control: control, name: "userApproveIdentifyCard" }}
                options={userApproveOpts}
                label="Lãnh đạo phê duyệt"
                required
                placeholder="Chọn lãnh đạo phê duyệt"
                leftIcon={<MaterialCommunityIcons name="human-queue" size={18} color={Colors.light.inputIconNone} />}
              />
            )}

            <FormInput formInputProps={{ control: control, name: "note" }} label="Ghi chú" placeholder="Nhập ghi chú..." />
            <FormUploadImage label="Ảnh đính kèm" useControllerProps={{ control: control, name: "attachFile" }} />
            <View style={styles.actionContainer}>
              <Button
                onPress={handleSubmit(onSubmit)}
                mode="contained"
                icon="content-save-all-outline"
                loading={isSubmitting}
                style={styles.buttonContained}
              >
                Lưu
              </Button>
            </View>
          </ScrollView>
        </View>
      </KeyboardAwareScrollView>
    </DutyFormCreateContext.Provider>
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
  actionContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
  },
  buttonContained: {
    borderRadius: 4,
    height: 44,
  },
  timeRangeContainer: {
    flexDirection: "row",
    gap: 12,
  },
  timeRangeItem: {
    flexGrow: 1,
  },
});
