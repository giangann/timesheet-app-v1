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
  OT_OR_DUTY = 2,
}
export const TIMESHEET_FORM_TYPE_COLOR = {
  [TIMESHEET_FORM_TYPE.LEAVE]: "#AF32D0",
  [TIMESHEET_FORM_TYPE.OT_OR_DUTY]: "#0B67CC",
};

export enum NOTI_STATUS {
  UNREAD = 0,
  READ = 1,
}

export const DEFAULT_PAGI_PARAMS: TPagiParams = {
  page: 0,
  size: 5,
};
//

// const SAMPLE_RESPONSE_JSON = {
//   data: {
//     user: {
//       address: "No add",
//       email: "dmc@gmail.com",
//       identifyCard: "000000001111",
//       name: "Đặng Minh Chính",
//       phone: "00000000000",
//       roleCode: "TEAM_DIRECTOR",
//       roleName: "Lãnh đạo phòng",
//     },
//   },
//   status: "OK",
//   statusCode: 200,
//   timestamp: "2024-09-08T11:57:19.672520792",
// };

/**
 * 3. Api bảng chấm công
 * params:{
 *    month: string, (YYYY-MM)
 *    userIdentifyCard: string
 * }
 *
 * response trả về data có độ dài từ ngày đầu của tháng đến ngày hiện tại
 * VD: hôm nay: 13/09/2024 => data.timesheet.length = 13
 */
// export type MonthTimesheet = {
//   date: string; // (YYYY-MM-DD)
//   workingTypeId: number | null; // 1 || 2 || null
//   leaveFormId: number | null; // one of those: 1706:1702:1703:1708:1707:1705:1704:1803:1804:1802:1952:1953:1954 or null
//   overtimeFormId: number | null; // one of those: 2:102 or null
//   dutyFormId: number | null; // one of those: 254:304:352:353 or null
// };
// export type MonthTimesheetList = MonthTimesheet[];
// 1. Leave
// 1706:1702:1703:1708:1707:1705:1704:1803:1804:1802:1952:1953:1954

// 2. OT
// 2:102

// 3. Duty
// 254:304:352:353

/**
1-Cả công; 
2-Nửa  công; 
null-Không

WK_TYPE: border color
WkType 1: #067D4E
WkType 2: #FF9C01
WkType null: #F31121

HAS_FORM: dot
Has Leave Form: #AF32D0
Has Duty/OT Form: #0B67CC
*/

export const _mockExcelDownloadLink =
  "https://drive.usercontent.google.com/download?id=14XTWaLyXSwQHFLfvcE6NOAPs_397okz5&export=download&authuser=0&confirm=t&uuid=fd8dddb5-1899-4831-94a4-95a9b9cd1c35&at=AN_67v162qd6Nz2J5xwMQEZXu8hf:1727430176186";
