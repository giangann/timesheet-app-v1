import { NunitoText } from "@/components/text/NunitoText";
import { FORM_STATUS, FORM_STATUS_NAME } from "@/constants/Misc";
import { View, StyleSheet } from "react-native";

type Props = {
  status: FORM_STATUS;
};
export const ChipStatus: React.FC<Props> = ({ status }) => {
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

  return (
    <View
      style={{ backgroundColor: color, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, alignItems: "center", justifyContent: "center" }}
    >
      <NunitoText type="body4" lightColor="white">
        {FORM_STATUS_NAME[status]}
      </NunitoText>
    </View>
  );
};
