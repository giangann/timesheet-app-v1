import { FORM_STATUS, ROLE_CODE } from "@/constants/Misc";

export type TDutyFormDetail = {
  id:number,
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
