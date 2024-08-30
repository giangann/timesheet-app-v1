import { FormInput } from "@/components/FormInput";
import { FormPickDate } from "@/components/FormPickDate";
import { FormSelect } from "@/components/FormSelect";
import { ThemedText } from "@/components/ThemedText";
import { NunitoText } from "@/components/text/NunitoText";
import moment from "moment";
import { useForm } from "react-hook-form";
import { ScrollView, Image, Text, TouchableOpacity, View, StyleSheet } from "react-native";
const LeaveTypeIconLeft = require("@/assets/images/identify-card.png");

type CreateItemForm = {
  name: string;
  date: string | Date; // YYYY-MM-DD
  salaryCoefficientTypeId: number;
  activeOutsideWorkingTime: boolean;
};
type CreateItem = {
  name: string;
  date: string; // YYYY-MM-DD
  salaryCoefficientTypeId: number;
  activeOutsideWorkingTime: boolean;
};
export default function CreateHoliday() {
  const { control, handleSubmit } = useForm<CreateItemForm>({ defaultValues: { name: "", date: new Date() } });

  const onCreate = async (data: CreateItemForm) => {
    const bodyData = { ...data, date: moment(data.date).format("YYYY-MM-DD") };
    console.log("data form", bodyData);
  };
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Your scrollable form inputs go here */}
        <FormPickDate
          useControllerProps={{ control: control, name: "date" }}
          label="Ngày"
          required
          placeholder="Nhập tên ngày nghỉ..."
          leftIconImage={LeaveTypeIconLeft}
          // rightIconImage={LeaveTypeIconLeft}
        />

        {/* Add more FormInput components as needed */}
        <FormInput
          formInputProps={{ control: control, name: "name" }}
          label="Tên ngày nghỉ"
          required
          placeholder="Nhập tên ngày nghỉ..."
          leftIconImage={LeaveTypeIconLeft}
          rightIconImage={LeaveTypeIconLeft}
        />

        <FormSelect
          useControllerProps={{ control: control, name: "salaryCoefficientTypeId" }}
          options={options}
          label="Loại ngoài giờ"
          required
          placeholder="Chọn loại ngoài giờ"
        />
      </ScrollView>
      <TouchableOpacity activeOpacity={0.8} onPress={handleSubmit(onCreate)} style={styles.buttonContainer}>
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
    height: 48,
    borderRadius: 4,
  },
});

type TOption = {
  value: any;
  label: string;
} & Record<string, unknown>;
const options: TOption[] = [
  {
    value: 2,
    label: "Làm ngoài giờ ngày cuối tuần",
    sallaryCoefId: 1,
  },
  {
    value: 3,
    label: "Làm ngoài giờ ngày lễ",
    sallaryCoefId: 2,
  },
];
