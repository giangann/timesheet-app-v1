import { DownloadExcel } from "@/components/DownloadExcel";
import { NunitoText } from "@/components/text/NunitoText";
import { View, StyleSheet } from "react-native";

export default function TeamOwt() {
  return (
    <View style={styles.container}>
      <NunitoText>Team Outside Working Time Report</NunitoText>

      <DownloadExcel month={9} year={2024} />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
