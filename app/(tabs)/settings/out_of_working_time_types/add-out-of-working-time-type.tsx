import { FormInput } from "@/components/FormInput";
import { useForm } from "react-hook-form";
import { Image, Text, TouchableOpacity, View } from "react-native";
import Toast from "react-native-root-toast";
const LeaveTypeIconLeft = require("@/assets/images/identify-card.png");

type CreateItem = {
  name: string;
  day: string;
  date: string | Date;
};

export default function AddOutOfWorkingTimeType() {
  const { control, handleSubmit, setError } = useForm<CreateItem>({ defaultValues: { name: "", date: new Date("2024-08-21") } });

  const onCreate = async (data: CreateItem) => {
    console.log("data", data);
    console.log(data.date.toLocaleString());

    const toastEl = (
      <>
        <Image style={{ backgroundColor: "white" }} source={LeaveTypeIconLeft} />
        <Text>heeloo</Text>
      </>
    );

    // @ts-ignore
    Toast.show(toastEl, { shadow: false, backgroundColor: "green" });

    setError("name", { message: "This field is required" });
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
