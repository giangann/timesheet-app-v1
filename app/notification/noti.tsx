import { NunitoText } from "@/components/text/NunitoText";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { WebSocket } from "ws";

export default function Noti() {
  useEffect(() => {
    const wsClient = new WebSocket("wss://proven-incredibly-redbird.ngrok-free.app/api/v1/ws");

    const onOpen = () => {
      console.log("connection opened");
    };
    const onClose = (ev: WebSocketEventMap["close"]) => {
      console.log("connection closed:", ev.timeStamp);
    };
    const onMessage = (ev: WebSocketMessageEvent) => {
      console.log("new event: ", ev);
      console.log("event info:", ev.target, ev.data);
    };
    const onError = (ev: WebSocketMessageEvent) => {
      console.log("error occured: ", ev);
    };

    wsClient.on("open", onOpen);
    wsClient.on("close", onClose);
    wsClient.on("message", onMessage);
    wsClient.on("error", onError);

    return () => {
      wsClient.close();
      wsClient.off("open", onOpen);
      wsClient.off("close", onClose);
      wsClient.off("message", onMessage);
      wsClient.off("error", onError);
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
