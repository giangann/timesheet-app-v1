import { TExceptionDayCreate } from "@/api/setting/type";
import { FormInput } from "@/components/FormInput";
import { FormPickDate } from "@/components/FormPickDate";
import { NunitoText } from "@/components/text/NunitoText";
import { useSession } from "@/contexts";
import { hasNullishValue } from "@/helper/common";
import { TExceptionDayCreateFormFields } from "@/types";
import { MyToast } from "@/ui/MyToast";
import { useRouter } from "expo-router";
import moment from "moment";
import { useForm } from "react-hook-form";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

export default function AddExceptionDay() {
  const { control, handleSubmit } = useForm<TExceptionDayCreateFormFields>();
  const { session } = useSession();
  const router = useRouter();

  const onCreate = async (data: TExceptionDayCreateFormFields) => {
    const token = `Bearer ${session}`;

    const baseUrl = "https://proven-incredibly-redbird.ngrok-free.app/api/v1";
    const endpoint = "/exception-dates";
    const url = `${baseUrl}${endpoint}`;

    if (hasNullishValue(data)) {
      MyToast.error("Hãy điền đủ thông tin yêu cầu");
      return;
    }
    const requestBody: TExceptionDayCreate = {
      name: data.name ?? "",
      startDate: moment(data.startDate).format("YYYY-MM-DD"),
      endDate: moment(data.endDate).format("YYYY-MM-DD"),
    };
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: token },
      body: JSON.stringify(requestBody),
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
        <FormInput formInputProps={{ control: control, name: "name" }} label="Tên ngày ngoại lệ" required placeholder="Nhập tên loại nghỉ..." />
        {/* Add more FormInput components as needed */}
        <FormPickDate useControllerProps={{ control, name: "startDate" }} label="Ngày bắt đầu" required />
        <FormPickDate useControllerProps={{ control, name: "endDate" }} label="Ngày kết thúc" required />
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
    paddingBottom: 100, // Space at the bottom to prevent overlap with the button
    gap: 20,
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
  formSwitch: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
