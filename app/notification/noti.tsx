import { NunitoText } from "@/components/text/NunitoText";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { io } from "socket.io-client";
export default function Noti() {
  useEffect(() => {
    const wsClient = io("https://proven-incredibly-redbird.ngrok-free.app/ws");

    wsClient.on("connect", () => {
      console.log("connected success");
    });

    console.log("wsClient id: ", wsClient.id);

    return () => {
      wsClient.off("connect");
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
