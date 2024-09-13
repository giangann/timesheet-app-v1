import { NunitoText } from "@/components/text/NunitoText";
import { user } from "@/constants/Misc";
import { useSession } from "@/contexts/ctx";
import { useEffect, useState } from "react";
import { View, StyleSheet, Button } from "react-native";
import io from "socket.io-client";

export default function Noti() {
  const { session } = useSession();
  const [status, setStatus] = useState<number | null>(null);

  useEffect(() => {
    console.log("useEffect run");

    // Ensure the authorization token is properly formatted
    const authorizationToken = `Bearer ${session}`;

    // Create a Socket.IO client instance with headers
    const socketIoClient = io("http://52.62.216.20:5000", {
      autoConnect: false,
      transports: ["websocket"], // Use WebSocket transport
      extraHeaders: {
        Authorization: authorizationToken,
      },
    });

    // Connect to the server
    socketIoClient.connect();

    // Log connection ID
    socketIoClient.on("connect", () => console.log("connected: ", socketIoClient.id));

    // parse user
    socketIoClient.emit("parseUser", user);

    // Handle incoming messages
    socketIoClient.on("newNoti", (msg) => console.log("received newNoti: ", msg));
    socketIoClient.on("updateListOrder", (msg) => console.log("received updateListOrder: ", msg));

    // Cleanup on unmount
    return () => {
      socketIoClient.disconnect();
    };
  }, [session]);

  return (
    <View style={styles.container}>
      <NunitoText>NOTI SCREEN</NunitoText>
      <NunitoText>Socket status: {status}</NunitoText>

      <Button title="Login delco-egg to take token" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
});
