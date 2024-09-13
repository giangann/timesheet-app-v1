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
