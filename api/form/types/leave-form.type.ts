import { FORM_NOTI_TYPE, FORM_STATUS, NOTI_STATUS, ROLE_CODE } from "@/constants/Misc";

export type TLeaveType = {
  id: number;
  name: string;
};
export type TLeaveFormCreateFormFields = {
  startDate: string | Date;
  endDate: string | Date;
  leaveFormTypeId: number;
  userApproveIdentifyCard: string;
  attachFile: File | null;
  note: string | null;
};
export type TLeaveFormEditFormFields = Partial<TLeaveFormCreateFormFields>;

export type TLeaveForm = {
  id: number;
  startDate: string;
  endDate: string;
  note: string;
  userIdentifyCard: string;
  userName: string;
  userApproveName: string;
  leaveFormTypeName: string;
  status: FORM_STATUS;
  filePath: string;
  isDeleted: false;
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
  userApproveRole: {
    id: number;
    name: string;
    code: ROLE_CODE;
  };

  createdAt: string;
  approveDate: string | null;
  reason: string | null;
  leaveFormTypeIsDisplayedOnWeekCalendar: boolean;
};

export type TApproveLeaveForm = {
  id: number;
  startDate: string;
  endDate: string;
  note: string;
  userIdentifyCard: string;
  userName: string;
  userApproveName: string;
  leaveFormTypeName: string;
  status: FORM_STATUS;
  filePath: string;
  isDeleted: boolean;
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
  userApproveIdentifyCard: string;
  approveDate: string;
  reason: string;
  createdAt: string;
  userApproveRole: {
    id: number;
    code: ROLE_CODE;
    name: string;
  };
  leaveFormTypeIsDisplayedOnWeekCalendar: boolean;
};

export type TLeaveFormDetail = {
  id: number;
  userIdentifyCard: string;
  userName: string;
  startDate: string;
  endDate: string;
  note: string;
  leaveFormType: string;
  leaveFormTypeId: number;
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
  leaveFormTypeIsDisplayedOnWeekCalendar: boolean;
};

export type TLeaveFormCreateNoti = {
  message: string;
  obj: {
    approveDate: string | null;
    attachFileId: number;
    createdAt: string;
    endDate: string;
    id: number;
    isDeleted: boolean;
    leaveFormTypeId: number;
    note: string;
    reason: string | null;
    startDate: string;
    status: FORM_STATUS;
    updatedAt: string;
    userApproveId: number;
    userId: number;
  };
  status: NOTI_STATUS;
  timestamp: string | number | null;
  title: string;
  type: FORM_NOTI_TYPE.LEAVE_FORM;
};

export type TLeaveFormFilterParams = {
  status?: FORM_STATUS | null;
  startCreatedAt?: string;
  endCreatedAt?: string;
};

export type TApproveLeaveFormFilterParams = {
  status?: FORM_STATUS | null;
  startCreatedAt?: string;
  endCreatedAt?: string;
};

/*
const sampleResponse = {
  message: "Yêu cầu phê duyệt",
  obj: {
    approveDate: null,
    attachFileId: 2262,
    createdAt: "2024-09-24T16:05:24.605+00:00",
    endDate: "2024-09-24T12:30:00",
    id: 2062,
    isDeleted: false,
    leaveFormTypeId: 1,
    note: "Test websocket",
    reason: null,
    startDate: "2024-09-24T07:30:00",
    status: 0,
    updatedAt: "2024-09-24T16:05:24.605+00:00",
    userApproveId: 102,
    userId: 104,
  },
  status: 0,
  timestamp: "2024-09-24T23:05:24.605171146",
  title: "Thông báo",
  type: "leaveForm",
};
*/
