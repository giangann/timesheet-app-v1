import { NunitoText } from "@/components/text/NunitoText";
import { OPACITY_TO_HEX } from "@/constants/Colors";
import { useDutyFormCreateProvider } from "@/providers";
import { TDutyFormCreateDutyTypeFormField } from "@/types";
import { NoData } from "@/ui/NoData";
import { Entypo } from "@expo/vector-icons";
import React, { memo, useCallback, useMemo, useState } from "react";
import { StyleSheet, TouchableHighlight, View } from "react-native";
import { Divider, Menu } from "react-native-paper";
import { SelectDutyUsersModal } from "./SelectDutyUsersModal";

export const SelectedDutyTypes: React.FC = memo(() => {
    const { useFieldArrayReturn } = useDutyFormCreateProvider()

    return (
        <View>
            {useFieldArrayReturn?.fields?.map((field, index) =>
                <SelectedDutyType fieldArrayIndex={index} dutyTypeInfo={field} />
            )}
        </View>
    )
})

type SelectedDutyTypeProps = {
    fieldArrayIndex: number;
    dutyTypeInfo: TDutyFormCreateDutyTypeFormField;
};
export const SelectedDutyType: React.FC<SelectedDutyTypeProps> = memo(({ dutyTypeInfo, fieldArrayIndex }) => {
    // States
    const [visible, setVisible] = useState(false);

    // Hooks
    const { useFieldArrayReturn, openSelectUsersModal, setOpenSelectUsersModal } = useDutyFormCreateProvider()

    // Variables
    const isNoUser = useMemo(() => dutyTypeInfo.dutyTypeUsers.length <= 0, [dutyTypeInfo]);

    // Handlers
    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);

    const openFullScrModal = () => setOpenSelectUsersModal(true);
    const closeFullScrModal = () => {
        setOpenSelectUsersModal(false);
    };

    const onRemoveDutyType = useCallback(
        (index: number) => {
            useFieldArrayReturn?.remove(index);
        },
        [useFieldArrayReturn]
    );


    // press delete item of menu handler
    const onPressAttendee = useCallback(() => {
        closeMenu();
        openFullScrModal();
    }, []);
    const onPressDelete = useCallback(() => {
        onRemoveDutyType(fieldArrayIndex);
    }, [onRemoveDutyType, fieldArrayIndex]);

    return (
        <View style={styles.dutyTypeItemBox}>
            <View style={styles.dutyTypeItemContainer}>
                {/* Duty name */}
                <View style={styles.dutyTypeNameContainer}>
                    <View style={styles.bulletBox}>
                        <View style={styles.bullet} />
                    </View>
                    <NunitoText type="body2" style={styles.dutyTypeName}>
                        {dutyTypeInfo.dutyTypeName}
                    </NunitoText>
                </View>

                {/* Duty users */}
                {isNoUser && (
                    <View>
                        <NoData message="Chưa có thành viên được chọn" />
                    </View>
                )}

                {!isNoUser && (
                    <View style={styles.dutyTypeUserContainer}>
                        {dutyTypeInfo.dutyTypeUsers.map((user) => (
                            <View style={styles.dutyTypeUser} key={user.id}>
                                <NunitoText type="body3" style={styles.dutyTypeUserName}>
                                    {`${user.name} - ${user.roleName}`}
                                </NunitoText>
                                <NunitoText type="body4" style={styles.dutyTypeUserTeam}>
                                    {user.teamName}
                                </NunitoText>
                            </View>
                        ))}
                    </View>
                )}
            </View>

            {/* Menu */}
            <View style={styles.iconThreeDotsAbsBox}>
                <Menu
                    visible={visible}
                    onDismiss={closeMenu}
                    anchor={
                        <TouchableHighlight underlayColor={`#000000${OPACITY_TO_HEX["15"]}`} onPress={openMenu} style={styles.iconThreeDotsBtn}>
                            <Entypo name="dots-three-vertical" size={18} color="black" />
                        </TouchableHighlight>
                    }
                >
                    <Menu.Item onPress={onPressAttendee} title="Thành viên" />
                    <Divider />
                    <Menu.Item onPress={onPressDelete} title="Xóa" />
                </Menu>
            </View>

            {/* Select users modal */}
            {openSelectUsersModal && <SelectDutyUsersModal />}
        </View>
    )
})

const styles = StyleSheet.create({
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
});
