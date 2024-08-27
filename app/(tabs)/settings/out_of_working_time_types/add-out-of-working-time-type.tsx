import { BaseInput } from "@/components/BaseInput";
import { ThemedText } from "@/components/ThemedText";
import { Controller, useForm, useController } from "react-hook-form";
import { Button, Image, Text, TouchableOpacity, View } from "react-native";
import Toast from "react-native-root-toast";
const LeaveTypeIconLeft = require("@/assets/images/identify-card.png");

type CreateItem = {
  name: string;
};

export default function AddOutOfWorkingTimeType() {
  const { control, getValues, handleSubmit } = useForm<CreateItem>({ defaultValues: { name: "" } });
  const { field } = useController({ name: "name", control: control });

  const onCreate = async (data: CreateItem) => {
    console.log("call post api");

    const values = getValues();

    console.log("data", data);

    console.log("values", values);

    const toastEl = (
      <>
        <Image style={{ backgroundColor: "white" }} source={LeaveTypeIconLeft} />
        <Text>heeloo</Text>
      </>
    );

    // @ts-ignore
    Toast.show(toastEl, { shadow: false, backgroundColor: "green" });
  };

  return (
    <View>
      <ThemedText type="title">Tạo loại ngoài giờ</ThemedText>
      {/* <Controller
        control={control}
        name="name"
        render={({ field: { onChange, onBlur, value } }) => (
          <BaseInput
            placeholder="Nhập tên loại nghỉ..."
            leftIconImage={LeaveTypeIconLeft}
            rightIconImage={LeaveTypeIconLeft}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
          />
        )}
      /> */}
      <BaseInput
        placeholder="Nhập tên loại nghỉ..."
        leftIconImage={LeaveTypeIconLeft}
        rightIconImage={LeaveTypeIconLeft}
        value={field.value}
        onChangeText={field.onChange}
      />
      <TouchableOpacity activeOpacity={0.8} onPress={handleSubmit(onCreate)}>
        <View style={{ justifyContent: "center", alignItems: "center", backgroundColor: "#0B3A82", height: 40, width: "100%", borderRadius: 4 }}>
          <Text style={{ fontFamily: "Nunito", color: "white", fontWeight: 600, fontSize: 14 }}>Tạo</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}
