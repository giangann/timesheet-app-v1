import { OPACITY_TO_HEX } from "@/constants/Colors";
import { View } from "react-native";
type Props = {
  checked: boolean;
};

export const MyCheckRadio: React.FC<Props> = ({ checked }) => {
  const size = 16;
  const checkedColor = "#067D4E";
  const borderUncheckedColor = `#000000${OPACITY_TO_HEX["15"]}`;
  return (
    <View
      style={{
        backgroundColor: checked ? checkedColor : undefined,
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: 1,
        borderColor: checked ? checkedColor : borderUncheckedColor,
      }}
    />
  );
};
