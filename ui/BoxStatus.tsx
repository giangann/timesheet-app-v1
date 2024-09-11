import { NunitoText } from "@/components/text/NunitoText";
import { OPACITY_TO_HEX } from "@/constants/Colors";
import { FORM_STATUS, FORM_STATUS_NAME } from "@/constants/Misc";
import { View, StyleSheet, ViewStyle } from "react-native";
import { BadgeStatus } from "./BadgeStatus";
import moment from "moment";

type Props = {
  status: FORM_STATUS;
  approveDate: string | null;
};

export const BoxStatus: React.FC<Props> = ({ status, approveDate }) => {
  let styleByStatus: ViewStyle;

  switch (status) {
    case FORM_STATUS.WATING_APPROVE:
      styleByStatus = { backgroundColor: `#F2A900${OPACITY_TO_HEX["15"]}` };
      break;

    case FORM_STATUS.ACCEPTED:
      styleByStatus = { backgroundColor: `#067D4E${OPACITY_TO_HEX["15"]}` };
      break;
    case FORM_STATUS.REJECTED:
      styleByStatus = { backgroundColor: `#C84851${OPACITY_TO_HEX["15"]}` };
      break;

    default:
      styleByStatus = {};
      break;
  }

  return (
    <View style={[styles.container, styleByStatus]}>
      <View style={styles.itemLeft}>
        <BadgeStatus status={status} />
        <NunitoText>{FORM_STATUS_NAME[status]}</NunitoText>
      </View>

      <View style={styles.itemRight}>
        {approveDate && (
          <NunitoText type="body4" style={{ opacity: 0.7 }}>
            {moment(approveDate).format("DD/MM/YYYY HH:mm")}
          </NunitoText>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,

    paddingVertical: 12,
  },

  itemLeft:{
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,

  },

  itemRight:{

  }
});
