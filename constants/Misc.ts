import { TDutyType } from "@/api/setting/type";
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

export const DEFAULT_DATE_RANGE_DUTY_CALENDAR = {
  startDate: "2020-01-01",
  endDate: "2030-12-31",
};

export const _mockDutyTypes: TDutyType[] = [
  {
    dutyTypeName: "Trực kĩ thuật",
    teams: [
      {
        id: 153,
        name: "Hỗ trợ kỹ thuật",
        code: null,
        hotline: null,
        users: [
          {
            name: "Nguyễn Văn Tùng",
            email: null,
            address: null,
            phone: null,
            identifyCard: "001079008881",
            roleName: "Lãnh đạo phòng",
            roleCode: ROLE_CODE.TEAM_DIRECTOR,
          },
          {
            name: "Hà Đăng Dũng",
            email: null,
            address: null,
            phone: null,
            identifyCard: "001071006550",
            roleName: "Lãnh đạo phòng",
            roleCode: ROLE_CODE.TEAM_DIRECTOR,
          },
          {
            name: "Lê Thế Đạt",
            email: null,
            address: null,
            phone: null,
            identifyCard: "001078002960",
            roleName: "Chuyên viên",
            roleCode: ROLE_CODE.SPECIALIST,
          },
          {
            name: "Nguyễn Cao Cường",
            email: null,
            address: null,
            phone: null,
            identifyCard: "001081019700",
            roleName: "Chuyên viên",
            roleCode: ROLE_CODE.SPECIALIST,
          },
          {
            name: "Nguyễn Văn Sinh",
            email: null,
            address: null,
            phone: null,
            identifyCard: "030082001030",
            roleName: "Chuyên viên",
            roleCode: ROLE_CODE.SPECIALIST,
          },
        ],
      },
    ],
  },
  {
    dutyTypeName: "Trực cơ yếu",
    teams: [
      {
        id: 1,
        name: "cơ yếu",
        code: null,
        hotline: null,
        users: [
          {
            name: "Nguyễn Mạnh Hùng",
            email: null,
            address: null,
            phone: null,
            identifyCard: "035072001862",
            roleName: "Lãnh đạo phòng",
            roleCode: ROLE_CODE.TEAM_DIRECTOR,
          },
          {
            name: "Nguyễn Văn Hải",
            email: null,
            address: null,
            phone: null,
            identifyCard: "001073006920",
            roleName: "Lãnh đạo phòng",
            roleCode: ROLE_CODE.TEAM_DIRECTOR,
          },
          {
            name: "Trần Thị Tuyết Nhung",
            email: null,
            address: null,
            phone: null,
            identifyCard: "036179000875",
            roleName: "Lãnh đạo phòng",
            roleCode: ROLE_CODE.TEAM_DIRECTOR,
          },
          {
            name: "Vũ Ngọc Bằng",
            email: null,
            address: null,
            phone: null,
            identifyCard: "030078000695",
            roleName: "Chuyên viên",
            roleCode: ROLE_CODE.SPECIALIST,
          },
          {
            name: "Nguyễn Văn Quý",
            email: null,
            address: null,
            phone: null,
            identifyCard: "035083006087",
            roleName: "Chuyên viên",
            roleCode: ROLE_CODE.SPECIALIST,
          },
          {
            name: "Nguyễn Đức Thắng",
            email: null,
            address: null,
            phone: null,
            identifyCard: "027085000118",
            roleName: "Chuyên viên",
            roleCode: ROLE_CODE.SPECIALIST,
          },
          {
            name: "Nguyễn Công Đạt",
            email: null,
            address: null,
            phone: null,
            identifyCard: "040088004704",
            roleName: "Chuyên viên",
            roleCode: ROLE_CODE.SPECIALIST,
          },
          {
            name: "Phạm Ngọc Thắng",
            email: null,
            address: null,
            phone: null,
            identifyCard: "035086000010",
            roleName: "Chuyên viên",
            roleCode: ROLE_CODE.SPECIALIST,
          },
        ],
      },
      {
        id: 153,
        name: "Hỗ trợ kỹ thuật",
        code: null,
        hotline: null,
        users: [
          {
            name: "Nguyễn Văn Tùng",
            email: null,
            address: null,
            phone: null,
            identifyCard: "001079008881",
            roleName: "Lãnh đạo phòng",
            roleCode: ROLE_CODE.TEAM_DIRECTOR,
          },
          {
            name: "Hà Đăng Dũng",
            email: null,
            address: null,
            phone: null,
            identifyCard: "001071006550",
            roleName: "Lãnh đạo phòng",
            roleCode: ROLE_CODE.TEAM_DIRECTOR,
          },
          {
            name: "Lê Thế Đạt",
            email: null,
            address: null,
            phone: null,
            identifyCard: "001078002960",
            roleName: "Chuyên viên",
            roleCode: ROLE_CODE.SPECIALIST,
          },
          {
            name: "Nguyễn Cao Cường",
            email: null,
            address: null,
            phone: null,
            identifyCard: "001081019700",
            roleName: "Chuyên viên",
            roleCode: ROLE_CODE.SPECIALIST,
          },
          {
            name: "Nguyễn Văn Sinh",
            email: null,
            address: null,
            phone: null,
            identifyCard: "030082001030",
            roleName: "Chuyên viên",
            roleCode: ROLE_CODE.SPECIALIST,
          },
        ],
      },
    ],
  },
];
