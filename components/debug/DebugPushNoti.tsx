import { usePushNotifications } from "@/hooks/usePushNotifications";
import { memo } from "react";
import { ScrollView, View } from "react-native";
import { NunitoText } from "../text/NunitoText";
import { CopyToClipBoard } from "../clipboard";

export const DebugPushNoti: React.FC = memo(() => {
  const { expoPushToken, notification } = usePushNotifications();
  return (
    <View>
      <NunitoText>Push-notification releated infomation:</NunitoText>
      <NunitoText>Expo Push Token</NunitoText>
      <NunitoText>Token</NunitoText>
      <NunitoText>{expoPushToken?.data}</NunitoText>
      <CopyToClipBoard content={expoPushToken?.data} />
      <NunitoText>Type</NunitoText>
      <NunitoText>{expoPushToken?.type}</NunitoText>
    </View>
  );
});
