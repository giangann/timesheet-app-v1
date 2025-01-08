import { defaultDutyFormTime } from "@/helper/date";
import { TDutyFormCreateFormField } from "@/types";
import { createContext, Dispatch, SetStateAction, useContext, useState } from "react"
import { UseFieldArrayReturn, UseFormReturn, useFieldArray, useForm } from "react-hook-form";

// TYPES
export type TSelectingDutyType = {
    id: number,
    name: string
}
export type TDutyFormCreateContext = {
    useFormReturn: UseFormReturn<TDutyFormCreateFormField> | null,
    useFieldArrayReturn: UseFieldArrayReturn<TDutyFormCreateFormField, 'dutyTypes'> | null,

    openSelectDutyTypeModal: boolean,
    setOpenSelectDutyTypeModal: Dispatch<SetStateAction<boolean>>,
    openSelectUsersModal: boolean,
    setOpenSelectUsersModal: Dispatch<SetStateAction<boolean>>,

    selectingDutyType: TSelectingDutyType | null,
    setSelectingDutyType: Dispatch<SetStateAction<TSelectingDutyType | null>>
}

// CONTEXT
export const DutyFormCreateContext = createContext<TDutyFormCreateContext>({
    useFormReturn: null,
    useFieldArrayReturn: null,

    openSelectDutyTypeModal: false,
    setOpenSelectDutyTypeModal: (_value) => { },
    openSelectUsersModal: false,
    setOpenSelectUsersModal: (_value) => { },

    selectingDutyType: null,
    setSelectingDutyType: (_value) => { }
})

// HOOKS
export const useDutyFormCreateProvider = () => useContext(DutyFormCreateContext)

// PROVIDERS
type Props = {
    children: React.ReactNode
}
export const DutyFormCreateProvider: React.FC<Props> = ({ children }) => {
    const useFormReturn = useForm<TDutyFormCreateFormField>({ defaultValues: { startTime: defaultDutyFormTime().startTime, endTime: defaultDutyFormTime().endTime } })
    const useFieldArrayReturn = useFieldArray({ name: 'dutyTypes', control: useFormReturn.control })

    const [openSelectDutyTypeModal, setOpenSelectDutyTypeModal] = useState<boolean>(false)
    const [openSelectUsersModal, setOpenSelectUsersModal] = useState<boolean>(false)

    const [selectingDutyType, setSelectingDutyType] = useState<TSelectingDutyType | null>(null)

    return <DutyFormCreateContext.Provider value={{
        useFormReturn, useFieldArrayReturn, openSelectDutyTypeModal, setOpenSelectDutyTypeModal, openSelectUsersModal, setOpenSelectUsersModal, selectingDutyType, setSelectingDutyType,
    }}>{children}</DutyFormCreateContext.Provider>
}