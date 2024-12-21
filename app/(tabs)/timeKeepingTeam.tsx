import { NunitoText } from "@/components/text/NunitoText";
import { OPACITY_TO_HEX } from "@/constants/Colors";
import { UNIT_DIMENSION } from "@/constants/Misc";
import Entypo from "@expo/vector-icons/Entypo";
import Feather from "@expo/vector-icons/Feather";
import { useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";

export default function TimeKeepingTeam() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.listBox}>
        <Pressable onPress={() => router.push("/time-keepings/today-time-keeping")}>
          <View style={styles.itemBox}>
            <View style={styles.itemBoxLeft}>
              <View style={styles.iconBox}>
                <Feather name="check-circle" size={20} color={`#FFFFFF${OPACITY_TO_HEX["85"]}`} />
              </View>
              <NunitoText type="body1">Chấm công đơn vị hôm nay</NunitoText>
            </View>
            <View style={styles.chip}>
              <Entypo name="chevron-right" size={14} color={`#FFFFFF${OPACITY_TO_HEX["85"]}`} />
            </View>
          </View>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 0,
    backgroundColor: "white",
    minHeight: "100%",
  },
  listBox: {
    paddingBottom: 16,
    gap: 20 * UNIT_DIMENSION,
  },
  itemBox: {
    backgroundColor: `#0B3A82${OPACITY_TO_HEX["15"]}`,
    paddingHorizontal: 16 * UNIT_DIMENSION,
    paddingVertical: 12 * UNIT_DIMENSION,
    borderRadius: 8 * UNIT_DIMENSION,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  itemBoxLeft: {
    flexBasis: "60%",
    flexDirection: "row",
    alignItems: "center",
    gap: 12 * UNIT_DIMENSION,
  },
  iconBox: {
    backgroundColor: `#0B3A82`,
    padding: 8 * UNIT_DIMENSION,
    borderRadius: 8 * UNIT_DIMENSION,
  },
  chip: {
    borderRadius: 16 * UNIT_DIMENSION,
    backgroundColor: `#0B3A82`,
    padding: 6 * UNIT_DIMENSION,
  },
});
