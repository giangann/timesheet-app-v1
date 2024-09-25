import { fetchHomeData } from "@/api/user";
import { THomeData } from "@/api/user/types";
import { NunitoText } from "@/components/text/NunitoText";
import { OPACITY_TO_HEX } from "@/constants/Colors";
import { ROLE_CODE } from "@/constants/Misc";
import { useSession } from "@/contexts/ctx";
import { formatNumberAddLeadingZero } from "@/helper/common";
import { convertTimeToHHMM, getDayOfWeekNameInVietnamese } from "@/helper/date";
import { AvatarByRole } from "@/ui/AvatarByRole";
import { MyToast } from "@/ui/MyToast";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Foundation from "@expo/vector-icons/Foundation";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useFocusEffect, useRouter } from "expo-router";
import moment from "moment";
import { useCallback, useState } from "react";
import { Image, Pressable, SafeAreaView, ScrollView, StyleSheet, View } from "react-native";

const Illustration1 = require("@/assets/images/illu-my-form.png");
const Illustration2 = require("@/assets/images/illu-timesheet.png");
const Illustration3 = require("@/assets/images/illu-setting.png");
const Illustration4 = require("@/assets/images/illu-timekeeping.png");
const Illustration5 = require("@/assets/images/illu-form-need-approve.png");
const Illustration6 = require("@/assets/images/illu-user-info.png");

export default function HomeScreen() {
  const { userInfo, session } = useSession();
  const [homeData, setHomeData] = useState<THomeData | null>(null);
  const router = useRouter();

  const goToMyProfileScreen = () => router.navigate("/profile/my-profile");
  const goToMyFormsScreen = () => router.navigate("/(tabs)/form");
  const goToMyTimesheetScreen = () => router.navigate("/(tabs)/timesheet");
  const goToSettingScreen = () => router.navigate("/(tabs)/setting");
  const goToTimeKeepingScreen = () => router.navigate("/(tabs)/timeKeeping");
  const goToApproveFormsScreen = () => router.navigate("/(tabs)/approveForm");
  const goToNotiScreen = () => router.navigate("/notification/noti");

  const onFetchHomeData = async () => {
    try {
      const responseJson = await fetchHomeData(session ?? "");

      if (responseJson.statusCode === 200) {
        setHomeData(responseJson.data.profile);
      } else MyToast.error(responseJson.error);
    } catch (error: any) {
      MyToast.error(error?.message);
    }
  };

  useFocusEffect(
    useCallback(() => {
      onFetchHomeData();
    }, [])
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* HEADER */}
        <View style={styles.homeHeader}>
          <View style={styles.headerContent}>
            <View style={styles.headerContentLeft}>
              <Pressable onPress={goToMyProfileScreen}>
                <AvatarByRole role={userInfo?.roleCode} customStyles={{ borderColor: "white" }} />
              </Pressable>
              <View style={styles.welcome}>
                <NunitoText type="body3" lightColor="white" darkColor="white">
                  Xin chào !
                </NunitoText>
                <NunitoText type="heading3" lightColor="white" darkColor="white">
                  {userInfo?.name}
                </NunitoText>
              </View>
            </View>
            <Pressable onPress={goToNotiScreen}>
              <View style={styles.notiBox}>
                <Ionicons name="notifications" size={24} color="white" />
                {homeData?.numberOfUnreadFormNotify && <View style={styles.notiBadge} />}
              </View>
            </Pressable>
          </View>
        </View>

        {/* TODAY TIME-KEEPING INFO */}
        <View style={styles._placeholder}>
          <View style={styles._absoluteLayer}>
            <View style={styles.todayInfo}>
              <View style={styles.todayDateBox}>
                <View style={styles.dayOfWeekBox}>
                  <NunitoText lightColor="white" darkColor="white">
                    {getDayOfWeekNameInVietnamese(moment(Date.now()).format("YYYY-MM-DD"))}
                  </NunitoText>
                </View>
                <NunitoText style={{ textAlign: "center" }}>{moment(Date.now()).format("DD/MM")}</NunitoText>
              </View>
              <View style={styles.todayTimeKeepingBox}>
                <NunitoText type="body2">{homeData?.haveTimeKeepingToday ? "Đã được chấm công" : "Chưa được chấm công"}</NunitoText>
                <View style={styles.wdTime}>
                  <NunitoText type="body2" style={{ opacity: 0.75 }}>
                    SA: {convertTimeToHHMM(homeData?.workingDayStartTime) ?? "08:30"} <NunitoText lightColor="#4277C5">{"---"}</NunitoText>
                  </NunitoText>
                  <NunitoText type="body2" style={{ opacity: 0.75 }}>
                    CH: {convertTimeToHHMM(homeData?.workingDayEndTime) ?? "17:30"} <NunitoText lightColor="#4277C5">{"---"}</NunitoText>
                  </NunitoText>
                </View>
              </View>
            </View>
          </View>
        </View>

        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
          {/* QUICK ACTION __ ROW 1: Common (MyForm, MyTimeSheet) */}
          <View style={styles.quickActionContainer}>
            <View style={[styles.quickActionItemBox, { backgroundColor: "#FFFDE9" }]}>
              <Pressable onPress={goToMyFormsScreen}>
                <View style={styles.quickActionItemBoxInner}>
                  <NunitoText type="subtitle1">Đơn của tôi</NunitoText>
                  {homeData?.numberOfUnreadFormNotify && (
                    <>
                      <NunitoText type="body3">Đơn từ mới được phê duyệt </NunitoText>
                      <View style={styles.chipCircle}>
                        <NunitoText type="body2" lightColor="white" darkColor="white">
                          {formatNumberAddLeadingZero(homeData?.numberOfUnreadFormNotify) ?? "00"}
                        </NunitoText>
                      </View>
                    </>
                  )}
                  {!homeData?.numberOfUnreadFormNotify && (
                    <>
                      <NunitoText type="body3">Không có đơn từ mới được phê duyệt </NunitoText>
                    </>
                  )}

                  <View style={styles.quickActionItemIllu}>
                    <Image source={Illustration1} />
                  </View>
                </View>
              </Pressable>
            </View>

            <View style={[styles.quickActionItemBox, { backgroundColor: "#DFF0FF" }]}>
              <Pressable onPress={goToMyTimesheetScreen}>
                <View style={styles.quickActionItemBoxInner}>
                  <NunitoText type="subtitle1">Chấm công tháng</NunitoText>
                  <NunitoText type="body3">Số công hiện tại tháng này:</NunitoText>
                  <View style={styles.chipCircle}>
                    <NunitoText type="body2" lightColor="white" darkColor="white">
                      {formatNumberAddLeadingZero(homeData?.numberOfCurrentMonthTimeKeeping) ?? "00"}
                    </NunitoText>
                  </View>

                  <View style={styles.quickActionItemIllu}>
                    <Image source={Illustration2} />
                  </View>
                </View>
              </Pressable>
            </View>
          </View>

          {/* QUICK ACTION __ ROW 2: Archivist (Setting, TimeKeeping) */}
          {userInfo?.roleCode === ROLE_CODE.ARCHIVIST && (
            <>
              <View style={{ height: 16 }} />
              <View style={styles.quickActionContainer}>
                <View style={[styles.quickActionItemBox, { backgroundColor: "#DCFFD7" }]}>
                  <Pressable onPress={goToSettingScreen}>
                    <View style={styles.quickActionItemBoxInner}>
                      <NunitoText type="subtitle1">Cài đặt</NunitoText>
                      <NunitoText type="body3">Cài đặt thành viên, cài đặt nghỉ, cài đặt trực... cho Phòng ban</NunitoText>
                      <View style={styles.quickActionItemIllu}>
                        <Image source={Illustration3} />
                      </View>
                    </View>
                  </Pressable>
                </View>

                <View style={[styles.quickActionItemBox, { backgroundColor: "#FEF2F8" }]}>
                  <Pressable onPress={goToTimeKeepingScreen}>
                    <View style={styles.quickActionItemBoxInner}>
                      <NunitoText type="subtitle1">Chấm công ngày</NunitoText>
                      <NunitoText type="body3">
                        {homeData?.haveTimeKeepingForTeamToday
                          ? "Chấm công cho các thành viên trong phòng ban"
                          : "Chấm công cho các thành viên trong phòng ban"}
                      </NunitoText>
                      <View style={styles.quickActionItemIllu}>
                        <Image source={Illustration4} />
                      </View>
                    </View>
                  </Pressable>
                </View>
              </View>
            </>
          )}

          {/* QUICK ACTION __ ROW 3: Director (ApproveForm) */}
          {(userInfo?.roleCode === ROLE_CODE.TEAM_DIRECTOR || userInfo?.roleCode === ROLE_CODE.DEPARTMENT_DIRECTOR) && (
            <>
              <View style={{ height: 16 }} />
              <View style={styles.quickActionContainer}>
                <View style={[styles.quickActionItemBox, { backgroundColor: "#FEF2F8" }]}>
                  <Pressable onPress={goToApproveFormsScreen}>
                    <View style={styles.quickActionItemBoxInner}>
                      <NunitoText type="subtitle1">Đơn từ</NunitoText>
                      <NunitoText type="body3">Đơn cần xử lý</NunitoText>
                      <View style={styles.chipCircle}>
                        <NunitoText type="body2" lightColor="white" darkColor="white">
                          {formatNumberAddLeadingZero(homeData?.numberOfFormNeedApprove) ?? "00"}
                        </NunitoText>
                      </View>

                      <View style={styles.quickActionItemIllu}>
                        <Image source={Illustration5} />
                      </View>
                    </View>
                  </Pressable>
                </View>

                {/* __placholder_item__ */}
                <View style={[styles.quickActionItemBox, { opacity: 0 }]} />

                {/* QUICK ACTION __ ROW 3.2: Prepare for future features */}
                {/* <View style={[styles.quickActionItemBox, { backgroundColor: "#DFF0FF" }]}>
              <Pressable
                onPress={() => {
                  router.navigate("/");
                }}
              >
                <View style={styles.quickActionItemBoxInner}>
                <NunitoText type="subtitle1">Nhân sự</NunitoText>
                  <NunitoText type="body3">Quản lý nhân sự</NunitoText>
                  <View style={styles.chipCircle}>
                    <MaterialCommunityIcons name="microsoft-teams" size={20} color="white" />
                    <NunitoText type="body2" lightColor="white" darkColor="white">
                      {"25"}
                    </NunitoText>
                    </View>

                  <View style={styles.quickActionItemIllu}>
                  <Image source={Illustration2} />
                  </View>
                  </View>
                  </Pressable>
            </View> */}
              </View>
            </>
          )}

          {/* USER INFORMATION BRIEF */}
          <View style={{ height: 32 }} />
          <View style={styles.userInfoContainer}>
            <NunitoText>Thông tin của tôi</NunitoText>
            <View style={styles.userInfoBox}>
              <View style={styles.userInfoBoxInner}>
                <View style={styles.userInfoField}>
                  <View style={styles.userInfoFieldIconBox}>
                    <FontAwesome5 name="id-card-alt" size={16} color={`#000000${OPACITY_TO_HEX["75"]}`} />
                  </View>
                  <NunitoText type="body3">{userInfo?.name}</NunitoText>
                </View>
                <View style={styles.userInfoField}>
                  <View style={styles.userInfoFieldIconBox}>
                    <Foundation name="torso-business" size={24} color={`#000000${OPACITY_TO_HEX["75"]}`} />
                  </View>
                  <NunitoText type="body3">{userInfo?.roleName}</NunitoText>
                </View>
                <View style={styles.userInfoField}>
                  <View style={styles.userInfoFieldIconBox}>
                    <FontAwesome name="volume-control-phone" size={24} color={`#000000${OPACITY_TO_HEX["75"]}`} />
                  </View>
                  <NunitoText type="body3">{userInfo?.phone}</NunitoText>
                </View>
                <View style={styles.userInfoField}>
                  <View style={styles.userInfoFieldIconBox}>
                    <MaterialIcons name="email" size={20} color={`#000000${OPACITY_TO_HEX["75"]}`} />
                  </View>
                  <NunitoText type="body3">{userInfo?.email}</NunitoText>
                </View>
                <View style={styles.userInfoIllu}>
                  <Image source={Illustration6} />
                </View>
                <View style={styles._absoluteTopRightLayer}>
                  <Pressable onPress={goToMyProfileScreen}>
                    <View style={styles.userInfoGotoProfileScreen}>
                      <NunitoText type="body2">Chi tiết</NunitoText>
                      <Ionicons name="arrow-forward" size={16} />
                    </View>
                  </Pressable>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1, // Add flex to fill the screen
  },
  container: {
    flex: 1, // Ensure the container also takes up full available space
  },
  scrollView: {
    flex: 1, // Make sure ScrollView also expands to fill space
  },
  scrollViewContent: {
    paddingBottom: 100, // Adjust this value based on the height of your tab bar
  },
  // container: {},
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
  notiBox: {
    position: "relative",
  },
  notiBadge: {
    position: "absolute",
    top: 0,
    right: 0,

    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#C84851",
  },
  welcome: {},

  // _placeholder and _absolute layer
  _placeholder: {
    height: 80,
    width: "100%",
    position: "relative",
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
    justifyContent: "flex-start",
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
  todayTimeKeepingBox: {
    flexShrink: 1,
    width: "100%",
  },
  wdTime: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
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

  // user information
  userInfoContainer: {
    paddingHorizontal: 16,
    gap: 6,
  },
  userInfoBox: {
    height: 180,
    backgroundColor: "white",
    padding: 12,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: `#000000${OPACITY_TO_HEX["25"]}`,
  },
  userInfoBoxInner: {
    position: "relative",
    width: "100%",
    height: "100%",
    gap: 4,
  },
  //
  _absoluteTopRightLayer: {
    position: "absolute",
    top: 0,
    right: 0,
  },
  //
  userInfoGotoProfileScreen: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  userInfoIllu: {
    position: "absolute",
    bottom: 0,
    right: 0,
  },
  userInfoField: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-end",
    gap: 8,
  },
  userInfoFieldIconBox: {
    width: 24,
  },
});
