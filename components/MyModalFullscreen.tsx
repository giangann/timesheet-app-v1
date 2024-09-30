import AntDesign from "@expo/vector-icons/AntDesign";
import { Modal, ModalProps, View, StyleSheet, TouchableOpacity, ViewStyle } from "react-native";
import { NunitoText } from "./text/NunitoText";
import { OPACITY_TO_HEX } from "@/constants/Colors";

type Props = {
  onClose: () => void;
  title?: string;
  children?: React.ReactNode;
  modalProps?: ModalProps;
  modalContainerStyles?: ViewStyle;
};

export function MyModalFullscreen({ title, onClose, children, modalProps, modalContainerStyles }: Props) {
  return (
    <Modal {...modalProps} transparent={true} animationType="slide">
      <View style={styles.modalContainer}>
        {/* Header */}
        <View style={styles.modalHeader}>
          {title && <NunitoText type="subtitle1">{title ?? "_Title"}</NunitoText>}
          <View style={styles.modalCloseIconWrapper}>
            <TouchableOpacity onPress={onClose}>
              <AntDesign name="close" size={20} color="black" />
            </TouchableOpacity>
          </View>
        </View>
        {/* Content - Children */}
        <View style={styles.childrenContainer}>{children}</View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    width: "100%",
    backgroundColor: "white",
  },
  modalHeader: {
    paddingHorizontal: 20,
    paddingVertical: 16,

    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",

    borderBottomColor: `#000000${OPACITY_TO_HEX["15"]}`,
    borderBottomWidth: 1,
  },
  modalCloseIconWrapper: {},
  childrenContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    flex: 1,
  },
});
