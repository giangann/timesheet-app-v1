import { TUserInfo } from "../auth";

export type TTeam = {
  id: number;
  name: string;
  code: string | null;
  hotline: string | null;
};

export type TTeamUser = TUserInfo;

// Users of Team => TUserInfo
