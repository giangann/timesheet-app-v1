import { FormInput } from "@/components/FormInput";
import { FormPickDate } from "@/components/FormPickDate";
import { FormPickTime } from "@/components/FormPickTime";
import { FormSelectV2 } from "@/components/FormSelectV2";
import FormUploadImage from "@/components/FormUploadImage";
import { ChooseDutyTypesAndDutyTypeUsers } from "@/components/form";
import { Colors } from "@/constants/Colors";
import { DutyFormCreateContext } from "@/contexts";
import { hasNullishValue, pickProperties } from "@/helper/common";
import { defaultDutyFormTime } from "@/helper/date";
import { useCreateNewForm, useFetchSalaryCoefTypes } from "@/hooks/form";
import { TDutyFormAttendanceInfo, TDutyFormCreateDutyTypeInfo, TDutyFormCreateFormField } from "@/types";
import { MyToast } from "@/ui/MyToast";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { useCallback } from "react";
import { useController, useFieldArray, useForm } from "react-hook-form";
import { ScrollView, StyleSheet, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Button } from "react-native-paper";

export default function CreateDutyForm() {
  const { salaryCoefficientTypes } = useFetchSalaryCoefTypes();
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

  const salaryCoefTypeOpts = salaryCoefficientTypes.map(({ id, name, coefficient }) => ({
    value: id,
    label: `${name} (x${coefficient.toFixed(2)})`,
  }));

  // const isDateDirty = useMemo(() => useController({ control, name: "date" }).fieldState.isDirty, [fields]);
  const isDateDirty = useController({ control, name: "date" }).fieldState.isDirty;

  const onSubmit = useCallback(async (values: TDutyFormCreateFormField) => {
    try {
      const requiredValues = pickProperties(values, ["date", "startTime", "endTime", "salaryCoefficientTypeId", "dutyTypes", "note"]);
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
      value={{ onAddDutyType, onRemoveDutyType, updateDutyTypeUser, formDutyTypes: getValues("dutyTypes") ?? [], dutyDate: getValues("date") }}
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
                  initTime={defaultDutyFormTime().startTime}
                  disabled={!isDateDirty}
                />
              </View>
              <View style={styles.timeRangeItem}>
                <FormPickTime
                  useControllerProps={{ control: control, name: "endTime" }}
                  label="Giờ kết thúc"
                  placeholder="Chọn giờ"
                  required
                  leftIcon={<MaterialCommunityIcons name="clock-end" size={18} color={Colors.light.inputIconNone} />}
                  initTime={defaultDutyFormTime().endTime}
                  disabled={!isDateDirty}
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
              disabled={!isDateDirty}
            />

            <ChooseDutyTypesAndDutyTypeUsers />

            <FormInput
              formInputProps={{ control: control, name: "note" }}
              label="Nội dung công việc"
              placeholder="Nhập nội dung..."
              disabled={!isDateDirty}
              required
            />
            <FormUploadImage label="Ảnh đính kèm" useControllerProps={{ control: control, name: "attachFile" }} disabled={!isDateDirty} />
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
