export const UNIT_DIMENSION = 1;
export const UNIT_FONTSIZE = 1;

export enum FORM_STATUS {
  WATING_APPROVE = 0,
  ACCEPTED = 1,
  REJECTED = 2,
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
 * 1. Api lấy dữ liệu cho màn Hồ sơ cá nhân
 */
type Profile = {
  // team info
  numberOfTeamMember: number; // số thành viên trong team
  teamName: string;
  teamHotline: string;
  // salary info
  salaryCoef: number; // hệ số lương
  positionBonus: number; // phụ cấp chức vụ
  otherBonus: number; // phu cap khac
};

/**
 * 2. Api lấy dữ liệu cho màn Trang chủ
 */
type HomeData = {
  numberOfFormNeedApprove: number; // số đơn lãnh đạo chưa phê duyệt
  numberOfCurrentMonthTimeKeeping: number; // số ngày đã chám công trong tháng, chấp nhận 0.5 (vd: 19.5)
  haveTimeKeepingForTeamToday: boolean; // Văn thư hôm nay đã chấm công cho team hay chưa
  numberOfTeamMember: number; // số lượng thành viên của team.
  numberOfUnreadFormNoti: number; // số thông báo kiểu form chưa đọc
  haveTimeKeepingToday: boolean; // hôm nay người dùng đã được Văn thư chấm công hay chưa
  workingDayStartTime: string; // giờ bắt đầu làm việc của Phòng ban trong ngày làm việc
  workingDayEndTime: string; // giờ kết thúc làm việc của Phòng ban trong ngày làm việc
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
export type MonthTimesheet = {
  date: string; // (YYYY-MM-DD)
  workingTypeId: number | null; // 1 || 2 || null
  leaveFormId: number | null; // one of those: 1706:1702:1703:1708:1707:1705:1704:1803:1804:1802:1952:1953:1954 or null
  overtimeFormId: number | null; // one of those: 2:102 or null
  dutyFormId: number | null; // one of those: 254:304:352:353 or null
};
export type MonthTimesheetList =MonthTimesheet[]
// 1. Leave
// 1706:1702:1703:1708:1707:1705:1704:1803:1804:1802:1952:1953:1954

// 2. OT
// 2:102

// 3. Duty
// 254:304:352:353

export const timesheetMockResponse = {
  timesheet: [
    {
      date: "2024-09-01",
      workingTypeId: 1,
      leaveFormId: null,
      overtimeFormId: null,
      dutyFormId: 254,
    },
    {
      date: "2024-09-02",
      workingTypeId: 2,
      leaveFormId: 1706,
      overtimeFormId: null,
      dutyFormId: null,
    },
    {
      date: "2024-09-03",
      workingTypeId: null,
      leaveFormId: null,
      overtimeFormId: 2,
      dutyFormId: null,
    },
    {
      date: "2024-09-04",
      workingTypeId: 1,
      leaveFormId: null,
      overtimeFormId: null,
      dutyFormId: 304,
    },
    {
      date: "2024-09-05",
      workingTypeId: null,
      leaveFormId: null,
      overtimeFormId: null,
      dutyFormId: 352,
    },
    {
      date: "2024-09-06",
      workingTypeId: null,
      leaveFormId: null,
      overtimeFormId: null,
      dutyFormId: 353,
    },
    {
      date: "2024-09-07",
      workingTypeId: null,
      leaveFormId: 1702,
      overtimeFormId: null,
      dutyFormId: null,
    },
    {
      date: "2024-09-08",
      workingTypeId: 1,
      leaveFormId: 1703,
      overtimeFormId: null,
      dutyFormId: null,
    },
    {
      date: "2024-09-09",
      workingTypeId: 2,
      leaveFormId: 1708,
      overtimeFormId: 102,
      dutyFormId: null,
    },
    {
      date: "2024-09-10",
      workingTypeId: null,
      leaveFormId: null,
      overtimeFormId: null,
      dutyFormId: 353,
    },
    {
      date: "2024-09-11",
      workingTypeId: 1,
      leaveFormId: null,
      overtimeFormId: null,
      dutyFormId: 254,
    },
    {
      date: "2024-09-12",
      workingTypeId: null,
      leaveFormId: null,
      overtimeFormId: null,
      dutyFormId: 304,
    },
    {
      date: "2024-09-13",
      workingTypeId: 2,
      leaveFormId: 1705,
      overtimeFormId: 102,
      dutyFormId: null,
    },
  ],
};
