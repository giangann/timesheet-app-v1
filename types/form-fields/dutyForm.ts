export type TDutyFormCreateDutyTypeFormField = {
  dutyTypeId: number;
  dutyTypeName: string;
  userIds: number[];
};

export type TDutyFormCreateFormField = {
  date: string;
  startTime: string;
  endTime: string;
  dutyTypes: TDutyFormCreateDutyTypeFormField[];
  userApproveIdentifyCard: string;
  note?: string | null;
  salaryCoefficientTypeId: number;
  attachFile?: File | null;
};
