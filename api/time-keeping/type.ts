import { ROLE_CODE } from "@/constants/Misc";

export type TWorkingType = {
  id: number;
  name: string;
};

export type TTimeKeepingMember = {
  name: string;
  identifyCard: string;
  roleId: number;
  roleName: string;
  roleCode: ROLE_CODE;
  workingTypeId: number | null;
  workingTypeName: string | null;
};
export type TTimeKeepingMemberParams = {
  date: string;
};

export type TTimeKeepingCheckinUserFormFields = {
  userIdentifyCard: string;
  workingTypeId: number;
};
export type TTimeKeepingCheckinFormFields = {
  date: string;
  users: TTimeKeepingCheckinUserFormFields[];
};

export type TTimeKeepingCheckinUser = {
  userIdentifyCard: string;
  workingTypeId: number;
};
export type TTimeKeepingCheckin = {
  date: string;
  users: TTimeKeepingCheckinUser[];
};

