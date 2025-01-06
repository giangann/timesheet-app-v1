import { TDutyType } from "@/api/setting/type"
import { Delayed } from "@/components/Delayed"
import { MySlideModal } from "@/components/MySlideModal"
import { useDutyTypes } from "@/hooks/form"
import { useDutyFormCreateProvider } from "@/providers"
import { NoData } from "@/ui/NoData"
import { SkeletonRectangleLoader } from "@/ui/skeletons"
import { memo, useCallback, useMemo } from "react"
import { View } from "react-native"
import { Button } from "react-native-paper"

export const SelectDutyTypeModal: React.FC = memo(() => {
    const { isLoading: isFetchingDutyTypes, dutyTypes } = useDutyTypes();
    const { setOpenSelectDutyTypeModal, useFieldArrayReturn, setOpenSelectUsersModal, setSelectingDutyType } = useDutyFormCreateProvider()

    const onClose = useCallback(() => {
        setOpenSelectDutyTypeModal(false)
    }, [])

    const selectedDutyTypes = useMemo(() => {
        const fields = useFieldArrayReturn?.fields ?? []
        // get dutytypesid array from fields
        const dutyTypeIds = fields.map((field) => field.dutyTypeId)

        return dutyTypeIds
    }, [useFieldArrayReturn])

    const notSelectedDutyTypes = useMemo(() => {
        return dutyTypes.filter((dutyType) => selectedDutyTypes.every((dtTypeId) => dtTypeId !== dutyType.id))
    }, [selectedDutyTypes, dutyTypes])

    const onSelectDutyType = useCallback((dutyType: TDutyType) => {
        setSelectingDutyType({ id: dutyType.id, name: dutyType.dutyTypeName })
        setOpenSelectUsersModal(true)
    }, [setSelectingDutyType, setOpenSelectUsersModal])

    return (
        <MySlideModal onClose={onClose}>
            <Delayed>
                {isFetchingDutyTypes && <SkeletonRectangleLoader height={100} />}
                {!isFetchingDutyTypes && (
                    <View>
                        {notSelectedDutyTypes.map((dutyType) => (
                            <Button key={dutyType.id} onPress={() => onSelectDutyType(dutyType)}>
                                {dutyType.dutyTypeName}
                            </Button>
                        ))}
                    </View>
                )}
                {!isFetchingDutyTypes && dutyTypes.length <= 0 && <NoData message="Không có loại trực" />}
            </Delayed>
        </MySlideModal>
    )
})