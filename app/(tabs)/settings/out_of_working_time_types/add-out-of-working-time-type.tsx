import { BaseInput } from "@/components/BaseInput";
import { ThemedText } from "@/components/ThemedText";
import { Image, Text, TouchableOpacity, View } from "react-native";
import Toast from "react-native-root-toast";
const LeaveTypeIconLeft = require("@/assets/images/identify-card.png");

export default function AddOutOfWorkingTimeType() {
  const onCreate = async () => {
    console.log("call post api");

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
      <BaseInput placeholder="Nhập tên loại nghỉ..." leftIconImage={LeaveTypeIconLeft} rightIconImage={LeaveTypeIconLeft} />

      <TouchableOpacity activeOpacity={0.8} onPress={onCreate}>
        <View style={{ justifyContent: "center", alignItems: "center", backgroundColor: "#0B3A82", height: 40, width: "100%", borderRadius: 4 }}>
          <Text style={{ fontFamily: "Nunito", color: "white", fontWeight: 600, fontSize: 14 }}>Tạo</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}
