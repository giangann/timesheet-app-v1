import { NunitoText } from "@/components/text/NunitoText";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
export default function Noti() {
  useEffect(() => {
    const wsClient = new WebSocket("wss://proven-incredibly-redbird.ngrok-free.app/api/v1/ws");

    const onOpen = () => {
      console.log("connection opened");
    };
    const onClose = (ev: CloseEvent) => {
      console.log("connection closed:", ev.timeStamp);
    };
    const onMessage = (ev: WebSocketMessageEvent) => {
      console.log("new event: ", ev);
      console.log("event info:", ev.target, ev.data);
    };
    const onError = (ev: WebSocketMessageEvent) => {
      console.log("error occured: ", ev);
    };

    wsClient.onopen = onOpen;
    wsClient.onclose = onClose;
    wsClient.onmessage = onMessage;
    wsClient.onerror = onError;

    return () => {
      wsClient.close();
      wsClient.removeEventListener("open", onOpen);
      wsClient.removeEventListener("close", onClose);
      wsClient.removeEventListener("message", onMessage);
      wsClient.removeEventListener("error", onError);
    };
  }, []);
  return (
    <View style={styles.container}>
      <NunitoText>NOTI SCREEN</NunitoText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 32,
  },
});
