import { useHasRegisterEPTInCurrentLoginSession } from "@/hooks/useHasRegisterEPTInCurrentLoginSession";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { memo } from "react";
import { View } from "react-native";
import { CopyToClipBoard } from "../clipboard";
import { NunitoText } from "../text/NunitoText";

export const DebugPushNoti: React.FC = memo(() => {
  const { expoPushToken, notification } = usePushNotifications();
  const { hasRegister } = useHasRegisterEPTInCurrentLoginSession();

  return (
    <View>
      <NunitoText>Push-notification releated infomation:</NunitoText>
      <NunitoText>Expo Push Token</NunitoText>
      <NunitoText>Token</NunitoText>
      <NunitoText>{expoPushToken?.data}</NunitoText>
      <CopyToClipBoard content={expoPushToken?.data} />
      <NunitoText>
        {hasRegister == null
          ? "Null / undenfined"
          : Boolean(hasRegister)
          ? "Registered"
          : "Unregistered"}
      </NunitoText>
      <NunitoText>Type</NunitoText>
      <NunitoText>{expoPushToken?.type}</NunitoText>

      <NunitoText>In-Comming notifications: </NunitoText>
      <NunitoText>{JSON.stringify(notification)}</NunitoText>
      {notification && (
        <CopyToClipBoard content={JSON.stringify(notification)} />
      )}
    </View>
  );
});
