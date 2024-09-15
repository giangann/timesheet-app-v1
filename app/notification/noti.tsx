import { NunitoText } from "@/components/text/NunitoText";
import { useSession } from "@/contexts/ctx";
import { MyToast } from "@/ui/MyToast";
import { Button, StyleSheet, View } from "react-native";

export default function Noti() {
  const { session } = useSession();

  const onHttpCheck = async () => {
    try {
      const token = `Bearer ${session}` ?? "xxx";

      const baseUrl = "http://13.228.145.165:8080/api/v1";
      const endpoint = `/users/home`;
      const url = `${baseUrl}${endpoint}`;

      const response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json", Authorization: token },
        credentials: "include",
      });
      const responseJson = await response.json();

      if (responseJson.statusCode === 200) {
        MyToast.success("Kiểm tra thành công!");
      } else MyToast.error(responseJson.error);
    } catch (error: any) {
      MyToast.error(error.message);
    }
  };

  const onHttpWithTlsCheck = async () => {
    try {
      const token = `Bearer ${session}` ?? "xxx";

      const baseUrl = "https://proven-incredibly-redbird.ngrok-free.app/api/v1";
      const endpoint = `/users/home`;
      const url = `${baseUrl}${endpoint}`;

      const response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json", Authorization: token },
        credentials: "include",
      });
      const responseJson = await response.json();

      if (responseJson.statusCode === 200) {
        MyToast.success("Kiểm tra thành công!");
      } else MyToast.error(responseJson.error);
    } catch (error: any) {
      MyToast.error(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <NunitoText>NOTI SCREEN</NunitoText>

      <Button onPress={onHttpCheck} title="Check HTTP without TLS call" />

      <Button onPress={onHttpWithTlsCheck} title="Check HTTPS with TLS call" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 32,
  },
});
