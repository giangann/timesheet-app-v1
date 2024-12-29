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
export type THolidayDetail = {
  name: string;
  date: string; // YYYY-MM-DD
  salaryCoefficientTypeId: number | null;
  activeOutsideWorkingTime: boolean | null;
};
export type THolidayCreate = {
  name: string;
  date: string; // YYYY-MM-DD
  salaryCoefficientTypeId?: number;
  activeOutsideWorkingTime?: boolean;
};
export type THolidayCreateFormFields = {
  name: string | undefined;
  date: Date | undefined;
  salaryCoefficientTypeId: number | undefined;
  activeOutsideWorkingTime: boolean | undefined;
};
export type THolidayEdit = {
  name?: string;
  salaryCoefficientTypeId?: number;
  activeOutsideWorkingTime?: boolean;
};
export type THolidayEditFormFields = {
  name: string | undefined;
  date: Date | undefined;
  salaryCoefficientTypeId: number | undefined;
  activeOutsideWorkingTime: boolean | undefined;
};
export type THolidayFilterParams = {
  year: number;
};

export type TSalaryCoefficientType = {
  id: number;
  name: string;
  coefficient: number;
};

export type TTeamUserSort = {
  id: number;
  address: string | null;
  email: string | null;
  identifyCard: string;
  name: string;
  phone: string | null;
  roleCode: ROLE_CODE;
  roleName: string;
};

export type TDutyType = {
  id: number;
  dutyTypeName: string;
  teams: (TTeam & { users: TTeamUserSort[] })[];
};

export type TDutyTypeDetail = {
  id: number;
  name: string;
  teams: (TTeam & { users: (TTeamUserSort & { isActive: boolean })[] })[];
};

export type TDutyTypeCreate = {
  dutyTypeName: string;
  userIds: number[];
};
export type TDutyTypeUpdate = {
  dutyTypeName: string;
  userIds: number[];
};

export type TExceptionDay = {
  id: number;
  createdAt: string;
  updatedAt: string;
  name: string;
  startDate: string; // YYYY-MM-DD
  endDate: string;
};
export type TExceptionDayCreate = {
  name: string;
  startDate: string; // YYYY-MM-DD
  endDate: string;
};
export type TExceptionDayParams = {
  year: string;
};
