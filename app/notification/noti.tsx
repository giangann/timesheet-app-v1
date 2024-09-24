import { NunitoText } from "@/components/text/NunitoText";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
const token =
  "eyJhbGciOiJIUzI1NiJ9.eyJhZGRyZXNzIjoiTm8gYWRkIiwicm9sZSI6IkzDo25oIMSR4bqhbyBwaMOybmciLCJwaG9uZSI6IjAwMDAwMDAwMDAwIiwibmFtZSI6IsSQ4bq3bmcgTWluaCBDaMOtbmgiLCJlbWFpbCI6ImRtY0BnbWFpbC5jb20iLCJzdWIiOiIwMDAwMDAwMDExMTEiLCJpYXQiOjE3MjcxNjkxNDcsImV4cCI6MTcyNzI1NTU0N30.L0hdG6s_UVv3jaHNsZ3AZgoYV672f9OHyALc1hNvYps";
export default function Noti() {
  useEffect(() => {
    const wsClient = new WebSocket("wss://proven-incredibly-redbird.ngrok-free.app/ws");

    const onOpen = () => {
      console.log("connection opened");

      const authMessage = { type: "AUTH", token: token };
      // wsClient.send(JSON.stringify(authMessage));
    };

    const onClose = (event: WebSocketCloseEvent) => {
      console.log(`WebSocket connection closed, code=${event.code}, reason=${event.reason}, message=${event.message}`);
    };

    const onMessage = (ev: WebSocketMessageEvent) => {
      const evDataParsed = JSON.parse(ev.data);
      console.log("new event: ", ev);
      console.log("event target:", ev.target);
      console.log("event data:", ev.data);
      console.log("event data type: ", evDataParsed.type);
      console.log("event is trusted: ", ev.isTrusted);
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
