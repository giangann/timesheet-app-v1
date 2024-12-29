import React, { memo, useState } from "react";
import { Modal, View, Text, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import { NunitoText } from "./text/NunitoText";

type Props = {
  defaultYear?: number;
  onYearSelect?: (year: number) => void;
  year?: number;
};
const currentYear = new Date().getFullYear();

const CustomYearPicker: React.FC<Props> = memo(({ defaultYear, year, onYearSelect }) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedYear, setSelectedYear] = useState<number | null>(year ?? defaultYear ?? null);

  const years = generateYears();

  const toggleModal = () => setModalVisible(!isModalVisible);

  const handleYearSelect = (year: number) => {
    setSelectedYear(year);
    toggleModal();

    onYearSelect?.(year);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={toggleModal}>
        <NunitoText type="body2" style={styles.buttonText}>
          {selectedYear ?? currentYear}
        </NunitoText>
      </TouchableOpacity>

      <Modal visible={isModalVisible} animationType="fade" transparent={true} onRequestClose={toggleModal}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Chọn năm</Text>
            <FlatList
              data={years}
              keyExtractor={(item) => item.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.yearItem} onPress={() => handleYearSelect(item)}>
                  <View style={styles.radioButton}>{selectedYear === item && <View style={styles.radioInner} />}</View>
                  <Text style={styles.yearText}>{item}</Text>
                </TouchableOpacity>
              )}
              contentContainerStyle={styles.flatListContentContainer}
              style={styles.flatList}
            />
            <TouchableOpacity style={styles.closeButton} onPress={toggleModal}>
              <Text style={styles.closeButtonText}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
});

function generateYears(): number[] {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 11 }, (_, i) => currentYear - 4 + i); //2020->2030
  return years;
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  button: {
    borderWidth: 1,
    borderColor: "#0B3A82",
    borderRadius: 12,

    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  buttonText: {
    color: "#0B3A82",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    maxHeight: "70%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  flatList: {
    width: "100%",
    // //
    // borderWidth: 1,
    // borderColor: "green",
  },
  flatListContentContainer: {
    alignItems: "center",
    // //
    // borderWidth: 1,
    // borderColor: "red",
  },
  yearItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  yearText: {
    fontSize: 16,
    marginLeft: 10,
  },
  radioButton: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#007bff",
    justifyContent: "center",
    alignItems: "center",
  },
  radioInner: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: "#007bff",
  },
  closeButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#dc3545",
    borderRadius: 5,
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default CustomYearPicker;
