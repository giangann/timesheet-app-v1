import { TouchableRipple } from "react-native-paper";
import { View } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { MaterialIcons } from "@expo/vector-icons";
type Props = {
  isEdit: boolean;
  onToggleEdit: () => void;
};
export const EditButton: React.FC<Props> = ({ isEdit, onToggleEdit }) => {
  return (
    <TouchableRipple onPress={onToggleEdit} rippleColor="rgba(0, 0, 0, .32)" borderless={true}>
      <View style={{ flexDirection: "row", alignItems: "center", padding: 12 }}>
        {!isEdit && <MaterialIcons name="edit" size={20} color="white" />}
        {isEdit && <MaterialCommunityIcons name="cancel" size={24} color="white" />}
      </View>
    </TouchableRipple>
  );
};
