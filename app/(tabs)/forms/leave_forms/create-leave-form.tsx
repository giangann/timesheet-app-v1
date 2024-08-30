import { FormInput } from "@/components/FormInput";
import { NunitoText } from "@/components/text/NunitoText";
import { useSession } from "@/contexts/ctx";
import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { ScrollView, Image, Text, TouchableOpacity, View, StyleSheet } from "react-native";
import Toast, { ToastOptions } from "react-native-root-toast";

const LeaveTypeIconLeft = require("@/assets/images/identify-card.png");
export default function CreateLeaveForm() {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}></ScrollView>
      <TouchableOpacity activeOpacity={0.8} style={styles.buttonContainer}>
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
