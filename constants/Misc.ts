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

export const delcoEggToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InVzZXJJZCI6IjEifSwiaWF0IjoxNzI2MjI5OTI5LCJleHAiOjE3Mjg4MjE5Mjl9.NW5HBpGLOlPiDPtsOaKfTmSZmuUofwS34XtmxiMPork";

export const user = {
  createdAt: "2024-01-21T03:55:29.000Z",
  updatedAt: "2024-03-10T03:30:28.000Z",
  id: 1,
  username: "admin_giangann@gmail.com",
  phone_number: "0901521738",
  fullname: "Admin Giang An",
  isAdmin: true,
  company_name: "Delco Farm",
  note: null,
};

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

export const timesheetMockResponse = {
  timesheet: [
    {
      date: "2024-09-01",
      workingTypeId: null,
      leaveFormId: null,
      overtimeFormId: null,
      dutyFormId: 254,
    },
    {
      date: "2024-09-02",
      workingTypeId: 1,
      leaveFormId: 1802,
      overtimeFormId: null,
      dutyFormId: null,
    },
    {
      date: "2024-09-03",
      workingTypeId: 1,
      leaveFormId: null,
      overtimeFormId: null,
      dutyFormId: null,
    },
    {
      date: "2024-09-04",
      workingTypeId: 1,
      leaveFormId: 1804,
      overtimeFormId: 2,
      dutyFormId: null,
    },
    {
      date: "2024-09-05",
      workingTypeId: 1,
      leaveFormId: null,
      overtimeFormId: null,
      dutyFormId: null,
    },
    {
      date: "2024-09-06",
      workingTypeId: 2,
      leaveFormId: null,
      overtimeFormId: 102,
      dutyFormId: null,
    },
    {
      date: "2024-09-07",
      workingTypeId: null,
      leaveFormId: null,
      overtimeFormId: null,
      dutyFormId: 152,
    },
    {
      date: "2024-09-08",
      workingTypeId: null,
      leaveFormId: null,
      overtimeFormId: null,
      dutyFormId: null,
    },
    {
      date: "2024-09-09",
      workingTypeId: 1,
      leaveFormId: 1804,
      overtimeFormId: 102,
      dutyFormId: null,
    },
    {
      date: "2024-09-10",
      workingTypeId: 2,
      leaveFormId: null,
      overtimeFormId: null,
      dutyFormId: null,
    },
    {
      date: "2024-09-11",
      workingTypeId: 1,
      leaveFormId: null,
      overtimeFormId: null,
      dutyFormId: null,
    },
    {
      date: "2024-09-12",
      workingTypeId: 1,
      leaveFormId: null,
      overtimeFormId: 2,
      dutyFormId: null,
    },
    {
      date: "2024-09-13",
      workingTypeId: null,
      leaveFormId: null,
      overtimeFormId: null,
      dutyFormId: null,
    },
  ],
};
