import { OPACITY_TO_HEX } from "@/constants/Colors";
import { ROLE_CODE } from "@/constants/Misc";
import { Image, ImageSourcePropType, ImageStyle, StyleSheet, ViewStyle } from "react-native";

const AvatarRoleDefault = require("@/assets/images/role_default.png");
const AvatarRoleAdmin = require("@/assets/images/admin_avatar.png");
const AvatarRoleTeamDirector = require("@/assets/images/team_director_avatar.png");
const AvatarRoleDepartmentDirector = require("@/assets/images/department_director_avatar.png");
const AvatarRoleSpecialist = require("@/assets/images/specialist_avatar.png");
const AvatarRoleArchivist = require("@/assets/images/archivist_avatar.png");

type Props = {
  role: ROLE_CODE | undefined | null;
  customStyles?: ImageStyle;
};

export const AvatarByRole: React.FC<Props> = ({ role, customStyles }) => {
  let avatarSource: ImageSourcePropType;

  switch (role) {
    case ROLE_CODE.ADMIN:
      avatarSource = AvatarRoleAdmin;
      break;
    case ROLE_CODE.DEPARTMENT_DIRECTOR:
      avatarSource = AvatarRoleDepartmentDirector;
      break;
    case ROLE_CODE.TEAM_DIRECTOR:
      avatarSource = AvatarRoleTeamDirector;
      break;
    case ROLE_CODE.SPECIALIST:
      avatarSource = AvatarRoleSpecialist;
      break;
    case ROLE_CODE.ARCHIVIST:
      avatarSource = AvatarRoleArchivist;
      break;
    default:
      avatarSource = AvatarRoleDefault;
      break;
  }
  return <Image source={avatarSource} style={[styles.avatar, customStyles ?? {}]} />;
};

const styles = StyleSheet.create({
  avatar: {
    borderWidth: 1,
    borderColor: `#000000${OPACITY_TO_HEX["15"]}`,
    borderRadius: 20,
    width: 40,
    height: 40,
  },
});
