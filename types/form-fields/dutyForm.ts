export type TDutyFormAttendanceInfo = {
  id: number;
  teamId: number;
  name: string;
  teamName: string;
  roleCode: string;
  roleName: string;
  numOnDuty: number;
  isChecked: boolean;
};

export type TDutyFormCreateDutyTypeInfo = {
  dutyTypeId: number;
  dutyTypeName: string;
};
export type TDutyFormCreateDutyTypeFormField = {
  dutyTypeUsers: TDutyFormAttendanceInfo[];
} & TDutyFormCreateDutyTypeInfo;

export type TDutyFormCreateFormField = {
  date: Date;
  startTime: Date;
  endTime: Date;
  dutyTypes: TDutyFormCreateDutyTypeFormField[];
  userApproveIdentifyCard: string;
  note?: string | null;
  salaryCoefficientTypeId: number;
  attachFile?: File | null;
};

export type TDutyFormEditFormField = {
  date?: Date;
  startTime?: Date;
  endTime?: Date;
  note?: string;
  salaryCoefficientTypeId?: number;
  attachFile?: File;
  dutyTypes?: TDutyFormCreateDutyTypeFormField[];
};
