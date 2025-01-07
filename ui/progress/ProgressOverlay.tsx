import { OPACITY_TO_HEX } from "@/constants/Colors";
import { memo } from "react";
import { StyleSheet, View, ActivityIndicator } from "react-native";

type Props = {
  loadingIndicator?: React.ReactNode;
};

export const ProgressOverlay: React.FC<Props> = memo(({ loadingIndicator }) => {
  return (
    <View style={styles.overlay}>
      {loadingIndicator || <ActivityIndicator size="large" color="#fff" />}
    </View>
  );
});

const styles = StyleSheet.create({
  overlay: {
    backgroundColor: `#000000${OPACITY_TO_HEX['15'] || '26'}`, // Ensure valid opacity hex
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: 1000, // Ensure it appears above other elements
    justifyContent: "center", // Center the loading indicator
    alignItems: "center",
  },
});
