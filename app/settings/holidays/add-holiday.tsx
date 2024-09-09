import { FormInput } from "@/components/FormInput";
import { FormPickDate } from "@/components/FormPickDate";
import { FormSelectV2 } from "@/components/FormSelectV2";
import { NunitoText } from "@/components/text/NunitoText";
import { Colors } from "@/constants/Colors";
import { useSession } from "@/contexts/ctx";
import { MyToast } from "@/ui/MyToast";
import Fontisto from "@expo/vector-icons/Fontisto";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useFocusEffect, useRouter } from "expo-router";
import moment from "moment";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

type TSalaryCoefficientType = {
  id: number;
  name: string;
  coefficient: number;
};
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

  const [salaryCoefficientTypes, setSalaryCoefficientTypes] = useState<TSalaryCoefficientType[]>([]);
  const { session } = useSession();
  const router = useRouter();

  const salaryCoefficientTypeOptions = salaryCoefficientTypes.map((type) => ({
    value: type.id,
    label: type.name,
  }));

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

  const onCreate = async (data: CreateItemForm) => {
    const bodyData: CreateItem = { ...data, date: moment(data.date).format("YYYY-MM-DD") };
    console.log("data form", bodyData);

    const token = `Bearer ${session}` ?? "xxx";
    const baseUrl = "http://13.228.145.165:8080/api/v1";
    const endpoint = "/holidays";
    const url = `${baseUrl}${endpoint}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: token },
      body: JSON.stringify(bodyData),
      credentials: "include",
    });
    const responseJson = await response.json();

    if (responseJson.statusCode === 200) {
      MyToast.success("Thành công");
      router.back();
    } else {
      MyToast.error(responseJson.error);
    }
  };
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Your scrollable form inputs go here */}
        <FormPickDate useControllerProps={{ control: control, name: "date" }} label="Ngày" required placeholder="Chọn ngày..." />

        <FormInput formInputProps={{ control: control, name: "name" }} label="Tên ngày nghỉ" required placeholder="Nhập tên ngày nghỉ..." />

        <FormSelectV2
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
        />
        {/* Add more FormInput components as needed */}
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
    height: 44,
    borderRadius: 4,
  },
});
