import { TDutyFormAttendanceInfo, TDutyFormCreateDutyTypeFormField, TDutyFormCreateDutyTypeInfo } from "@/types";
import { createContext, useContext } from "react";

type TDutyFormCreateContext = {
  updateUserApproves: () => void;
  onAddDutyType: (newDutyType: TDutyFormCreateDutyTypeInfo) => void;
  onRemoveDutyType: (fieldArrayIndex: number) => void;
  formDutyTypes: TDutyFormCreateDutyTypeFormField[];
  updateDutyTypeUser: (fieldArrayIndex: number, user: TDutyFormAttendanceInfo, action: "add" | "remove") => void;
};
export const DutyFormCreateContext = createContext<TDutyFormCreateContext>({
  updateUserApproves() {},
  onAddDutyType(_newDutyType) {},
  onRemoveDutyType(_fieldArrayIndex) {},
  formDutyTypes: [],
  updateDutyTypeUser(_fieldArrayIndex, _user, _action) {},
});

export const useDutyFormCreateContext = () => useContext(DutyFormCreateContext);
