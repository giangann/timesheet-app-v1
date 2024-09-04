import { Modal, ModalProps, View, StyleSheet, TouchableOpacity } from "react-native";
import { NunitoText } from "./text/NunitoText";

type Props = {
  cb?: Function;
  onClose: () => void;
  title?: string;
  children?: React.ReactNode;
  modalProps?: ModalProps;
};

export function MyModal({ title, cb, onClose, children, modalProps }: Props) {
  const onAccept = () => {
    if (cb) cb();
    onClose();
  };
  return (
    <Modal {...modalProps} transparent={true}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* title + content */}
          <View style={{ gap: 12 }}>
            {title && <NunitoText type="subtitle1">{title}</NunitoText>}

            {children}
          </View>

          {/* action */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={onClose} activeOpacity={0.8} style={styles.buttonItem}>
              <View style={styles.buttonOutlined}>
                <NunitoText type="body3" style={{ color: "#0B3A82" }}>
                  Đóng
                </NunitoText>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={onAccept} activeOpacity={0.8} style={styles.buttonItem}>
              <View style={styles.buttonContained}>
                <NunitoText type="body3" style={{ color: "white" }}>
                  Xác nhận
                </NunitoText>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Light black overlay
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "white",
    elevation: 2,
    padding: 20,
    gap: 24,
    borderRadius: 8,
    minWidth: 280,
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
