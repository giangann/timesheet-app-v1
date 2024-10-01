import { NunitoText } from "@/components/text/NunitoText";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { StyleSheet, View } from "react-native";

export default function PushNotiTest() {
  const { expoPushToken, notification, status, error } = usePushNotifications();
  const data = JSON.stringify(notification, undefined, 2);

  return (
    <View style={styles.container}>
      <View>
        <NunitoText style={{ color: "black" }}>Logs:</NunitoText>
        {status?.map((statusString, index) => (
          <NunitoText key={index} type="caption" style={{ color: "black" }}>
            {statusString}
          </NunitoText>
        ))}

        <NunitoText style={{ color: "black" }}>Errors:</NunitoText>
        {error?.map((errorString, index) => (
          <NunitoText key={index} type="caption" style={{ color: "red" }}>
            {errorString}
          </NunitoText>
        ))}

        <NunitoText style={{ color: "black" }}>Token: {expoPushToken?.data ?? ""}</NunitoText>
        <NunitoText style={{ color: "black" }}>Notification: {data}</NunitoText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 32,
  },
});
