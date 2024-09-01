import { NunitoText } from "@/components/text/NunitoText";
import React from "react";
import { Image, View } from "react-native";
import Toast, { ToastOptions } from "react-native-root-toast";
const SuccessIcon = require("@/assets/images/success-icon.png");
const ErrorIcon = require("@/assets/images/error-icon.png");

export class MyToast {
  static success(message: string) {
    const toastEl = (
      <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
        <Image source={SuccessIcon} />
        <NunitoText lightColor="white" type="body3">
          {message}
        </NunitoText>
      </View>
    );

    const toastOptions: ToastOptions = {
      backgroundColor: "green",
      duration: Toast.durations.LONG,
      position: Toast.positions.BOTTOM,
      shadow: true,
      animation: true,
      hideOnPress: true,
      delay: 0,
    };

    // @ts-ignore
    Toast.show(toastEl, toastOptions);
  }

  static error(message: string) {
    const toastEl = (
      <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
        <Image source={ErrorIcon} />
        <NunitoText lightColor="white" type="body3">
          {message}
        </NunitoText>
      </View>
    );

    const toastOptions: ToastOptions = {
      backgroundColor: "red",
      duration: Toast.durations.LONG,
      position: Toast.positions.BOTTOM,
      shadow: true,
      animation: true,
      hideOnPress: true,
      delay: 0,
    };

    // @ts-ignore
    Toast.show(toastEl, toastOptions);
  }
}
