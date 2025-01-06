import { MyIconButton } from "@/components/button";
import { Delayed } from "@/components/Delayed";
import { NunitoText } from "@/components/text/NunitoText";
import { useDutyFormCreateProvider } from "@/providers";
import { AntDesign } from "@expo/vector-icons";
import { memo, useCallback } from "react";
import { Modal, SafeAreaView, StyleSheet, TouchableOpacity, View } from "react-native";

export const SelectDutyUsersModal: React.FC = memo(() => {
    const { selectingDutyType, setOpenSelectUsersModal, setOpenSelectDutyTypeModal } = useDutyFormCreateProvider()

    const onCloseBtnPressed = useCallback(() => {
        console.log("pressed")
        setOpenSelectUsersModal(false)
        setOpenSelectDutyTypeModal(false)
    }, [setOpenSelectUsersModal, setOpenSelectDutyTypeModal])

    return (
        <Modal transparent animationType="slide">
            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.modalContainer}>
                    <Delayed waitBeforeShow={100}>
                        <View>
                            {/* Title */}
                            <View style={styles.modalTitleWrapper}>
                                <NunitoText type="heading2" style={styles.modalTitle}>
                                    {selectingDutyType?.name} - chọn người tham gia
                                </NunitoText>
                                <MyIconButton
                                    onPressed={onCloseBtnPressed}
                                    iconElement={
                                        <AntDesign name="close" size={20} color="black" />
                                    }
                                    paddingSize={16}
                                    extendStyles={{  position: "absolute", right: 0, top: 0 }}
                                />
                            </View>

                            {/* Content */}


                        </View>
                    </Delayed>
                </View>
            </SafeAreaView>
        </Modal>

    )
})
const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        width: "100%",
        backgroundColor: "white",
        position: "relative",
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

    modalContentContainer: {
        paddingHorizontal: 20,
        paddingVertical: 16,
        gap: 16,
    },

    filterContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 10,
    },

    filterItem: {
        flexGrow: 1,
    },

    fabStyle: {
        bottom: 16,
        right: 16,
        position: "absolute",
    },
});
