import { TCredentials } from "@/api/auth";
import { FormInput } from "@/components/FormInput";
import { NunitoText } from "@/components/text/NunitoText";
import { Colors } from "@/constants/Colors";
import { useSession } from "@/contexts/ctx";
import { MyToast } from "@/ui/MyToast";
import { MaterialIcons } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import { Link, router, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import * as Progress from "react-native-progress";

const LoginBanner = require("@/assets/images/banner-login-v2.png");

const Login = () => {
  const [showPw, setShowPw] = useState(false);
  const { signIn } = useSession();

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<TCredentials>({ defaultValues: { identifyCard: "", password: "" } });

  const onToggleShowPw = () => {
    setShowPw(!showPw);
  };

  const onLogin = async (data: TCredentials) => {
    try {
      await signIn(data);
      // Navigate after signing in. You may want to tweak this to ensure sign-in is
      // successful before navigating.
      MyToast.success("Đăng nhập thành công");
      router.replace("/");
    } catch (error: any) {
      if (error instanceof Error) MyToast.error(error.message);
      else MyToast.error("Unknown Error");
    }
  };

  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "android" ? "height" : "padding"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={0} // Adjust based on your testing
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View style={styles.container}>
              <View style={{ gap: 8 }}>
                <View style={styles.appInfo}>
                  <NunitoText type="heading2" style={{ textAlign: "center", color: "#0B3A82", textTransform: "uppercase" }}>
                    Trung tâm CNTT - Cơ yếu
                  </NunitoText>
                  <NunitoText type="heading3" style={{ textAlign: "center", color: "#0B3A82", textTransform: "uppercase" }}>
                    Phần mềm chấm công
                  </NunitoText>
                </View>
                <View style={styles.logoWrapper}>
                  <Image source={LoginBanner} style={styles.logo} />
                </View>
              </View>

              <View style={styles.formWrapper}>
                <NunitoText style={{ textAlign: "center", color: "#0B3A82" }}>Đăng nhập</NunitoText>

                <View style={styles.fieldWrapper}>
                  {/* Input_1 - Identify Card */}
                  <FormInput
                    formInputProps={{ control: control, name: "identifyCard" }}
                    placeholder="Nhập số CCCD..."
                    leftIcon={<AntDesign name="idcard" size={18} color={Colors.light.inputIconNone} />}
                  />
                  {/* Input_2 - Password */}
                  <FormInput
                    formInputProps={{ control: control, name: "password" }}
                    secureTextEntry={!showPw}
                    placeholder="Nhập mật khẩu..."
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

                {/* Button - Login */}
                <TouchableOpacity activeOpacity={0.8} onPress={handleSubmit(onLogin)} disabled={isSubmitting}>
                  <View style={styles.btnInner}>
                    {isSubmitting && <Progress.Circle indeterminate size={14} />}
                    <NunitoText type="body3" lightColor="white" darkColor="white">
                      Đăng nhập
                    </NunitoText>
                  </View>
                </TouchableOpacity>
                {/* <TouchableOpacity onPress={()=>navigation.navigate()}>
                  <NunitoText>to home</NunitoText>
                </TouchableOpacity> */}
                <Link href={'/(tabs)'}>to home</Link>
              </View>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 24,
    // flex: 1,
  },
  appInfo: {
    marginTop: 32,
  },

  logoWrapper: {
    alignItems: "center",
    // marginTop: 32,
  },
  logo: {
    maxHeight: 200,
    height: 150,
    width: "50%",

    borderRadius: 4,
  },
  formWrapper: {
    gap: 12,
  },
  fieldWrapper: {
    gap: 0,
  },
  btnInner: {
    backgroundColor: "#0B3A82",
    width: "100%",
    height: 44,
    borderRadius: 4,

    gap: 8,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});
