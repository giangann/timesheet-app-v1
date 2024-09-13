import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Image, StyleSheet, Platform, Button, ScrollView, SafeAreaView, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useSession } from "@/contexts/ctx";
import { AvatarByRole } from "@/ui/AvatarByRole";
import { NunitoText } from "@/components/text/NunitoText";
import { OPACITY_TO_HEX } from "@/constants/Colors";

const Illustration1 = require("@/assets/images/illu-form-need-approve.png");
const Illustration2 = require("@/assets/images/illu-team-member.png");
const Illustration3 = require("@/assets/images/illu-setting.png");
const Illustration4 = require("@/assets/images/illu-user-info.png");

export default function HomeScreen() {
  const { signOut, userInfo } = useSession();
  return (
    <SafeAreaView>
      <View style={styles.container}>
        {/* HEADER */}
        <View style={styles.homeHeader}>
          <View style={styles.headerContent}>
            <View style={styles.headerContentLeft}>
              <AvatarByRole role={userInfo?.roleCode} customStyles={{ borderColor: "white" }} />
              <View style={styles.welcome}>
                <NunitoText type="body3" lightColor="white">
                  Xin chào !
                </NunitoText>
                <NunitoText type="heading3" lightColor="white">
                  {userInfo?.name}
                </NunitoText>
              </View>
            </View>
            <Ionicons name="notifications" size={24} color="white" />
          </View>
        </View>

        {/* TODAY TIME-KEEPING INFO */}
        <View style={styles._placeholder}>
          <View style={styles._absoluteLayer}>
            <View style={styles.todayInfo}>
              <View style={styles.todayDateBox}>
                <View style={styles.dayOfWeekBox}>
                  <NunitoText lightColor="white">{"Thứ 4"}</NunitoText>
                </View>
                <NunitoText style={{ textAlign: "center" }}>{"11/09"}</NunitoText>
              </View>
              <View style={styles.todayTimeKeepingBox}>
                <NunitoText type="body2">Hôm nay bạn chưa được chấm công</NunitoText>
                <View style={styles.wdTime}>
                  <NunitoText type="body2" style={{ opacity: 0.75 }}>
                    SA: {"08:30"} <NunitoText lightColor="#4277C5">{"---"}</NunitoText>
                  </NunitoText>
                  <NunitoText type="body2" style={{ opacity: 0.75 }}>
                    CH: {"17:30"} <NunitoText lightColor="#4277C5">{"---"}</NunitoText>
                  </NunitoText>
                </View>
              </View>
            </View>
          </View>
        </View>

        <ScrollView>
          {/* QUICK ACTION */}
          {/* QUICK ACTION __ ROW 1 */}
          <View style={styles.quickActionContainer}>
            <View style={[styles.quickActionItemBox, { backgroundColor: "#FFFDE9" }]}>
              <View style={styles.quickActionItemBoxInner}>
                <NunitoText type="subtitle1">Đơn từ</NunitoText>
                <NunitoText type="body3">Đơn cần xử lý</NunitoText>
                <View style={styles.chipCircle}>
                  <NunitoText type="body2" lightColor="white">
                    {"06"}
                  </NunitoText>
                </View>

                <View style={styles.quickActionItemIllu}>
                  <Image source={Illustration1} />
                </View>
              </View>
            </View>
            <View style={[styles.quickActionItemBox, { backgroundColor: "#DFF0FF" }]}>
              <View style={styles.quickActionItemBoxInner}>
                <NunitoText type="subtitle1">Nhân sự</NunitoText>
                <NunitoText type="body3">Quản lý nhân sự</NunitoText>
                <View style={styles.chipCircle}>
                  <MaterialCommunityIcons name="microsoft-teams" size={20} color="white" />
                  <NunitoText type="body2" lightColor="white">
                    {"25"}
                  </NunitoText>
                </View>

                <View style={styles.quickActionItemIllu}>
                  <Image source={Illustration2} />
                </View>
              </View>
            </View>
          </View>
          {/* __placeholder-gap__ */}
          <View style={{ height: 16 }} />
          {/* QUICK ACTION __ ROW 2 */}
          <View style={styles.quickActionContainer}>
            <View style={[styles.quickActionItemBox, { backgroundColor: "#DCFFD7" }]}>
              <View style={styles.quickActionItemBoxInner}>
                <NunitoText type="subtitle1">Cài đặt</NunitoText>
                <NunitoText type="body3">Cài đặt thành viên, cài đặt nghỉ, cài đặt trực... cho Phòng ban</NunitoText>
                <View style={styles.quickActionItemIllu}>
                  <Image source={Illustration3} />
                </View>
              </View>
            </View>

            <View style={[styles.quickActionItemBox, { backgroundColor: "#DFF0FF" }, { opacity: 0 }]}>
              <View style={styles.quickActionItemBoxInner}>
                <NunitoText type="subtitle1">Nhân sự</NunitoText>
                <NunitoText type="body3">Quản lý nhân sự</NunitoText>
                <View style={styles.chipCircle}>
                  <MaterialCommunityIcons name="microsoft-teams" size={20} color="white" />
                  <NunitoText type="body2" lightColor="white">
                    {"25"}
                  </NunitoText>
                </View>

                <View style={styles.quickActionItemIllu}>
                  <Image source={Illustration1} />
                </View>
              </View>
            </View>
          </View>

          {/* USER INFORMATION BRIEF */}
          <View style={[styles.quickActionItemBox, { backgroundColor: "#DFF0FF" }]}>
            <View style={styles.quickActionItemBoxInner}>
              <NunitoText type="subtitle1">Nhân sự</NunitoText>
              <NunitoText type="body3">Quản lý nhân sự</NunitoText>
              <View style={styles.chipCircle}>
                <MaterialCommunityIcons name="microsoft-teams" size={20} color="white" />
                <NunitoText type="body2" lightColor="white">
                  {"25"}
                </NunitoText>
              </View>

              <View style={styles.quickActionItemIllu}>
                <Image source={Illustration1} />
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {},
  // header
  homeHeader: {
    backgroundColor: "#0B3A82",
    paddingHorizontal: 16,
    paddingTop: 32,
    paddingBottom: 48,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  headerContentLeft: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    gap: 8,
  },
  welcome: {},

  // _placeholder and _absolute layer
  _placeholder: {
    height: 80,
    width: "100%",
    position: "relative",

    // borderBottomWidth: 1,
    borderBottomColor: "black",
  },
  _absoluteLayer: {
    width: "100%",
    alignItems: "center",
    position: "absolute",
    top: -20,
    paddingHorizontal: 16,
  },
  //

  // today info
  todayInfo: {
    width: "100%",
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: `#000000${OPACITY_TO_HEX["15"]}`,
    borderRadius: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
  },
  todayDateBox: {
    borderWidth: 1,
    borderColor: `#000000${OPACITY_TO_HEX["25"]}`,
    borderRadius: 6,
    padding: 4,
    gap: 4,
  },
  dayOfWeekBox: {
    backgroundColor: "#077D4E",
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  todayTimeKeepingBox: {},
  wdTime: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 28,
  },

  // quick action
  quickActionContainer: {
    paddingHorizontal: 16,
    gap: 16,
    flexDirection: "row",
  },
  quickActionItemBox: {
    height: 180,
    backgroundColor: "white",
    padding: 12,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: `#000000${OPACITY_TO_HEX["25"]}`,

    flexGrow: 1,
    flexBasis: 1,
  },
  quickActionItemBoxInner: {
    position: "relative",
    width: "100%",
    height: "100%",
    gap: 4,
  },
  quickActionItemIllu: {
    position: "absolute",
    bottom: 0,
    right: 0,
  },
  chipCircle: {
    backgroundColor: "#0947BD",
    borderRadius: 15,
    paddingHorizontal: 8,
    paddingVertical: 6,
    alignSelf: "flex-start",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
  },
});
