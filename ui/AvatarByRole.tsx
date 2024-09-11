import { ROLE_CODE } from "@/constants/Misc";
import RoleDefaultAvatar from "./role_default.svg";
import { View, StyleSheet } from "react-native";
import { OPACITY_TO_HEX } from "@/constants/Colors";

type Props = {
  role: ROLE_CODE;
};

export const AvatarByRole: React.FC<Props> = ({ role }) => {
  return (
    <View style={styles.avatarWrapper}>
      <RoleDefaultAvatar />
    </View>
  );
};

const styles = StyleSheet.create({
  avatarWrapper: {
    borderWidth: 1,
    borderColor: `#000000${OPACITY_TO_HEX["15"]}`,
    width: 40,
    height: 40,
  },
});
