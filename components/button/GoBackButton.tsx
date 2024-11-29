import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Route, useRouter } from "expo-router";
import { useCallback } from "react";
import { View } from "react-native";
import { TouchableRipple } from "react-native-paper";

type Props = {
  destRoute: Route; // Ensures `destRoute` matches valid routes
};

export const GoBackButton: React.FC<Props> = ({ destRoute }) => {
  const router = useRouter();

  const onPress = useCallback(() => {
    router.navigate(destRoute); // No more TypeScript error
  }, [destRoute, router]);

  return (
    <TouchableRipple onPress={onPress} rippleColor="rgba(0, 0, 0, .32)" borderless={true}>
      <View style={{ flexDirection: "row", alignItems: "center", padding: 12 }}>
        <MaterialIcons name="arrow-back" size={24} color="white" />
      </View>
    </TouchableRipple>
  );
};
