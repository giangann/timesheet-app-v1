import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Route, useRouter } from "expo-router";
import { useCallback } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { TouchableRipple } from "react-native-paper";
import { NunitoText } from "../text/NunitoText";

type Props = {
  destRoute: Route; // Ensures `destRoute` matches valid routes
  title?: string;
  customContainerStyles?: ViewStyle;
};

export const GoBackButton: React.FC<Props> = ({ destRoute, title, customContainerStyles }) => {
  const router = useRouter();

  const onPress = useCallback(() => {
    router.navigate(destRoute); // No more TypeScript error
  }, [destRoute, router]);

  return (
    <TouchableRipple onPress={onPress} rippleColor="rgba(0, 0, 0, .32)" borderless={true}>
      <View style={[styles.container, customContainerStyles]}>
        <MaterialIcons name="chevron-left" size={24} color="white" />
        {title && <NunitoText type="body3" style={styles.title}>{title}</NunitoText>}
      </View>
    </TouchableRipple>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 0,
  },
  title: {
    color: "white",
  },
});
