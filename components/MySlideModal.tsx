import React from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Modal, ModalProps, View, StyleSheet, TouchableOpacity, ViewStyle, Pressable, ScrollView } from "react-native";
import { NunitoText } from "./text/NunitoText";
import { OPACITY_TO_HEX } from "@/constants/Colors";

type Props = {
  onClose: () => void;
  title?: string;
  children?: React.ReactNode;
  modalProps?: ModalProps;
  modalContainerStyles?: ViewStyle;
};

export function MySlideModal({ title, onClose, children, modalProps, modalContainerStyles }: Props) {
  return (
    <Modal {...modalProps} transparent={true} animationType="slide">
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={[styles.modalContainer, modalContainerStyles]} onPress={(e) => e.stopPropagation()}>
          <View style={styles.modalHeader}>
            {title && <NunitoText type="subtitle1">{title ?? "_Title"}</NunitoText>}
            <View style={styles.modalCloseIconWrapper}>
              <TouchableOpacity onPress={onClose}>
                <AntDesign name="close" size={20} color="black" />
              </TouchableOpacity>
            </View>
            <View style={styles._abosoluteLayer}>
              <View style={styles.modalHeaderNotch} />
            </View>
          </View>
          <ScrollView contentContainerStyle={styles.childrenContainer}>{children}</ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Light black overlay
    justifyContent: "flex-end",
    alignItems: "center",
  },
  modalContainer: {
    width: "100%",
    minHeight: 250,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    backgroundColor: "white",
    elevation: 2,
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
  _abosoluteLayer: {
    position: "absolute",
    width: "100%",
    top: 6,
    left: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  modalHeaderNotch: {
    width: 40,
    height: 2,
    backgroundColor: `#000000${OPACITY_TO_HEX["15"]}`,
  },
  childrenContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 6,
  },
  buttonItem: {
    flexGrow: 1,
  },
  buttonContained: {
    justifyContent: "center",
    alignItems: "center",
    height: 44,
    backgroundColor: "#0B3A82",
    borderRadius: 4,
  },
  buttonOutlined: {
    justifyContent: "center",
    alignItems: "center",
    height: 44,
    borderColor: "#0B3A82",
    borderWidth: 1,
    borderRadius: 4,
  },
});
