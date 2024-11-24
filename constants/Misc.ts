import { TPagiParams } from "@/types";

export const UNIT_DIMENSION = 1;
export const UNIT_FONTSIZE = 1;

export enum FORM_STATUS {
  WATING_APPROVE = 0,
  ACCEPTED = 1,
  REJECTED = 2,
}

export enum FORM_NOTI_TYPE {
  LEAVE_FORM = "leaveForm",
  OVERTIME_FORM = "overtimeForm",
  DUTY_FORM = "dutyForm",
}
export enum FORM_NOTI_ACTION_TYPE {
  APPROVE_FORM = "APPROVE_FORM",
  NEW_FORM = "NEW_FORM",
}

export const FORM_NOTI_NAME = {
  [FORM_NOTI_TYPE.LEAVE_FORM]: "Đơn xin nghỉ",
  [FORM_NOTI_TYPE.OVERTIME_FORM]: "Đơn tăng ca",
  [FORM_NOTI_TYPE.DUTY_FORM]: "Đơn trực",
};

export const FORM_STATUS_NAME = {
  [FORM_STATUS.WATING_APPROVE]: "Chờ phê duyệt",
  [FORM_STATUS.ACCEPTED]: "Chấp thuận",
  [FORM_STATUS.REJECTED]: "Từ chối",
};

export enum ROLE_CODE {
  DEPARTMENT_DIRECTOR = "DEPARTMENT_DIRECTOR",
  TEAM_DIRECTOR = "TEAM_DIRECTOR",
  ARCHIVIST = "ARCHIVIST",
  ADMIN = "ADMIN",
  SPECIALIST = "SPECIALIST",
}

// FOR TIMESHEET
export enum WORKING_TYPE {
  ALL = 1,
  HALF = 2,
}
export const WORKING_TYPE_COLOR = {
  [WORKING_TYPE.ALL]: "#067D4E",
  [WORKING_TYPE.HALF]: "#FF9C01",
};
export const WORKING_TYPE_NULL_COLOR = "#F31121";

export enum TIMESHEET_FORM_TYPE {
  LEAVE = 1,
  OT = 2,
  DUTY = 3,
}
export const TIMESHEET_FORM_TYPE_COLOR = {
  [TIMESHEET_FORM_TYPE.LEAVE]: "#AF32D0",
  [TIMESHEET_FORM_TYPE.OT]: "#0B67CC",
  [TIMESHEET_FORM_TYPE.DUTY]: "#000000",
};

export enum NOTI_STATUS {
  UNREAD = 0,
  READ = 1,
}

export const DEFAULT_PAGI_PARAMS: TPagiParams = {
  page: 0,
  size: 5,
};

export const DEFAULT_DATE_RANGE_DUTY_CALENDAR = {
  startDate: "2020-01-01",
  endDate: "2030-12-31",
};

export type TFakeDutyType = {
  id: number;
  dutyTypeName: string;
};
