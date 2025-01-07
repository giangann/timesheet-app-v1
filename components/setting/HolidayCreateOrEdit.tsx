import { THolidayCreate, THolidayCreateFormFields, THolidayDetail, THolidayEdit, THolidayEditFormFields } from "@/api/setting/type";
import { FormInput } from "@/components/FormInput";
import { NunitoText } from "@/components/text/NunitoText";
import { Colors } from "@/constants/Colors";
import { hasNullishValue, pickProperties } from "@/helper/common";
import { useFetchSalaryCoefTypes } from "@/hooks/form";
import { useCreateHoliday, useEditHoliday, useHolidayDetail } from "@/hooks/setting";
import { MyToast } from "@/ui/MyToast";
import { Fontisto, MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import moment from "moment";
import { memo, useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { FormPickDate } from "../FormPickDate";
import { FormSelectV2 } from "../FormSelectV2";

type Props = {
  holidayId?: number;
};

export const HolidayCreateOrEdit: React.FC<Props> = memo(({ holidayId }) => {
  const { control, handleSubmit, setValue } = useForm<THolidayCreateFormFields>({ defaultValues: { name: "" } });
  const { salaryCoefficientTypes } = useFetchSalaryCoefTypes();
  const salaryCoefficientTypeOptions = useMemo(
    () =>
      salaryCoefficientTypes.map((type) => ({
        value: type.id,
        label: type.name,
      })),
    [salaryCoefficientTypes]
  );

  const { onFetchHoliday } = useHolidayDetail();
  const { onCreateHoliday } = useCreateHoliday();
  const { onEditHoliday } = useEditHoliday();

  const onCreate = async (fieldValues: THolidayCreateFormFields) => {
    try {
      const requiredValues = pickProperties(fieldValues, ["name", "date"]);
      if (hasNullishValue(requiredValues)) {
        MyToast.error("Hãy nhập đủ các thông tin yêu cầu");
        return;
      }

      const bodyData: THolidayCreate = {
        name: fieldValues.name ?? "",
        date: moment(fieldValues.date).format("YYYY-MM-DD"),
      };
      if (fieldValues.activeOutsideWorkingTime) bodyData.activeOutsideWorkingTime = fieldValues.activeOutsideWorkingTime;
      if (fieldValues.salaryCoefficientTypeId) bodyData.salaryCoefficientTypeId = fieldValues.salaryCoefficientTypeId;

      onCreateHoliday(bodyData);
    } catch (error: any) {
      MyToast.error(error.message);
    }
  };

  const onEdit = async (fieldValues: THolidayEditFormFields) => {
    try {
      if (!holidayId) throw new Error("Không có holidayId, hãy khởi động lại ứng dụng");

      const requiredValues = pickProperties(fieldValues, ["name"]);
      if (hasNullishValue(requiredValues)) {
        MyToast.error("Hãy nhập đủ các thông tin yêu cầu");
        return;
      }

      const bodyData: THolidayEdit = {
        name: fieldValues.name ?? "",
      };
      if (fieldValues.activeOutsideWorkingTime) bodyData.activeOutsideWorkingTime = fieldValues.activeOutsideWorkingTime;
      if (fieldValues.salaryCoefficientTypeId) bodyData.salaryCoefficientTypeId = fieldValues.salaryCoefficientTypeId;

      onEditHoliday(holidayId, bodyData);
    } catch (error: any) {
      MyToast.error(error.message);
    }
  };

  const onSubmit = useCallback(
    (fieldValues: THolidayEditFormFields | THolidayCreateFormFields) => {
      if (holidayId) {
        onEdit(fieldValues);
      } else {
        onCreate(fieldValues);
      }
    },
    [onCreate, onEdit]
  );

  useFocusEffect(
    useCallback(() => {
      async function fetchDetail() {
        if (holidayId) {
          const holidayDetail: THolidayDetail = await onFetchHoliday(holidayId);

          console.log({ holidayId });
          setValue("name", holidayDetail.name);
          setValue("date", new Date(holidayDetail.date));
          setValue("activeOutsideWorkingTime", holidayDetail.activeOutsideWorkingTime ?? undefined);
          setValue("salaryCoefficientTypeId", holidayDetail.salaryCoefficientTypeId ?? undefined);
        }
      }

      fetchDetail();
    }, [holidayId, onFetchHoliday, setValue])
  );
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Your scrollable form inputs go here */}
        <FormPickDate useControllerProps={{ control: control, name: "date" }} label="Ngày" required placeholder="Chọn ngày..." disabled={Boolean(holidayId)}/>

        <FormInput formInputProps={{ control: control, name: "name" }} label="Tên ngày nghỉ" required placeholder="Nhập tên ngày nghỉ..." />

        {/* <FormSelectV2
          useControllerProps={{ control: control, name: "salaryCoefficientTypeId" }}
          options={salaryCoefficientTypeOptions}
          label="Loại ngoài giờ"
          required
          placeholder="Chọn loại ngoài giờ"
          leftIcon={<MaterialIcons name="more-time" size={18} color={Colors.light.inputIconNone} />}
        />
        <FormSelectV2
          useControllerProps={{ control: control, name: "activeOutsideWorkingTime" }}
          options={[
            { value: false, label: "Không cho phép" },
            { value: true, label: "Cho phép" },
          ]}
          label="Cho phép ngoài giờ"
          required
          placeholder="Chọn cho phép / không cho phép"
          leftIcon={<Fontisto name="checkbox-active" size={18} color={Colors.light.inputIconNone} />}
        /> */}
        {/* Add more FormInput components as needed */}
      </ScrollView>
      <TouchableOpacity activeOpacity={0.8} onPress={handleSubmit(onSubmit)} style={styles.buttonContainer}>
        <View style={styles.button}>
          <NunitoText type="body3" style={{ color: "white" }}>
            {holidayId ? "Cập nhật" : "Tạo mới"}
          </NunitoText>
        </View>
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    backgroundColor: "white",
  },
  scrollContent: {
    padding: 16,
    gap: 20,
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
