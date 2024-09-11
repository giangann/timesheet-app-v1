import { NunitoText } from "@/components/text/NunitoText";
import { View, StyleSheet } from "react-native";

export default function TodayTimeKeeping() {
  return (
    <View style={styles.container}>
      <NunitoText>TODAY TIME-KEEPING</NunitoText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
});
