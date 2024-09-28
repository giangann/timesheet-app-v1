import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { NunitoText } from "@/components/text/NunitoText";
import { OPACITY_TO_HEX } from "@/constants/Colors";
import { UNIT_DIMENSION } from "@/constants/Misc";
import { useRouter } from "expo-router";
import { Pressable, View, StyleSheet, ScrollView, Image } from "react-native";

export default function ApproveForm() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.listBox}>
        <Pressable onPress={() => router.push("/approve-forms/leave_forms")}>
          <View style={styles.itemBox}>
            <View style={styles.itemBoxLeft}>
              <View style={styles.iconBox}>
                <MaterialIcons name="free-cancellation" size={20} color={`#FFFFFF${OPACITY_TO_HEX["85"]}`} />
              </View>
              <NunitoText type="body1">Phê duyệt - Đơn xin nghỉ</NunitoText>
            </View>
            <View style={styles.chip}>
              <Entypo name="chevron-right" size={14} color={`#FFFFFF${OPACITY_TO_HEX["85"]}`} />
            </View>
          </View>
        </Pressable>

        <Pressable onPress={() => router.push("/approve-forms/overtime_forms")}>
          <View style={styles.itemBox}>
            <View style={styles.itemBoxLeft}>
              <View style={styles.iconBox}>
                <FontAwesome6 name="clock-rotate-left" size={16} color={`#FFFFFF${OPACITY_TO_HEX["85"]}`} />
              </View>
              <NunitoText type="body1">Phê duyệt - Đơn tăng ca</NunitoText>
            </View>
            <View style={styles.chip}>
              <Entypo name="chevron-right" size={14} color={`#FFFFFF${OPACITY_TO_HEX["85"]}`} />
            </View>
          </View>
        </Pressable>

        <Pressable onPress={() => router.push("/approve-forms/duty_forms")}>
          <View style={styles.itemBox}>
            <View style={styles.itemBoxLeft}>
              <View style={styles.iconBox}>
                <MaterialIcons name="schedule" size={20} color={`#FFFFFF${OPACITY_TO_HEX["85"]}`} />
              </View>
              <NunitoText type="body1">Phê duyệt - Đơn trực</NunitoText>
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
    width: 36,
    height: 36,
    backgroundColor: `#0B3A82`,
    borderRadius: 8 * UNIT_DIMENSION,
    justifyContent: "center",
    alignItems: "center",
  },
  chip: {
    width: 26,
    height: 26,
    borderRadius: 16 * UNIT_DIMENSION,
    backgroundColor: `#0B3A82`,
    justifyContent: "center",
    alignItems: "center",
  },
});
