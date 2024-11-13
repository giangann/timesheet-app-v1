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
  userApproveIdentifyCard: string;
  note: string;
  reason: string | null;
  approveDate: string | null;
  createdAt: string;
  attachFilePath: string;
  isDeleted: boolean;
  dutyTypeName: string;
  salaryCoefficientTypeName: string;
  salaryCoefficient: number;
  users: TFormUserApply[];
  userTeam: {
    id: number;
    name: string;
    code: string | null;
    hotline: string | null;
  };
  userApproveRole: {
    id: number;
    code: ROLE_CODE;
    name: string;
  };
};

export type TApproveDutyForm = {
  id: number;
  startTime: string;
  endTime: string;
  date: string;
  status: FORM_STATUS;
  userApproveName: string;
  userApproveIdentifyCard: string;
  note: string;
  reason: string | null;
  approveDate: string | null;
  createdAt: string;
  attachFilePath: string;
  isDeleted: boolean;
  dutyTypeName: string;
  salaryCoefficientTypeName: string;
  salaryCoefficient: number;
  users: [
    {
      name: string;
      identifyCard: string;
      roleId: number;
      roleName: string;
      roleCode: ROLE_CODE;
    }
  ];
  userTeam: {
    id: number;
    name: string;
    code: string | null;
    hotline: string | null;
  };
  userApproveRole: {
    id: number;
    code: ROLE_CODE;
    name: string;
  };
};

export type TDutyFormDetail = {
  id: number;
  dutyCalendar: {
    startTime: string;
    endTime: string;
    date: string;
    salaryCoefficientType: {
      id: number;
      name: string;
      coefficient: number;
    };
    dutyType: {
      id: number;
      name: string;
    };
  };
  attachFile: {
    id: number;
    name: string;
    type: string;
    path: string;
    url: string;
  };
  userApproveIdentifyCard: string;
  note: string;

  userApproveName: string;
  reason: string | null;
  status: FORM_STATUS;
  approveDate: string | null;

  userApproveTeam: {
    id: number;
    name: string;
    code: string | null;
    hotline: string | null;
  };
  userApproveRole: {
    id: number;
    code: ROLE_CODE;
    name: string;
  };
  users: {
    name: string;
    identifyCard: string;
    roleId: number;
    roleName: string;
    roleCode: ROLE_CODE;
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
  attachFile?: File | null;
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
  createdAt?: string;
};
export type TApproveDutyFormFilterParams = {
  status?: FORM_STATUS | null;
  createdAt?: string;
};

export type TDutySuggestedUser = {
  name: string;
  id: number;
  teamName: string;
  roleName: string;
  roleCode: string;
  teamCode: string | null;
  numOnDuty: number;
  identifyCard: string;
};

export type TDutySuggestedUserFilterParams = {
  startDate: string;
  endDate: string;
  date: string;
  sort?: string;
};

/*
const sampleResponse = {
  message: "Yêu cầu phê duyệt",
  obj: {
    approveDate: null,
    attachFileId: 2265,
    createdAt: "2024-09-24T16:14:04.041+00:00",
    dutyCalendarId: 1,
    id: 402,
    isDeleted: false,
    note: "trực",
    reason: null,
    status: 0,
    updatedAt: "2024-09-24T16:14:04.041+00:00",
    userApproveId: 102,
  },
  status: 0,
  timestamp: "2024-09-24T23:14:04.046844258",
  title: "Thông báo",
  type: "dutyForm",
};
*/
