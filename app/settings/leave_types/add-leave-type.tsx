import { FormInput } from "@/components/FormInput";
import { NunitoText } from "@/components/text/NunitoText";
import { useSession } from "@/contexts/ctx";
import { MyToast } from "@/ui/MyToast";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { Switch } from "react-native-paper";

type CreateItem = {
  name: string;
};

export default function AddLeaveType() {
  const { control, handleSubmit } = useForm<CreateItem>({ defaultValues: { name: "" } });
  const { session } = useSession();
  const router = useRouter();

  const [isSwitchOn, setIsSwitchOn] = useState(false);
  const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);

  const onCreate = async (data: CreateItem) => {
    const token = `Bearer ${session}`;

    const baseUrl = "https://chamcong.vptw.dcs.vn/api/api/v1";
    const endpoint = "/leave-form-types";
    const url = `${baseUrl}${endpoint}`;

    const requestBody = {
      ...data,
      // handle isSwitchOn value here
      isDisplayedOnWeekCalendar: isSwitchOn,
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
        <FormInput formInputProps={{ control: control, name: "name" }} label="Tên loại nghỉ" required placeholder="Nhập tên loại nghỉ..." />
        {/* Add more FormInput components as needed */}
        <View style={styles.formSwitch}>
          <NunitoText type="body2" style={{ marginRight: 6 }}>
            Hiển thị lên lịch công tác
          </NunitoText>
          <Switch value={isSwitchOn} onValueChange={onToggleSwitch} />;
        </View>
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
    gap: 4,
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
