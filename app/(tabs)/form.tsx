import { NunitoText } from "@/components/text/NunitoText";
import { OPACITY_TO_HEX } from "@/constants/Colors";
import { UNIT_DIMENSION } from "@/constants/Misc";
import { useRouter } from "expo-router";
import { Pressable, View, StyleSheet, ScrollView, Image } from "react-native";
const SettingTeamIconImage = require("@/assets/images/setting-team.png");
const SettingOvertimeTypeIconImage = require("@/assets/images/setting-overtimetype.png");
const SettingLeaveTypeIconImage = require("@/assets/images/setting-leavetype.png");
const SettingWorkingDayIconImage = require("@/assets/images/setting-workingday.png");
const SettingHolidayIconImage = require("@/assets/images/setting-holiday.png");
const GotoDetailIconImage = require("@/assets/images/gotodetail.png");

export default function Settings() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.listBox}>
        <Pressable onPress={() => router.push("/forms/leave_forms")}>
          <View style={styles.itemBox}>
            <View style={styles.itemBoxLeft}>
              <View style={styles.iconBox}>
                <Image source={SettingTeamIconImage} />
              </View>
              <NunitoText type="body1">Đơn xin nghỉ</NunitoText>
            </View>
            <View style={styles.chip}>
              <Image source={GotoDetailIconImage} />
            </View>
          </View>
        </Pressable>

        <Pressable onPress={() => router.push("/forms/overtime_forms")}>
          <View style={styles.itemBox}>
            <View style={styles.itemBoxLeft}>
              <View style={styles.iconBox}>
                <Image source={SettingOvertimeTypeIconImage} />
              </View>
              <NunitoText type="body1">Đơn tăng ca</NunitoText>
            </View>
            <View style={styles.chip}>
              <Image source={GotoDetailIconImage} />
            </View>
          </View>
        </Pressable>

        <Pressable onPress={() => router.push("/forms/duty_forms")}>
          <View style={styles.itemBox}>
            <View style={styles.itemBoxLeft}>
              <View style={styles.iconBox}>
                <Image source={SettingLeaveTypeIconImage} />
              </View>
              <NunitoText type="body1">Đơn trực</NunitoText>
            </View>
            <View style={styles.chip}>
              <Image source={GotoDetailIconImage} />
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
