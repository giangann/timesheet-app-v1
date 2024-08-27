import { FormInput } from "@/components/FormInput";
import { useSession } from "@/contexts/ctx";
import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { Image, Text, TouchableOpacity, View } from "react-native";
import Toast, { ToastOptions } from "react-native-root-toast";
const LeaveTypeIconLeft = require("@/assets/images/identify-card.png");

type CreateItem = {
  name: string;
};

export default function AddOutOfWorkingTimeType() {
  const { control, handleSubmit, setError } = useForm<CreateItem>({ defaultValues: { name: "" } });
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
    <View style={{ padding: 16 }}>
      <FormInput
        formInputProps={{ control: control, name: "name" }}
        label="Tên loại nghỉ"
        required
        placeholder="Nhập tên loại nghỉ..."
        leftIconImage={LeaveTypeIconLeft}
        rightIconImage={LeaveTypeIconLeft}
      />

      <TouchableOpacity activeOpacity={0.8} onPress={handleSubmit(onCreate)}>
        <View style={{ justifyContent: "center", alignItems: "center", backgroundColor: "#0B3A82", height: 40, width: "100%", borderRadius: 4 }}>
          <Text style={{ fontFamily: "Nunito", color: "white", fontWeight: 600, fontSize: 14 }}>Tạo</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}
