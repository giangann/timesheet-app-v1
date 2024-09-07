import { FORM_STATUS } from "@/constants/Misc";
import { View } from "react-native";

type Props = {
  status: FORM_STATUS;
};
export const BadgeStatus: React.FC<Props> = ({ status }) => {
  let color: string;

  switch (status) {
    case FORM_STATUS.WATING_APPROVE:
      color = "#F2A900";
      break;
    case FORM_STATUS.ACCEPTED:
      color = "#067D4E";
      break;
    case FORM_STATUS.REJECTED:
      color = "#C84851";
      break;
    default:
      color = "";
      break;
  }

  return <View style={{ backgroundColor: color, width: 8, height: 8, borderRadius: 4 }} />;
};
