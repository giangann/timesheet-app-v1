import { FORM_NOTI_TYPE, FORM_STATUS, NOTI_STATUS, ROLE_CODE } from "@/constants/Misc";
export type TOvertimeForm = {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
  userApproveIdentifyCard: string;
  userApproveName: string;
  note: string;
  status: FORM_STATUS;
  isDeleted: boolean;
  typeOfWorking: any;
  reason: string | null;
  approveDate: string | null;
  attachFilePath: string;
  salaryCoefficientName: string;
  salaryCoefficient: number;
  userName: string;
  userIdentifyCard: string;
  createdAt:string;
  userRole: {
    id: number;
    code: string;
    name: string;
  };
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

export type TApproveOvertimeForm = {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
  userApproveIdentifyCard: string;
  userApproveName: string;
  note: string;
  status: FORM_STATUS;
  isDeleted: boolean;
  typeOfWorking: any;
  reason: string | null;
  approveDate: string | null;
  attachFilePath: string;
  salaryCoefficientName: string;
  salaryCoefficient: number;
  userName: string;
  userIdentifyCard: string;
  createdAt:string;
  userRole: {
    id: number;
    code: ROLE_CODE;
    name: string;
  };
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
export type TOvertimeFormDetail = {
  id: number;
  userIdentifyCard: string;
  userName: string;
  note: string;
  attachFilePath: string;
  status: number;
  userRole: {
    id: number;
    code: string;
    name: string;
  };
  userTeam: {
    id: number;
    name: string;
    code: string | null;
    hotline: string;
  };
  reason: string | null;
  userApproveRole: {
    id: number;
    code: string;
    name: string;
  };
  userApproveIdentifyCard: string;
  userApproveName: string;
  approveDate: string | null;

  date: string;
  startTime: string;
  endTime: string;
  typeOfWorking: string | null;
  salaryCoefficientType: {
    id: number;
    name: string;
    coefficient: number;
  };
};

export type TOvertimeFormCreateNoti = {
  message: string;
  obj: {
    approveDate: string | null;
    attachFileId: number;
    createdAt: string;
    date: string;
    startTime: string;
    endTime: string;
    id: number;
    isDeleted: boolean;
    note: string;
    reason: string | null;
    salaryCoefficientTypeId: number;
    status: FORM_STATUS;
    updatedAt: string;
    typeOfWorking: string | number | null;
    userApproveId: number;
    userId: number;
  };
  status: NOTI_STATUS;
  timestamp: string | number | null;
  title: string;
  type: FORM_NOTI_TYPE.OVERTIME_FORM;
};

export type TOvertimeFormFilterParams = {
  status?: FORM_STATUS | null;
  createdAt?: string;
};

export type TApproveOvertimeFormFilterParams = {
  status?: FORM_STATUS | null;
  createdAt?: string;
};
/*
const sampleResponse = {
  message: "Yêu cầu phê duyệt",
  obj: {
    approveDate: null,
    attachFileId: 2264,
    createdAt: "2024-09-24T16:06:03.924+00:00",
    date: "2024-09-11",
    endTime: "15:30:00",
    id: 153,
    isDeleted: false,
    note: "suwar may tinh",
    reason: null,
    salaryCoefficientTypeId: 1,
    startTime: "10:30:00",
    status: 0,
    typeOfWorking: null,
    updatedAt: "2024-09-24T16:06:03.924+00:00",
    userApproveId: 102,
    userId: 104,
  },
  status: 0,
  timestamp: "2024-09-24T23:06:03.924776263",
  title: "Thông báo",
  type: "overtimeForm",
};
*/
