import { ROLE_CODE } from "@/constants/Misc";
import { TTeam } from "../team/type";

export type THoliday = {
  id: number;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  name: string;
  date: string; // YYYY-MM-DD
  salaryCoefficientTypeId: number;
  activeOutsideWorkingTime: boolean;
};
export type THolidayFilterParams = {
  year: number;
};

export type TSalaryCoefficientType = {
  id: number;
  name: string;
  coefficient: number;
};

export type TDutyCalendar = {
  dutyFormId: number;
  date: string; // YYYY-MM-DD
  dutyType: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  salaryCoefficientName: string;
  salaryCoefficient: number;
};
export type TDutyCalendarFilterParams = {
  startDate?: string;
  endDate?: string;
};
export type TDutyCalendarDetail = {
  id: number;
  startTime: string;
  endTime: string;
  date: string;
  dutyType: {
    id: number;
    name: string;
  };
  salaryCoefficientType: {
    id: number;
    name: string;
    coefficient: number;
  };
};

export type TTeamUserSort = {
  address: string | null;
  email: string | null;
  identifyCard: string;
  name: string;
  phone: string | null;
  roleCode: ROLE_CODE;
  roleName: string;
};

export type TDutyType = {
  dutyTypeName: string;
  teams: (TTeam & { users: TTeamUserSort[] })[];
};

export type TDutyTypeCreate = {
  dutyTypeName: string;
  userIds: number[];
};
