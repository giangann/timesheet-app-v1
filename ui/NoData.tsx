import { NunitoText } from "@/components/text/NunitoText";
import { View, StyleSheet } from "react-native";

type Props = {
  message?: string;
};
export const NoData: React.FC<Props> = ({ message }) => {
  return (
    <View style={styles.container}>
      <NunitoText type="body3" style={styles.text}>
        {message ?? "Không có dữ liệu"}
      </NunitoText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // padding: 16,
  },
  text: {
    color: "black",
    textAlign: "center",
  },
});
