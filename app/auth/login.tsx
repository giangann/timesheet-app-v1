import { TCredentials } from "@/api/auth";
import { FormInput } from "@/components/FormInput";
import { Colors } from "@/constants/Colors";
import { useSession } from "@/contexts/ctx";
import { MyToast } from "@/ui/MyToast";
import { MaterialIcons } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import { router, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Image, Keyboard, Pressable, SafeAreaView, ScrollView, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import * as Progress from "react-native-progress";
import { StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { NunitoText } from "@/components/text/NunitoText";

const LoginBanner = require("@/assets/images/banner-login.png");

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
      else MyToast.error(JSON.stringify(error));
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
              <View style={styles.logoWrapper}>
                <Image source={LoginBanner} style={{ opacity: 0.5 }} />
              </View>

              <View style={styles.formWrapper}>
                <NunitoText style={{ textAlign: "center" }}>Đăng nhập</NunitoText>

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
                    <NunitoText type="body3" lightColor="white">
                      Đăng nhập
                    </NunitoText>
                  </View>
                </TouchableOpacity>
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
  logoWrapper: {
    alignItems: "center",
    marginTop: 32,
  },
  formWrapper: {
    gap: 12,
  },
  fieldWrapper: {
    gap: 8,
  },
  btnInner: {
    height: 44,
    width: "100%",
    borderRadius: 4,
    gap: 8,

    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0B3A82",
  },
});
