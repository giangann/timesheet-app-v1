import { OPACITY_TO_HEX } from "@/constants/Colors";
import { useSession } from "@/contexts/ctx";
import { useEffect, useState } from "react";
import { Image, Text, TextInput, TouchableHighlight, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";

const Login = () => {
  const [showPw, setShowPw] = useState(false);
  const { signIn } = useSession();

  const onToggleShowPw = () => {
    setShowPw(!showPw);
  };

  const onLogin = async () => {
    await signIn();
    // Navigate after signing in. You may want to tweak this to ensure sign-in is
    // successful before navigating.
    router.replace("/");
  };

  useEffect(() => {
    console.log("Login screen rendered");
  }, []);
  return (
    <View style={{ padding: 16 }}>
      <View style={{ height: 48 }} />

      <View style={{ alignItems: "center", justifyContent: "center" }}>
        <Image source={require("@/assets/images/banner-login.png")} style={{ opacity: 0.5 }} />
      </View>

      <View style={{ height: 32 }} />

      <Text style={{ fontFamily: "Nunito", fontWeight: 800, fontSize: 16, alignSelf: "center" }}>Đăng nhập</Text>

      {/*  */}
      <View style={{ height: 16 }} />

      {/* Input_1 - Identify Card  */}
      <View style={{ position: "relative", marginBottom: 8 }}>
        <TextInput
          placeholder="Nhập số CCCD"
          style={{
            padding: 10,
            paddingLeft: 36,
            paddingRight: 36,
            borderColor: `#000000${OPACITY_TO_HEX["20"]}`,
            borderWidth: 1,
            height: 40,
            borderRadius: 4,
            fontFamily: "Nunito",
          }}
        />

        <View style={{ position: "absolute", top: 0, left: 0, width: 36, height: "100%" }}>
          <View style={{ flex: 1, width: "100%", height: "100%", justifyContent: "center", alignItems: "center" }}>
            <Image source={require("@/assets/images/identify-card.png")} style={{ opacity: 0.5 }} />
          </View>
        </View>
        <View style={{ position: "absolute", top: 0, right: 0, width: 36, height: "100%" }}>
          <View style={{ flex: 1, width: "100%", height: "100%", justifyContent: "center", alignItems: "center" }}>
            <TouchableHighlight>
              <View>
                <Image source={require("@/assets/images/x-clear.png")} style={{ opacity: 0.5 }} />
              </View>
            </TouchableHighlight>
          </View>
        </View>
      </View>

      {/* Input_2 - Password  */}
      <View style={{ position: "relative" }}>
        <TextInput
          secureTextEntry={!showPw}
          placeholder="Nhập mật khẩu"
          style={{
            padding: 10,
            paddingLeft: 36,
            paddingRight: 36,
            borderColor: `#000000${OPACITY_TO_HEX["20"]}`,
            borderWidth: 1,
            height: 40,
            borderRadius: 4,
            fontFamily: "Nunito",
          }}
        />
        <View style={{ position: "absolute", top: 0, left: 0, width: 36, height: "100%" }}>
          <View style={{ flex: 1, width: "100%", height: "100%", justifyContent: "center", alignItems: "center" }}>
            <Image source={require("@/assets/images/lock-password.png")} style={{ opacity: 0.5 }} />
          </View>
        </View>
        <View style={{ position: "absolute", top: 0, right: 0, width: 36, height: "100%" }}>
          <View style={{ flex: 1, width: "100%", height: "100%", justifyContent: "center", alignItems: "center" }}>
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
          </View>
        </View>
      </View>

      {/*  */}
      <View style={{ height: 16 }} />

      {/* Button - Login */}
      <TouchableOpacity activeOpacity={0.8} onPress={onLogin}>
        <View style={{ justifyContent: "center", alignItems: "center", backgroundColor: "#0B3A82", height: 40, width: "100%", borderRadius: 4 }}>
          <Text style={{ fontFamily: "Nunito", color: "white", fontWeight: 600, fontSize: 14 }}>Đăng nhập</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default Login;
