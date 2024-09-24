import { NunitoText } from "@/components/text/NunitoText";
import { StyleSheet, View } from "react-native";
export default function Noti() {
  return (
    <View style={styles.container}>
      <NunitoText>NOTI SCREEN</NunitoText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 32,
  },
});
