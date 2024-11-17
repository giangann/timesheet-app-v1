import { ROLE_CODE } from "@/constants/Misc";

export type TUserApprove = {
  identifyCard: number;
  name: string;
};

export type TUserApproveWithId = {
  id: number;
  identifyCard: number;
  name: string;
};
export type TListUserApproveParams = {
  role: ROLE_CODE;
  teamId: number;
};
export type TListUserApproveInMultiTeamsParams = {
  role: ROLE_CODE;
  teamIds: number[];
};