import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import { useFocusEffect } from "expo-router";
import * as ScreenOrientation from "expo-screen-orientation";
import { memo, useCallback, useMemo, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Button } from "react-native-paper";
import { MyModal } from "../MyModal";

type Props = {}
export const ChooseOrientation: React.FC<Props> = memo(({ }) => {
    const [open, setOpen] = useState(false)
    const theme = useTheme();

    const onOpenModal = useCallback(() => setOpen(true), [])
    const onCloseModal = useCallback(() => setOpen(false), [])

    useFocusEffect(
        useCallback(() => {

            function unlockLandscape() {
                console.log("Unlock async to:", ScreenOrientation.OrientationLock.DEFAULT);
                ScreenOrientation.unlockAsync();
            }

            return () => {
                setTimeout(unlockLandscape, 100);
            };
        }, [])
    );


    return (
        <View style={{marginRight:12}}>
            <TouchableOpacity
                hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
                activeOpacity={0.6}
                onPress={onOpenModal}>
                <MaterialCommunityIcons
                    name="phone-rotate-landscape"
                    size={24}
                    color={theme.colors.text}
                />
            </TouchableOpacity>

            {open && <OrientationModal onCloseModal={onCloseModal} />}
        </View>
    )
})

type OrientationModalProps = {
    onCloseModal: () => void
}
type OrientationOption = {
    label: string,
    targetOrientation: ScreenOrientation.OrientationLock
}
const OrientationModal: React.FC<OrientationModalProps> = memo(({ onCloseModal }) => {
    const [currentOrientation, setCurrentOrientation] = useState<ScreenOrientation.Orientation>(ScreenOrientation.Orientation.UNKNOWN)
    const options: OrientationOption[] = useMemo(() => [
        {
            label: 'Xoay dọc lên',
            targetOrientation: ScreenOrientation.OrientationLock.PORTRAIT_UP,
        },
        {
            label: 'Xoay dọc xuống',
            targetOrientation: ScreenOrientation.OrientationLock.PORTRAIT_DOWN,
        },
        {
            label: 'Xoay ngang trái',
            targetOrientation: ScreenOrientation.OrientationLock.LANDSCAPE_LEFT,
        },
        {
            label: 'Xoay ngang phải',
            targetOrientation: ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT,
        },
    ], []);
    // A mapping function from Orientation to OrientationLock
    const mapOrientationToLock = useCallback((orientation: ScreenOrientation.Orientation): ScreenOrientation.OrientationLock => {
        switch (orientation) {
            case ScreenOrientation.Orientation.PORTRAIT_UP:
                return ScreenOrientation.OrientationLock.PORTRAIT_UP;
            case ScreenOrientation.Orientation.PORTRAIT_DOWN:
                return ScreenOrientation.OrientationLock.PORTRAIT_DOWN;
            case ScreenOrientation.Orientation.LANDSCAPE_LEFT:
                return ScreenOrientation.OrientationLock.LANDSCAPE_LEFT;
            case ScreenOrientation.Orientation.LANDSCAPE_RIGHT:
                return ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT;
            default:
                return ScreenOrientation.OrientationLock.DEFAULT;
        }
    }, []);

    const onOptionPress = useCallback((targetOrientation: ScreenOrientation.OrientationLock) => {
        ScreenOrientation.lockAsync(targetOrientation)
        onCloseModal()
    }, [ScreenOrientation, onCloseModal])

    useFocusEffect(useCallback(() => {
        async function getOrientation() {
            const orientation = await ScreenOrientation.getOrientationAsync()
            setCurrentOrientation(orientation)
        }
        getOrientation()
    }, [ScreenOrientation]))

    return (
        <MyModal onClose={onCloseModal} isNeedAccept={false} modalProps={{ animationType: 'fade', transparent: true }} >
            <View style={styles.options}>
                {options.map((opt, index) =>
                    <Button key={index} onPress={() => onOptionPress(opt.targetOrientation)} textColor={opt.targetOrientation === mapOrientationToLock(currentOrientation) ? 'green' : ''}>
                        {opt.label}
                    </Button>
                )}
            </View>
        </MyModal>

    )

})

const styles = StyleSheet.create({
    options: {
        gap: 12
    }
})