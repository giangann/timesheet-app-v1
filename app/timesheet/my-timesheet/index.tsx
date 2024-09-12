import { BasicCalendar } from "@/components/my-rn-calendar/BasicCalendar";
import { NunitoText } from "@/components/text/NunitoText";
import { View, StyleSheet } from "react-native";

export default function MyTimeSheet() {
  return (
    <View style={styles.container}>
      <NunitoText>My Time Sheet</NunitoText>
      <BasicCalendar/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 0,
    height: "100%",
  },
});
