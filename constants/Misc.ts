import { TDutySuggestedUser } from "@/api/form/types";
import { TDutyType, TDutyTypeDetail } from "@/api/setting/type";
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

export const _mockDutyTypeDetail: Pick<TDutyTypeDetail, "teams"> = {
  teams: [
    {
      id: 1,
      name: "cơ yếu",
      code: null,
      hotline: null,
      users: [
        {
          id: 269,
          name: "Nguyễn Mạnh Hùng",
          email: null,
          address: null,
          phone: null,
          identifyCard: "035072001862",
          roleName: "Lãnh đạo phòng",
          roleCode: ROLE_CODE.TEAM_DIRECTOR,
          isActive: true,
        },
        {
          id: 270,
          name: "Nguyễn Văn Hải",
          email: null,
          address: null,
          phone: null,
          identifyCard: "001073006920",
          roleName: "Lãnh đạo phòng",
          roleCode: ROLE_CODE.TEAM_DIRECTOR,
          isActive: true,
        },
        {
          id: 271,
          name: "Trần Thị Tuyết Nhung",
          email: null,
          address: null,
          phone: null,
          identifyCard: "036179000875",
          roleName: "Lãnh đạo phòng",
          roleCode: ROLE_CODE.TEAM_DIRECTOR,
          isActive: true,
        },
        {
          id: 272,
          name: "Vũ Ngọc Bằng",
          email: null,
          address: null,
          phone: null,
          identifyCard: "030078000695",
          roleName: "Chuyên viên",
          roleCode: ROLE_CODE.SPECIALIST,
          isActive: true,
        },
        {
          id: 273,
          name: "Nguyễn Văn Quý",
          email: null,
          address: null,
          phone: null,
          identifyCard: "035083006087",
          roleName: "Chuyên viên",
          roleCode: ROLE_CODE.SPECIALIST,
          isActive: true,
        },
        {
          id: 274,
          name: "Nguyễn Đức Thắng",
          email: null,
          address: null,
          phone: null,
          identifyCard: "027085000118",
          roleName: "Chuyên viên",
          roleCode: ROLE_CODE.SPECIALIST,
          isActive: true,
        },
        {
          id: 275,
          name: "Nguyễn Công Đạt",
          email: null,
          address: null,
          phone: null,
          identifyCard: "040088004704",
          roleName: "Chuyên viên",
          roleCode: ROLE_CODE.SPECIALIST,
          isActive: true,
        },
        {
          id: 276,
          name: "Phạm Ngọc Thắng",
          email: null,
          address: null,
          phone: null,
          identifyCard: "035086000010",
          roleName: "Chuyên viên",
          roleCode: ROLE_CODE.SPECIALIST,
          isActive: true,
        },
      ],
    },
    {
      id: 52,
      name: "Lãnh đạo đơn vị",
      code: null,
      hotline: null,
      users: [
        {
          id: 253,
          name: "Phạm Thế Bính",
          email: null,
          address: null,
          phone: null,
          identifyCard: "031067006561",
          roleName: "Lãnh đạo đơn vị",
          roleCode: ROLE_CODE.DEPARTMENT_DIRECTOR,
          isActive: false,
        },
        {
          id: 252,
          name: "Đinh Quang Huy",
          email: null,
          address: null,
          phone: null,
          identifyCard: "001076008045",
          roleName: "Lãnh đạo đơn vị",
          roleCode: ROLE_CODE.DEPARTMENT_DIRECTOR,
          isActive: false,
        },
        {
          id: 255,
          name: "Đào Văn Thành",
          email: null,
          address: null,
          phone: null,
          identifyCard: "001072003829",
          roleName: "Lãnh đạo đơn vị",
          roleCode: ROLE_CODE.DEPARTMENT_DIRECTOR,
          isActive: false,
        },
        {
          id: 254,
          name: "Đinh Bá Nghĩa",
          email: null,
          address: null,
          phone: null,
          identifyCard: "001069005292",
          roleName: "Lãnh đạo đơn vị",
          roleCode: ROLE_CODE.DEPARTMENT_DIRECTOR,
          isActive: false,
        },
      ],
    },
    {
      id: 152,
      name: "Hệ thống thông tin",
      code: null,
      hotline: null,
      users: [
        {
          id: 280,
          name: "Đặng Xuân Tiến",
          email: null,
          address: null,
          phone: null,
          identifyCard: "027090000200",
          roleName: "Chuyên viên",
          roleCode: ROLE_CODE.SPECIALIST,
          isActive: false,
        },
        {
          id: 277,
          name: "Đặng Minh Chính",
          email: null,
          address: null,
          phone: null,
          identifyCard: "001077030247",
          roleName: "Lãnh đạo phòng",
          roleCode: ROLE_CODE.TEAM_DIRECTOR,
          isActive: false,
        },
        {
          id: 278,
          name: "Trần Thanh Tùng",
          email: null,
          address: null,
          phone: null,
          identifyCard: "036082001417",
          roleName: "Lãnh đạo phòng",
          roleCode: ROLE_CODE.TEAM_DIRECTOR,
          isActive: false,
        },
        {
          id: 279,
          name: "Nguyễn Văn Khái",
          email: null,
          address: null,
          phone: null,
          identifyCard: "030087006935",
          roleName: "Chuyên viên",
          roleCode: ROLE_CODE.SPECIALIST,
          isActive: false,
        },
        {
          id: 260,
          name: "Nguyễn Thị Thanh Hiền",
          email: null,
          address: null,
          phone: null,
          identifyCard: "037191006029",
          roleName: "Chuyên viên",
          roleCode: ROLE_CODE.SPECIALIST,
          isActive: false,
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
          id: 264,
          name: "Nguyễn Văn Tùng",
          email: null,
          address: null,
          phone: null,
          identifyCard: "001079008881",
          roleName: "Lãnh đạo phòng",
          roleCode: ROLE_CODE.TEAM_DIRECTOR,
          isActive: false,
        },
        {
          id: 265,
          name: "Hà Đăng Dũng",
          email: null,
          address: null,
          phone: null,
          identifyCard: "001071006550",
          roleName: "Lãnh đạo phòng",
          roleCode: ROLE_CODE.TEAM_DIRECTOR,
          isActive: false,
        },
        {
          id: 266,
          name: "Lê Thế Đạt",
          email: null,
          address: null,
          phone: null,
          identifyCard: "001078002960",
          roleName: "Chuyên viên",
          roleCode: ROLE_CODE.SPECIALIST,
          isActive: false,
        },
        {
          id: 267,
          name: "Nguyễn Cao Cường",
          email: null,
          address: null,
          phone: null,
          identifyCard: "001081019700",
          roleName: "Chuyên viên",
          roleCode: ROLE_CODE.SPECIALIST,
          isActive: false,
        },
        {
          id: 268,
          name: "Nguyễn Văn Sinh",
          email: null,
          address: null,
          phone: null,
          identifyCard: "030082001030",
          roleName: "Chuyên viên",
          roleCode: ROLE_CODE.SPECIALIST,
          isActive: false,
        },
      ],
    },
    {
      id: 154,
      name: "Hệ thống mạng máy tính",
      code: null,
      hotline: null,
      users: [
        {
          id: 261,
          name: "Phạm Minh Đức",
          email: null,
          address: null,
          phone: null,
          identifyCard: "030080002966",
          roleName: "Lãnh đạo phòng",
          roleCode: ROLE_CODE.TEAM_DIRECTOR,
          isActive: false,
        },
        {
          id: 262,
          name: "Cao Minh Đức",
          email: null,
          address: null,
          phone: null,
          identifyCard: "001080009368",
          roleName: "Lãnh đạo phòng",
          roleCode: ROLE_CODE.TEAM_DIRECTOR,
          isActive: false,
        },
        {
          id: 263,
          name: "Nguyễn Văn Thao",
          email: null,
          address: null,
          phone: null,
          identifyCard: "022086001298",
          roleName: "Chuyên viên",
          roleCode: ROLE_CODE.SPECIALIST,
          isActive: false,
        },
      ],
    },
    {
      id: 155,
      name: "Tổng hợp",
      code: null,
      hotline: null,
      users: [
        {
          id: 258,
          name: "Nguyễn Quang Ngân",
          email: null,
          address: null,
          phone: null,
          identifyCard: "033083007498",
          roleName: "Chuyên viên",
          roleCode: ROLE_CODE.SPECIALIST,
          isActive: false,
        },
        {
          id: 256,
          name: "Phạm Thị Thu Hà",
          email: null,
          address: null,
          phone: null,
          identifyCard: "035173000184",
          roleName: "Lãnh đạo phòng",
          roleCode: ROLE_CODE.TEAM_DIRECTOR,
          isActive: false,
        },
        {
          id: 257,
          name: "Nguyễn Minh Tiến",
          email: null,
          address: null,
          phone: null,
          identifyCard: "015074000038",
          roleName: "Lãnh đạo phòng",
          roleCode: ROLE_CODE.TEAM_DIRECTOR,
          isActive: false,
        },
        {
          id: 259,
          name: "Hoàng Phương Nhung",
          email: null,
          address: null,
          phone: null,
          identifyCard: "001185010406",
          roleName: "Văn thư",
          roleCode: ROLE_CODE.ARCHIVIST,
          isActive: false,
        },
      ],
    },
  ],
};

export type TFakeDutyType = {
  id: number;
  dutyTypeName: string;
};

export const _mockDutyTypes: TFakeDutyType[] = [
  { id: 1, dutyTypeName: "Truc co yeu" },
  { id: 2, dutyTypeName: "Truc kĩ thuật" },
  { id: 3, dutyTypeName: "Truc lãnh đạo" },
];

export const _mockDutySuggestedUsers: TDutySuggestedUser[] = [
  {
    name: "Nguyễn Quang Ngân",
    id: 258,
    identifyCard: "033083007498",
    roleName: "Chuyên viên",
    roleCode: "SPECIALIST",
    teamName: "Tổng hợp",
    teamCode: null,
    teamId: 1,
    numOnDuty: 0,
  },
  {
    name: "Hoàng Phương Nhung",
    id: 259,
    identifyCard: "001185010406",
    roleName: "Văn thư",
    roleCode: "ARCHIVIST",
    teamName: "Tổng hợp",
    teamCode: null,
    teamId: 1,
    numOnDuty: 0,
  },
  {
    name: "Nguyễn Thị Thanh Hiền",
    id: 260,
    identifyCard: "037191006029",
    roleName: "Chuyên viên",
    roleCode: "SPECIALIST",
    teamName: "Hệ thống thông tin",
    teamCode: null,
    teamId: 1,
    numOnDuty: 0,
  },
  {
    name: "Nguyễn Văn Hải",
    id: 270,
    identifyCard: "001073006920",
    roleName: "Lãnh đạo phòng",
    roleCode: "TEAM_DIRECTOR",
    teamName: "cơ yếu",
    teamCode: null,
    teamId: 1,
    numOnDuty: 0,
  },
  {
    name: "Nguyễn Văn Quý",
    id: 273,
    identifyCard: "035083006087",
    roleName: "Chuyên viên",
    roleCode: "SPECIALIST",
    teamName: "cơ yếu",
    teamCode: null,
    teamId: 1,
    numOnDuty: 0,
  },
  {
    name: "Nguyễn Văn Thao",
    id: 263,
    identifyCard: "022086001298",
    roleName: "Chuyên viên",
    roleCode: "SPECIALIST",
    teamName: "Hệ thống mạng máy tính",
    teamCode: null,
    teamId: 1,
    numOnDuty: 0,
  },
  {
    name: "Lê Thế Đạt",
    id: 266,
    identifyCard: "001078002960",
    roleName: "Chuyên viên",
    roleCode: "SPECIALIST",
    teamName: "Hỗ trợ kỹ thuật",
    teamCode: null,
    teamId: 1,
    numOnDuty: 0,
  },
  {
    name: "Nguyễn Cao Cường",
    id: 267,
    identifyCard: "001081019700",
    roleName: "Chuyên viên",
    roleCode: "SPECIALIST",
    teamName: "Hỗ trợ kỹ thuật",
    teamCode: null,
    teamId: 1,
    numOnDuty: 0,
  },
  {
    name: "Nguyễn Văn Sinh",
    id: 268,
    identifyCard: "030082001030",
    roleName: "Chuyên viên",
    roleCode: "SPECIALIST",
    teamName: "Hỗ trợ kỹ thuật",
    teamCode: null,
    teamId: 1,
    numOnDuty: 0,
  },
];
