import { NunitoText } from "@/components/text/NunitoText";
import { useRouter } from "expo-router";
import { Button, StyleSheet, View } from "react-native";

export default function TimeKeeping() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <NunitoText>TIME KEEPING DEFAULT SCREEN</NunitoText>

      <Button title="to Today Time Keeping" onPress={() => router.push("/time-keepings/today-time-keeping")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
});
