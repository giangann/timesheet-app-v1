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
