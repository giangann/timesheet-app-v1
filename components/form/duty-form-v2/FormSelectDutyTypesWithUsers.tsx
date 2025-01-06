import { useDutyFormCreateProvider } from "@/providers"
import { StyleSheet, View } from "react-native"
import { SelectedDutyTypes } from "./SelectedDutyTypes"
import { SelectDutyTypeModal } from "./SelectDutyTypeModal"
import { SelectDutyUsersModal } from "./SelectDutyUsersModal"
import { NunitoText } from "@/components/text/NunitoText"
import { Button } from "react-native-paper"
import { useCallback } from "react"

export const FormSelectDutyTypesWithUsers = () => {
    const { openSelectUsersModal, openSelectDutyTypeModal, setOpenSelectDutyTypeModal } = useDutyFormCreateProvider()

    const onOpenDutyTypesModal = useCallback(() => { console.log('open', { openSelectDutyTypeModal }); setOpenSelectDutyTypeModal(true) }, [setOpenSelectDutyTypeModal]);

    return (
        <View>
            {/*  */}
            <FieldLabel />

            {/* Selected Duty Types */}
            <SelectedDutyTypes />

            {/*  */}
            <Button
                style={[{ alignItems: "flex-start" }]}
                onPress={onOpenDutyTypesModal}
                textColor="#0B3A82"
                disabled={false} // change this
            >
                + thêm loại trực
            </Button>

            {/* Select Duty Type Modal */}
            {openSelectDutyTypeModal && <SelectDutyTypeModal />}

            {/* Select Users Modals */}
            {openSelectUsersModal && <SelectDutyUsersModal />}

        </View>
    )
}

const FieldLabel: React.FC = () => (
    <View style={styles.labelWrapper}>
        <NunitoText type="body2" style={{ marginRight: 6 }}>
            Loại trực và thành viên tham gia
        </NunitoText>
        <NunitoText type="body1" style={{ color: "red" }}>
            *
        </NunitoText>
    </View>
);


const styles = StyleSheet.create({
    dutyTypeFieldContainer: {
        gap: 6,
    },
    labelWrapper: {
        flexDirection: "row",
        alignContent: "flex-start",
        alignItems: "center",
    },

    dutyTypeGroup: {
        gap: 8,
    },
    dutyTypeItemBox: {
        position: "relative",
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 14,
        backgroundColor: `#CADCE8`,
        borderRadius: 4,
    },
    iconThreeDotsAbsBox: {
        position: "absolute",
        right: 0,
        top: 0,
    },
    iconThreeDotsBtn: {
        padding: 12,
        borderRadius: 20,
    },
    dutyTypeItemContainer: {
        flexDirection: "column",
        gap: 10,
    },

    dutyTypeName: {
        color: "black",
    },
    dutyTypeNameContainer: {
        flexDirection: "row",
        gap: 4,
    },
    bulletBox: {
        position: "relative",
        top: 2,
    },
    bullet: {
        width: 3,
        height: 14,
        backgroundColor: `#0B3A82`,
        borderRadius: 1,
    },
    dutyTypeUserContainer: {
        gap: 10,
        paddingLeft: 16,
    },
    dutyTypeUser: {},
    dutyTypeUserName: {
        color: "black",
    },
    dutyTypeUserTeam: {
        color: "black",
        opacity: 0.75,
    },

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
        flex: 1,
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

    userCardWrapper: {
        position: "relative",
        paddingBottom: 16,
    },
    userCheckboxWrapper: {
        position: "absolute",
        right: 20,
        top: 20,
    },
});
