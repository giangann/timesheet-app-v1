import { FormInput } from "@/components/FormInput";
import { FormPickDate } from "@/components/FormPickDate";
import { FormPickTime } from "@/components/FormPickTime";
import { FormSelectV2 } from "@/components/FormSelectV2";
import FormUploadImage from "@/components/FormUploadImage";
import { ChooseDutyTypesAndDutyTypeUsers } from "@/components/form";
import { Colors } from "@/constants/Colors";
import { ROLE_CODE } from "@/constants/Misc";
import { hasNullishValue, pickProperties } from "@/helper/common";
import { useCreateNewForm, useFetchSalaryCoefTypes, useUserApprovesByRole } from "@/hooks/form";
import { TDutyFormCreateFormField } from "@/types";
import { MyToast } from "@/ui/MyToast";
import { SkeletonRectangleLoader } from "@/ui/skeletons";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { useCallback, useRef } from "react";
import { useForm } from "react-hook-form";
import { ScrollView, StyleSheet, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Button } from "react-native-paper";

export default function CreateDutyForm() {
  const { salaryCoefficientTypes } = useFetchSalaryCoefTypes();
  const { isLoading: isFetchingUserApproves, users, onFetchUserApprovesInMultiTeams } = useUserApprovesByRole();
  const { onCreate } = useCreateNewForm();
  const teamIdsRef = useRef<number[]>([]);

  const updateTeamIdsRef = useCallback(
    (newTeamId: number, action: "check" | "uncheck") => {
      const nowTeamIds = teamIdsRef.current;

      if (action === "check") {
        if (!nowTeamIds.includes(newTeamId)) {
          teamIdsRef.current = [...nowTeamIds, newTeamId];
        }
      }
      if (action === "uncheck") {
        teamIdsRef.current = nowTeamIds.filter((teamId) => teamId !== newTeamId);
      }

      return teamIdsRef.current;
    },
    [teamIdsRef.current]
  );

  const onRefetchUserApproveWhenChangeAttendance = useCallback(() => {
    const teamIds = teamIdsRef.current;
    onFetchUserApprovesInMultiTeams({ role: ROLE_CODE.TEAM_DIRECTOR, teamIds: teamIds });
  }, [teamIdsRef]);

  const {
    control,
    formState: { isSubmitting },
    handleSubmit,
  } = useForm<TDutyFormCreateFormField>();
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

          <ChooseDutyTypesAndDutyTypeUsers
            updateTeamIds={updateTeamIdsRef}
            updateUserApproves={onRefetchUserApproveWhenChangeAttendance}
            control={control}
          />

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
