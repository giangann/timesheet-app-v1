import { NunitoText } from "@/components/text/NunitoText";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { StyleSheet, View } from "react-native";

export default function PushNotiTest() {
  const { expoPushToken, notification } = usePushNotifications();
  const data = JSON.stringify(notification, undefined, 2);

  return (
    <View style={styles.container}>
      <View>
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
