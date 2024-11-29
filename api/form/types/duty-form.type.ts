import { FORM_NOTI_TYPE, FORM_STATUS, NOTI_STATUS, ROLE_CODE } from "@/constants/Misc";
export type TFormUserApply = {
  name: string;
  identifyCard: string;
  roleId: number;
  roleName: string;
  roleCode: string;
};

export type TDutyForm = {
  id: number;
  startTime: string;
  endTime: string;
  date: string;
  status: FORM_STATUS;

  userApproveName: string;
  userApproveRoleName: string;
  userApproveTeamName: string;
  userApproveRoleCode: string;

  createdUserRoleCode: string;
  createdUserName: string;
  createdUserRoleName: string;
  createdUserTeamName: string;

  dutyTypeNames: string[];
  salaryCoefficient: number;
  salaryCoefficientTypeName: string;

  userNames: {
    name: string;
    roleCode: ROLE_CODE;
    identifyCard: string;
  }[];

  note: string;
  reason: string | null;
  approveDate: string | null;
  createdAt: string;
  attachFilePath: string;
};

export type TApproveDutyForm = {
  id: number;
  startTime: string;
  endTime: string;
  date: string;
  status: FORM_STATUS;

  userApproveName: string;
  userApproveRoleName: string;
  userApproveTeamName: string;
  userApproveRoleCode: string;

  createdUserRoleCode: string;
  createdUserName: string;
  createdUserRoleName: string;
  createdUserTeamName: string;

  dutyTypeNames: string[];
  salaryCoefficient: number;
  salaryCoefficientTypeName: string;

  userNames: string[];

  note: string;
  reason: string | null;
  approveDate: string | null;
  createdAt: string;
  attachFilePath: string;
};

export type TDutyFormDetail = {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
  reason: string | null;
  status: FORM_STATUS;
  approveDate: string | null;
  note: string | null;
  createdAt: string;
  createdUserId: number;
  createdUserName: string;
  approvedUserId: number;
  approvedUserName: string;
  userApproveRoleCode: ROLE_CODE;
  salaryCoefficientTypeId: number;
  salaryCoefficientTypeName: string;
  salaryCoefficient: number;
  attachFileId: number | null;
  attachFilePath: string;
  attachFileUrl: string | null;
  dutyTypes: TDutyFormDetailDutyType[];
};
export type TDutyFormDetailDutyType = {
  id: number;
  dutyTypeName: string;
  users: {
    id: number;
    name: string;
    roleName: string;
    roleId: number;
    teamName: string;
    teamId: number;
  }[];
};

export type TDutyFormCreateDutyTypeField = {
  dutyTypeId: number;
  userIds: number[];
};
export type TDutyFormCreate = {
  date: string;
  startTime: string;
  endTime: string;
  dutyTypes: TDutyFormCreateDutyTypeField[];
  userApproveIdentifyCard: string;
  note?: string | null;
  salaryCoefficientTypeId: number;
  attachFileId?: number | null;
};

export type TDutyFormEditDutyTypeField = {
  dutyTypeId: number;
  userIds: number[];
};
export type TDutyFormEdit = {
  startTime?: string;
  endTime?: string;
  note?: string;
  salaryCoefficientTypeId?: number;
  attachFileId?: number;
  dutyTypes?: TDutyFormEditDutyTypeField[];
};

export type TDutyFormCreateNoti = {
  message: string;
  obj: {
    approveDate: string | null;
    attachFileId: number;
    createdAt: string;
    dutyCalendarId: number;
    id: number;
    isDeleted: boolean;
    note: string;
    reason: string | null;
    status: FORM_STATUS;
    updatedAt: string;
    userApproveId: number;
  };
  status: NOTI_STATUS;
  timestamp: string | number | null;
  title: string;
  type: FORM_NOTI_TYPE.DUTY_FORM;
};
export type TDutyFormFilterParams = {
  status?: FORM_STATUS | null;
  startCreatedAt?: string;
  endCreatedAt?: string;
};
export type TApproveDutyFormFilterParams = {
  status?: FORM_STATUS | null;
  startCreatedAt?: string;
  endCreatedAt?: string;
};

export type TDutySuggestedUser = {
  name: string;
  id: number;
  teamName: string;
  roleName: string;
  roleCode: string;
  teamCode: string | null;
  teamId: number;
  numOnDuty: number;
  identifyCard: string;
};

export type TDutySuggestedUserFilterParams = {
  startDate: string;
  endDate: string;
  date: string;
  dutyTypeId: number;
  sort?: string;
};

export type TDutySuggestedUserFilterParamsFormFields = {
  startDate: Date | undefined;
  endDate: Date | undefined;
  date: Date | undefined;
  dutyTypeId: number;
  sort?: string;
};
