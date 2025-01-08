import { FormInputMultilne } from "@/components/FormInputMultiLine";
import { FormPickDate } from "@/components/FormPickDate";
import { FormPickTime } from "@/components/FormPickTime";
import { FormSelectV2 } from "@/components/FormSelectV2";
import FormUploadImage from "@/components/FormUploadImage";
import { Colors } from "@/constants/Colors";
import { hasNullishValue, pickProperties } from "@/helper/common";
import { defaultDutyFormTime } from "@/helper/date";
import { useCreateNewForm, useFetchSalaryCoefTypes } from "@/hooks/form";
import { useDutyFormCreateProvider } from "@/providers";
import { TDutyFormCreateFormField } from "@/types";
import { MyToast } from "@/ui/MyToast";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { useCallback } from "react";
import { useController } from "react-hook-form";
import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Button } from "react-native-paper";
import { FormSelectDutyTypesWithUsers } from "./FormSelectDutyTypesWithUsers";

type Props = {};
export const DutyFormCreate: React.FC<Props> = ({}) => {
  const { salaryCoefficientTypes } = useFetchSalaryCoefTypes();
  const { useFormReturn } = useDutyFormCreateProvider();
  const { onCreate } = useCreateNewForm();

  const isDateDirty = useController({
    control: useFormReturn?.control,
    name: "date",
  }).fieldState.isDirty;

  const salaryCoefTypeOpts = salaryCoefficientTypes.map(
    ({ id, name, coefficient }) => ({
      value: id,
      label: `${name} (x${coefficient.toFixed(2)})`,
    })
  );

  const onSubmit = useCallback(async (values: TDutyFormCreateFormField) => {
    try {
      const requiredValues = pickProperties(values, [
        "date",
        "startTime",
        "endTime",
        "salaryCoefficientTypeId",
        "dutyTypes",
        "note",
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
    <SafeAreaView>
      <KeyboardAwareScrollView>
        <View style={styles.container}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <FormPickDate
              useControllerProps={{
                control: useFormReturn?.control,
                name: "date",
              }}
              label="Ngày"
              required
              placeholder="Chọn ngày..."
            />
            <View style={styles.timeRangeContainer}>
              <View style={styles.timeRangeItem}>
                <FormPickTime
                  useControllerProps={{
                    control: useFormReturn?.control,
                    name: "startTime",
                  }}
                  label="Giờ bắt đầu"
                  placeholder="Chọn giờ"
                  required
                  leftIcon={
                    <MaterialCommunityIcons
                      name="clock-start"
                      size={18}
                      color={Colors.light.inputIconNone}
                    />
                  }
                  initTime={defaultDutyFormTime().startTime}
                  disabled={!isDateDirty}
                />
              </View>
              <View style={styles.timeRangeItem}>
                <FormPickTime
                  useControllerProps={{
                    control: useFormReturn?.control,
                    name: "endTime",
                  }}
                  label="Giờ kết thúc"
                  placeholder="Chọn giờ"
                  required
                  leftIcon={
                    <MaterialCommunityIcons
                      name="clock-end"
                      size={18}
                      color={Colors.light.inputIconNone}
                    />
                  }
                  initTime={defaultDutyFormTime().endTime}
                  disabled={!isDateDirty}
                />
              </View>
            </View>
            <FormSelectV2
              useControllerProps={{
                control: useFormReturn?.control,
                name: "salaryCoefficientTypeId",
              }}
              options={salaryCoefTypeOpts}
              label="Loại ngoài giờ"
              required
              placeholder="Chọn loại ngoài giờ"
              leftIcon={
                <MaterialIcons
                  name="more-time"
                  size={18}
                  color={Colors.light.inputIconNone}
                />
              }
              disabled={!isDateDirty}
            />

            <FormSelectDutyTypesWithUsers />

            <FormInputMultilne
              formInputProps={{ control: useFormReturn?.control, name: "note" }}
              label="Nội dung công việc"
              placeholder="Nhập nội dung..."
              disabled={!isDateDirty}
              required
              multiline
            />
            <FormUploadImage
              label="Ảnh đính kèm"
              useControllerProps={{
                control: useFormReturn?.control,
                name: "attachFile",
              }}
              disabled={!isDateDirty}
            />
            <View style={styles.actionContainer}>
              <Button
                onPress={useFormReturn?.handleSubmit(onSubmit)}
                mode="contained"
                icon="content-save-all-outline"
                loading={useFormReturn?.formState?.isSubmitting}
                style={styles.buttonContained}
              >
                Lưu
              </Button>
            </View>
          </ScrollView>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

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
