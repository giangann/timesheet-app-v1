import { TDutyFormAttendanceInfo, TDutyFormCreateDutyTypeFormField, TDutyFormCreateDutyTypeInfo } from "@/types";
import { createContext, useContext } from "react";

type TDutyFormCreateContext = {
  onAddDutyType: (newDutyType: TDutyFormCreateDutyTypeInfo) => void;
  onRemoveDutyType: (fieldArrayIndex: number) => void;
  formDutyTypes: TDutyFormCreateDutyTypeFormField[];
  updateDutyTypeUser: (fieldArrayIndex: number, user: TDutyFormAttendanceInfo, action: "add" | "remove") => void;
  dutyDate: Date | undefined;
};
export const DutyFormCreateContext = createContext<TDutyFormCreateContext>({
  onAddDutyType(_newDutyType) {},
  onRemoveDutyType(_fieldArrayIndex) {},
  formDutyTypes: [],
  updateDutyTypeUser(_fieldArrayIndex, _user, _action) {},
  dutyDate: undefined,
});

export const useDutyFormCreateContext = () => useContext(DutyFormCreateContext);
