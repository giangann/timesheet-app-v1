import { FormInput } from "@/components/FormInput";
import { FormPickDate } from "@/components/FormPickDate";
import { FormPickDateTime } from "@/components/FormPickDateTime";
import { FormPickTime } from "@/components/FormPickTime";
import { NunitoText } from "@/components/text/NunitoText";
import { useSession } from "@/contexts/ctx";
import { useRouter } from "expo-router";
import moment from "moment";
import { useForm } from "react-hook-form";
import { ScrollView, Image, Text, TouchableOpacity, View, StyleSheet } from "react-native";
import Toast, { ToastOptions } from "react-native-root-toast";

const LeaveTypeIconLeft = require("@/assets/images/identify-card.png");
type CreateItem = {
  startDate: string | Date;
  dateOnly: string;
  startTime: string;
  endTime: string;
};
type CreateItemForm = {
  startDate: string | Date;
  dateOnly: string | Date;
  startTime: string | Date;
  endTime: string | Date;
};
export default function CreateLeaveForm() {
  const { control, handleSubmit } = useForm<CreateItemForm>({
    defaultValues: { startDate: undefined, dateOnly: undefined, startTime: undefined, endTime: undefined },
  });

  const onCreate = async (value: CreateItemForm) => {
    const bodyData: CreateItem = {
      ...value,
      dateOnly: moment(value.startDate).format("YYYY-MM-DD"),
      startTime: moment(value.startTime).format("HH:mm:ss"),
      endTime: moment(value.endTime).format("HH:mm:ss"),
    };
    console.log(bodyData);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <FormPickDateTime
          useControllerProps={{ control: control, name: "startDate" }}
          leftIconImage={LeaveTypeIconLeft}
          label="Ngày giờ bắt đầu"
          required
          placeholder="Chọn ngày và giờ"
        />
        <FormPickDate
          useControllerProps={{ control: control, name: "dateOnly" }}
          leftIconImage={LeaveTypeIconLeft}
          label="Ngày"
          required
          placeholder="Chọn ngày"
        />
        <View style={{ flexDirection: "row", gap: 10 }}>
          <View style={{ flexGrow: 1 }}>
            <FormPickTime
              useControllerProps={{ control: control, name: "startTime" }}
              leftIconImage={LeaveTypeIconLeft}
              label="Giờ bắt đầu"
              required
              placeholder="Chọn giờ"
            />
          </View>
          <View style={{ flexGrow: 1 }}>
            <FormPickTime
              useControllerProps={{ control: control, name: "endTime" }}
              leftIconImage={LeaveTypeIconLeft}
              label="Giờ kết thúc"
              required
              placeholder="Chọn giờ"
            />
          </View>
        </View>
      </ScrollView>
      <TouchableOpacity onPress={handleSubmit(onCreate)} activeOpacity={0.8} style={styles.buttonContainer}>
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
    gap: 20,
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
    height: 40,
    borderRadius: 4,
  },
});
