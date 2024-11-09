import { changePassword, fetchUserProfile } from "@/api/user";
import { TChangePassword, TUserProfile } from "@/api/user/types";
import { FormInput } from "@/components/FormInput";
import { MyModal } from "@/components/MyModal";
import { NunitoText } from "@/components/text/NunitoText";
import { Colors, OPACITY_TO_HEX } from "@/constants/Colors";
import { useSession } from "@/contexts/ctx";
import { AvatarByRole } from "@/ui/AvatarByRole";
import { MyToast } from "@/ui/MyToast";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
export default function MyProfile() {
  const [profileData, setProfileData] = useState<TUserProfile | null>(null);
  const [openChangePwModal, setOpenChangePwModal] = useState(false);
  const [openCfLogout, setOpenCfLogout] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const { userInfo, signOut, session } = useSession();
  const router = useRouter();

  const { control, handleSubmit } = useForm<TChangePassword>();

  const onToggleShowPw = () => {
    setShowPw(!showPw);
  };
  const onLogout = () => {
    signOut();
    router.navigate("/auth/login");
  };

  const onChangePw = async (values: TChangePassword) => {
    try {
      const responseJson = await changePassword(session, values);

      if (responseJson.statusCode === 200) {
        MyToast.success("Thành công");
      } else {
        MyToast.error(responseJson.error ?? responseJson.message);
      }
    } catch (error: any) {
      MyToast.error(error.message);
    }
  };

  const onFetchProfileData = async () => {
    try {
      const responseJson = await fetchUserProfile(session ?? "");

      if (responseJson.statusCode === 200) {
        setProfileData(responseJson.data.profile);
      } else MyToast.error(responseJson.error);
    } catch (error: any) {
      MyToast.error(error?.message);
    }
  };

  useFocusEffect(
    useCallback(() => {
      onFetchProfileData();
    }, [session])
  );

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
        {/*  */}
        <View style={styles.userInfoSumary}>
          <AvatarByRole role={userInfo?.roleCode} customStyles={{ borderColor: "#0B3A82" }} />

          <View style={styles.nameAndRole}>
            <NunitoText type="heading3" lightColor="#0B3A82">
              {userInfo?.name}
            </NunitoText>
            <NunitoText type="body3">{userInfo?.roleName}</NunitoText>
          </View>

          <Pressable onPress={() => setOpenCfLogout(true)}>
            <View style={styles.logoutButton}>
              <SimpleLineIcons name="logout" size={18} color="#0B3A82" />
              <NunitoText type="body4" lightColor="#0B3A82">
                Đăng xuất
              </NunitoText>
            </View>
          </Pressable>
        </View>

        {/*  */}
        <View style={styles.listInfoBox}>
          <View style={styles.infoBox}>
            <View style={styles.infoBoxHeader}>
              <NunitoText type="body3" lightColor="white" darkColor="white">
                Thông tin cá nhân
              </NunitoText>
            </View>
            <View style={styles.infoBoxContent}>
              <NunitoText type="body2">Họ và tên: {userInfo?.name}</NunitoText>
              <NunitoText type="body2">Số CCCD: {userInfo?.identifyCard}</NunitoText>
              <NunitoText type="body2">Chức vụ: {userInfo?.roleName}</NunitoText>
              <NunitoText type="body2">Mã chức vụ: {userInfo?.roleCode}</NunitoText>
              <NunitoText type="body2">Địa chỉ: {userInfo?.address}</NunitoText>
            </View>
          </View>

          <View style={styles.infoBox}>
            <View style={styles.infoBoxHeader}>
              <NunitoText type="body3" lightColor="white" darkColor="white">
                Thông tin liên lạc
              </NunitoText>
            </View>
            <View style={styles.infoBoxContent}>
              <NunitoText type="body2">Số điện thoại: {userInfo?.phone}</NunitoText>
              <NunitoText type="body2">Email: {userInfo?.email}</NunitoText>
            </View>
          </View>

          <View style={styles.infoBox}>
            <View style={styles.infoBoxHeader}>
              <NunitoText type="body3" lightColor="white" darkColor="white">
                Thông tin phòng ban
              </NunitoText>
            </View>
            <View style={styles.infoBoxContent}>
              <NunitoText type="body2">Tên phòng ban: {profileData?.teamName ?? "__ __"}</NunitoText>
              <NunitoText type="body2">Hotline phòng ban: {profileData?.teamHotline ?? "__ __"}</NunitoText>
              <NunitoText type="body2">Thành viên: {profileData?.numberOfTeamMember ?? "__ __"}</NunitoText>
            </View>
          </View>

          <View style={styles.infoBox}>
            <View style={styles.infoBoxHeader}>
              <NunitoText type="body3" lightColor="white" darkColor="white">
                Thông tin hệ số lương
              </NunitoText>
            </View>
            <View style={styles.infoBoxContent}>
              <NunitoText type="body2">Hệ số lương: {profileData?.salaryCoefficient.toFixed(1) ?? "__ __"}</NunitoText>
              <NunitoText type="body2">Phụ cấp chức vụ: {profileData?.positionBonusCoefficient.toFixed(1) ?? "__ __"}</NunitoText>
              {/* <NunitoText type="body2">Phụ cấp thâm niên: {profileData?.longWorkBonusCoefficient ?? "__ __"}</NunitoText> */}
              <NunitoText type="body2">Phụ cấp khác: {profileData?.otherBonusCoefficient.toFixed(1) ?? "__ __"}</NunitoText>
            </View>
          </View>

          <View style={styles.infoBox}>
            <View style={styles.infoBoxHeader}>
              <NunitoText type="body3" lightColor="white" darkColor="white">
                Thông tin đăng nhập
              </NunitoText>
            </View>
            <View style={[styles.infoBoxContent, { gap: 12 }]}>
              <View style={{ gap: 6 }}>
                <NunitoText type="body2">Số CCCD: {userInfo?.identifyCard}</NunitoText>
                <NunitoText type="body2">Mật khẩu: {"********"}</NunitoText>
              </View>
              <Pressable onPress={() => setOpenChangePwModal(true)}>
                <View style={styles.changePasswordButton}>
                  <NunitoText type="body2" lightColor="white" darkColor="white">
                    Đổi mật khẩu
                  </NunitoText>
                </View>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>

      {openChangePwModal && (
        <MyModal
          title={"Bạn muốn đổi mật khẩu?"}
          onClose={() => setOpenChangePwModal(false)}
          cb={handleSubmit(onChangePw)}
          modalProps={{ animationType: "slide", transparent: true }}
        >
          <View style={{ gap: 16 }}>
            <FormInput
              formInputProps={{ control: control, name: "oldPassword" }}
              secureTextEntry={!showPw}
              required
              label="Mật khẩu hiện tại"
              placeholder="Nhập mật khẩu hiện tại..."
              leftIcon={<MaterialIcons name="password" size={18} color={Colors.light.inputIconNone} />}
              rightIconEl={
                <Pressable onPress={onToggleShowPw}>
                  <View style={{ padding: 8 }}>
                    <Feather name={showPw ? "eye-off" : "eye"} size={18} color={Colors.light.inputIconNone} />
                  </View>
                </Pressable>
              }
            />
            <FormInput
              formInputProps={{ control: control, name: "newPassword" }}
              secureTextEntry={!showPw}
              required
              label="Mật khẩu mới"
              placeholder="Nhập mật khẩu mới..."
              leftIcon={<MaterialIcons name="password" size={18} color={Colors.light.inputIconNone} />}
              rightIconEl={
                <Pressable onPress={onToggleShowPw}>
                  <View style={{ padding: 8 }}>
                    <Feather name={showPw ? "eye-off" : "eye"} size={18} color={Colors.light.inputIconNone} />
                  </View>
                </Pressable>
              }
            />
            <FormInput
              formInputProps={{ control: control, name: "confirmPassword" }}
              secureTextEntry={!showPw}
              required
              label="Xác nhận mật khẩu"
              placeholder="Nhập lại mật khẩu mới..."
              leftIcon={<MaterialIcons name="password" size={18} color={Colors.light.inputIconNone} />}
              rightIconEl={
                <Pressable onPress={onToggleShowPw}>
                  <View style={{ padding: 8 }}>
                    <Feather name={showPw ? "eye-off" : "eye"} size={18} color={Colors.light.inputIconNone} />
                  </View>
                </Pressable>
              }
            />
          </View>
        </MyModal>
      )}

      {openCfLogout && (
        <MyModal
          title={"Bạn muốn đăng xuất?"}
          onClose={() => setOpenCfLogout(false)}
          cb={onLogout}
          modalProps={{ animationType: "slide", transparent: true }}
        >
          <View>
            <NunitoText type="body3">Bạn sẽ được điều hướng đến màn hình đăng nhập để đăng nhập lại</NunitoText>
          </View>
        </MyModal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  scrollView: {
    // flex: 1, // Make sure ScrollView also expands to fill space
  },
  scrollViewContent: {
    gap: 24,
    paddingBottom: 16, // Adjust this value based on the height of your tab bar
  },
  userInfoSumary: {
    paddingHorizontal: 10,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: `#000000${OPACITY_TO_HEX["25"]}`,
    borderRadius: 8,

    alignItems: "center",
    gap: 20,
  },
  nameAndRole: {
    gap: 2,
    alignItems: "center",
  },
  logoutButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 4,

    paddingHorizontal: 12,
    paddingVertical: 8,

    borderRadius: 4,
    backgroundColor: `#0B3A82${OPACITY_TO_HEX["15"]}`,
  },
  listInfoBox: {
    gap: 16,
  },

  infoBox: {
    borderRadius: 8,
  },
  infoBoxHeader: {
    padding: 10,
    backgroundColor: "#0B3A82",
    borderWidth: 1,
    borderColor: "#0B3A82",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  infoBoxContent: {
    padding: 10,
    gap: 6,

    borderColor: `#000000${OPACITY_TO_HEX["25"]}`,
    borderWidth: 1,
    borderTopWidth: 0,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },

  changePasswordButton: {
    height: 34,
    borderRadius: 4,
    backgroundColor: "#FF9C01",
    justifyContent: "center",
    alignItems: "center",
  },
});
