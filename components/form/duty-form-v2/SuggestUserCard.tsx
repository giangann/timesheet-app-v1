import { TDutyFormAttendanceInfo } from "@/types";
import { memo, useCallback, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Avatar, Card, Checkbox, Text, TouchableRipple } from "react-native-paper";

type SuggestUserItemProps = {
    user: TDutyFormAttendanceInfo;
    isChecked: boolean;
    onSelectUser: (user: TDutyFormAttendanceInfo) => void
};
export const SuggestUserCard: React.FC<SuggestUserItemProps> = memo(({ user, isChecked, onSelectUser }) => {
    const [checked, setChecked] = useState(isChecked)

    const LeftContent = (props: any) => <Avatar.Icon {...props} icon="account" />;


    const onPressUserCard = useCallback(() => {
        onSelectUser(user)
        setChecked((prev) => !prev)
    }, [user, setChecked, onSelectUser]);

    return (
        <Card style={styles.card}>
            <TouchableRipple borderless rippleColor="rgba(0, 0, 0, .32)" onPress={onPressUserCard}>
                <View style={styles.userCardWrapper}>
                    <Card.Title title={user.name} subtitle={`P. ${user.teamName}`} left={LeftContent} />
                    <Card.Content>
                        <Text variant="bodyMedium">Chức vụ: {user.roleName}</Text>
                        <Text variant="bodyMedium">Số lần trực: {user.numOnDuty}</Text>
                    </Card.Content>
                    <View style={styles.userCheckboxWrapper}>
                        <Checkbox status={checked ? "checked" : "unchecked"} />
                    </View>
                </View>
            </TouchableRipple>
        </Card>
    );
});

const styles = StyleSheet.create({
    card: {},
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
