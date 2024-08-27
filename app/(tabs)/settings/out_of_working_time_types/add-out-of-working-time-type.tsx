import { FormInput } from "@/components/FormInput";
import { NunitoText } from "@/components/text/NunitoText";
import { useSession } from "@/contexts/ctx";
import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { ScrollView, Image, Text, TouchableOpacity, View, StyleSheet } from "react-native";
import Toast, { ToastOptions } from "react-native-root-toast";

const LeaveTypeIconLeft = require("@/assets/images/identify-card.png");

type CreateItem = {
  name: string;
};

export default function AddOutOfWorkingTimeType() {
  const { control, handleSubmit } = useForm<CreateItem>({ defaultValues: { name: "" } });
  const { session } = useSession();
  const router = useRouter();

  const onCreate = async (data: CreateItem) => {
    const token = `Bearer ${session}` ?? "xxx";

    const baseUrl = "http://13.228.145.165:8080/api/v1";
    const endpoint = "/leave-form-types";
    const url = `${baseUrl}${endpoint}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: token },
      body: JSON.stringify(data),
      credentials: "include",
    });
    const responseJson = await response.json();

    let toastEl: any = null;
    let toastOptions: ToastOptions;
    if (responseJson.statusCode === 200) {
      toastEl = (
        <>
          <Image style={{ backgroundColor: "white" }} source={LeaveTypeIconLeft} />
          <Text>{"create success"}</Text>
        </>
      );
      toastOptions = {
        backgroundColor: "green",
      };

      router.back();
    } else {
      toastEl = (
        <>
          <Image style={{ backgroundColor: "white" }} source={LeaveTypeIconLeft} />
          <Text>{responseJson.error}</Text>
        </>
      );
      toastOptions = {
        backgroundColor: "red",
      };
    }

    // @ts-ignore
    Toast.show(toastEl, toastOptions);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Your scrollable form inputs go here */}
        <FormInput
          formInputProps={{ control: control, name: "name" }}
          label="Tên loại nghỉ"
          required
          placeholder="Nhập tên loại nghỉ..."
          leftIconImage={LeaveTypeIconLeft}
          rightIconImage={LeaveTypeIconLeft}
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
