import { Modal, SafeAreaView, StyleSheet, TouchableOpacity, View } from "react-native";
import { Delayed } from "../Delayed";
import { NunitoText } from "../text/NunitoText";
import { AntDesign } from "@expo/vector-icons";
import { EventItem } from "@howljs/calendar-kit";

type Props = {
  onClose: () => void;
  event: EventItem | null | undefined;
};
export const EventDetailModal: React.FC<Props> = ({ onClose, event }) => {
  return (
    <Modal transparent animationType="slide" style={{ zIndex: 99999 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.modalContainer}>
          <Delayed waitBeforeShow={100}>
            <>
              {/* Title */}
              <View style={styles.modalTitleWrapper}>
                <NunitoText type="heading2" style={styles.modalTitle}>
                  Chi tiết sự kiện
                </NunitoText>
                <TouchableOpacity onPress={onClose}>
                  <AntDesign name="close" size={20} color="black" />
                </TouchableOpacity>
              </View>

              {/* Content */}
              {/* ------------- */}
              {/* ------------- */}
              {event && (
                <View>
                  <NunitoText>{event.title}</NunitoText>
                </View>
              )}
            </>
          </Delayed>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    width: "100%",
    backgroundColor: "white",
    position: "relative",
    zIndex:99999
  },

  modalTitleWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },

  modalTitle: {
    color: "black",
  },
});
