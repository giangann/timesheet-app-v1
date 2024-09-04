import { OPACITY_TO_HEX } from "@/constants/Colors";
import { useSession } from "@/contexts/ctx";
import { useEffect, useState } from "react";
import { Image, Text, TextInput, TouchableHighlight, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import { BaseInput } from "@/components/BaseInput";
import { useForm } from "react-hook-form";
import { TCredentials } from "@/api/auth";
import { FormInput } from "@/components/FormInput";
import { MyToast } from "@/ui/MyToast";
import { NunitoText } from "@/components/text/NunitoText";
import * as Progress from "react-native-progress";

const PwIconLeft = require("@/assets/images/lock-password.png");
const PwIconRight = require("@/assets/images/password-show.png");
const IdCardIconLeft = require("@/assets/images/identify-card.png");
const IdCardIconRight = require("@/assets/images/x-clear.png");
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

  useEffect(() => {
    console.log("Login screen rendered");
  }, []);
  return (
    <View style={{ padding: 16 }}>
      <View style={{ height: 48 }} />

      <View style={{ alignItems: "center", justifyContent: "center" }}>
        <Image source={LoginBanner} style={{ opacity: 0.5 }} />
      </View>

      <View style={{ height: 32 }} />

      <Text style={{ fontFamily: "Nunito", fontWeight: 800, fontSize: 16, alignSelf: "center" }}>Đăng nhập</Text>

      {/*  */}
      <View style={{ height: 16 }} />

      {/* Input_1 - Identify Card  */}
      <FormInput
        formInputProps={{ control: control, name: "identifyCard" }}
        placeholder="Nhập số CCCD..."
        leftIconImage={IdCardIconLeft}
        rightIconImage={IdCardIconRight}
      />
      {/* Input_2 - Password */}
      <FormInput
        formInputProps={{ control: control, name: "password" }}
        secureTextEntry={!showPw}
        placeholder="Nhập mật khẩu..."
        leftIconImage={PwIconLeft}
        rightIconImage={PwIconRight}
        rightIconEl={
          <TouchableOpacity onPress={onToggleShowPw} activeOpacity={0.7}>
            <View style={{ padding: 8 }}>
              <View style={{ width: 18, height: 18 }}>
                <Image
                  source={require("@/assets/images/password-show.png")}
                  style={{ opacity: 0.5, width: "100%", height: "100%", resizeMode: "contain" }}
                />
              </View>
            </View>
          </TouchableOpacity>
        }
      />

      {/*  */}
      <View style={{ height: 16 }} />
      {/* Button - Login */}
      <TouchableOpacity activeOpacity={0.8} onPress={handleSubmit(onLogin)} disabled={isSubmitting}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#0B3A82",
            height: 44,
            width: "100%",
            borderRadius: 4,
            gap: 8,
          }}
        >
          {isSubmitting && <Progress.Circle indeterminate size={14} />}
          <Text style={{ fontFamily: "Nunito", color: "white", fontWeight: 600, fontSize: 14 }}>Đăng nhập</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default Login;
