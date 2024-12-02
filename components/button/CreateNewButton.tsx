import { MaterialIcons } from "@expo/vector-icons";
import { View } from "react-native";
import { TouchableRipple } from "react-native-paper";
type Props = {
  onPressedButton: () => void;
};
export const CreateNewButton: React.FC<Props> = ({ onPressedButton }) => {
  return (
    <TouchableRipple onPress={onPressedButton} rippleColor="rgba(0, 0, 0, .32)" borderless={true}>
      <View style={{ flexDirection: "row", alignItems: "center", padding: 12 }}>
        <MaterialIcons name="add" size={20} color="white" />
      </View>
    </TouchableRipple>
  );
};
