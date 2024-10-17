import { ROLE_CODE } from "@/constants/Misc";

export type TUserApprove = {
  identifyCard: number;
  name: string;
};

export type TListUserApproveParams = {
  role: ROLE_CODE,
  teamId: number
}