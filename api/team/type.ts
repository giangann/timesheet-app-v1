import { TUserInfo } from "../auth";

export type TTeam = {
  id: number;
  name: string;
  code: string | null;
  hotline: string | null;
};

export type TTeamDetail = {
  name: string;
  code: string | null;
  hotline: string | null;
};

export type TTeamCreate = {
  name: string;
  hotline?: string;
};

export type TTeamEdit = {
  name?: string;
  hotline?: string;
};

export type TTeamUser = TUserInfo;

// Users of Team => TUserInfo
