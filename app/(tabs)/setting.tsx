import { NunitoText } from "@/components/text/NunitoText";
import { OPACITY_TO_HEX } from "@/constants/Colors";
import { UNIT_DIMENSION } from "@/constants/Misc";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";

export default function Settings() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.listBox}>
        <Pressable onPress={() => router.push("/settings/teams")}>
          <View style={styles.itemBox}>
            <View style={styles.itemBoxLeft}>
              <View style={styles.iconBox}>
                <MaterialIcons name="groups" size={20} color={`#FFFFFF${OPACITY_TO_HEX["85"]}`} />
              </View>
              <NunitoText type="body1">Cài đặt phòng ban</NunitoText>
            </View>
            <View style={styles.chip}>
              <Entypo name="chevron-right" size={14} color={`#FFFFFF${OPACITY_TO_HEX["85"]}`} />
            </View>
          </View>
        </Pressable>

        <Pressable onPress={() => router.push("/settings/out_of_working_time_types")}>
          <View style={styles.itemBox}>
            <View style={styles.itemBoxLeft}>
              <View style={styles.iconBox}>
                <MaterialCommunityIcons name="clipboard-text-clock-outline" size={20} color={`#FFFFFF${OPACITY_TO_HEX["85"]}`} />
              </View>
              <NunitoText type="body1">Cài đặt loại ngoài giờ</NunitoText>
            </View>
            <View style={styles.chip}>
              <Entypo name="chevron-right" size={14} color={`#FFFFFF${OPACITY_TO_HEX["85"]}`} />
            </View>
          </View>
        </Pressable>

        <Pressable onPress={() => router.push("/settings/leave_types")}>
          <View style={styles.itemBox}>
            <View style={styles.itemBoxLeft}>
              <View style={styles.iconBox}>
                <MaterialCommunityIcons name="clipboard-text-off-outline" size={20} color={`#FFFFFF${OPACITY_TO_HEX["85"]}`} />
              </View>
              <NunitoText type="body1">Cài đặt loại nghỉ</NunitoText>
            </View>
            <View style={styles.chip}>
              <Entypo name="chevron-right" size={14} color={`#FFFFFF${OPACITY_TO_HEX["85"]}`} />
            </View>
          </View>
        </Pressable>

        {/* <Pressable onPress={() => router.push("/settings/holidays")}>
          <View style={styles.itemBox}>
            <View style={styles.itemBoxLeft}>
              <View style={styles.iconBox}>
                <MaterialCommunityIcons name="beach" size={20} color={`#FFFFFF${OPACITY_TO_HEX["85"]}`} />
              </View>
              <NunitoText type="body1">Cài đặt ngày nghỉ lễ</NunitoText>
            </View>
            <View style={styles.chip}>
              <Entypo name="chevron-right" size={14} color={`#FFFFFF${OPACITY_TO_HEX["85"]}`} />
            </View>
          </View>
        </Pressable> */}

        <Pressable onPress={() => router.push("/settings/duty_types")}>
          <View style={styles.itemBox}>
            <View style={styles.itemBoxLeft}>
              <View style={styles.iconBox}>
                <MaterialCommunityIcons name="clipboard-text-play-outline" size={20} color={`#FFFFFF${OPACITY_TO_HEX["85"]}`} />
              </View>
              <NunitoText type="body1">Cài đặt loại trực</NunitoText>
            </View>
            <View style={styles.chip}>
              <Entypo name="chevron-right" size={14} color={`#FFFFFF${OPACITY_TO_HEX["85"]}`} />
            </View>
          </View>
        </Pressable>

        <Pressable onPress={() => router.push("/settings/exception_days")}>
          <View style={styles.itemBox}>
            <View style={styles.itemBoxLeft}>
              <View style={styles.iconBox}>
                <MaterialCommunityIcons name="beach" size={20} color={`#FFFFFF${OPACITY_TO_HEX["85"]}`} />
              </View>
              <NunitoText type="body1">Cài đặt ngày ngoại lệ</NunitoText>
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
