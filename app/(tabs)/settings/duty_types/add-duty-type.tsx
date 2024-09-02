import { FormInput } from "@/components/FormInput";
import { NunitoText } from "@/components/text/NunitoText";
import { useSession } from "@/contexts/ctx";
import { MyToast } from "@/ui/MyToast";
import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { ScrollView, TouchableOpacity, View, StyleSheet } from "react-native";
const LeaveTypeIconLeft = require("@/assets/images/identify-card.png");

type CreateItem = {
  name: string;
};
export default function AddDutyType() {
  const { control, handleSubmit } = useForm<CreateItem>({ defaultValues: { name: "" } });
  const { session } = useSession();
  const router = useRouter();

  const onCreate = async (data: CreateItem) => {
    console.log(data);
  };
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Your scrollable form inputs go here */}
        <FormInput
          formInputProps={{ control: control, name: "name" }}
          label="Tên loại trực"
          required
          placeholder="Nhập tên loại trực..."
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
    height: 40,
    borderRadius: 4,
  },
});
