import { BasicCalendar } from "@/components/my-rn-calendar/BasicCalendar";
// import { BasicWeekCalendar } from "@/components/my-rn-calendar/BasicWeekCalendar";
import { NunitoText } from "@/components/text/NunitoText";
import { View, StyleSheet } from "react-native";

export default function MyTimeSheet() {
  return (
    <View style={styles.container}>
      {/* <NunitoText>My Time Sheet</NunitoText> */}
      <BasicCalendar/>
      {/* <BasicWeekCalendar /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 0,
    paddingBottom: 0,
    height: "100%",
  },
});
