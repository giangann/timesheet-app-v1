import moment from "moment";
import { TTimeKeepingCheckin, TTimeKeepingMemberParams } from "./type";
import { paramsObjectToQueryString } from "@/helper/common";

export const fetchTodayTimeKeeping = async (session: string | undefined | null, params: TTimeKeepingMemberParams) => {
  const token = `Bearer ${session}`;
  const baseUrl = "https://chamcong.vptw.dcs.vn/api/api/v1";
  const endpoint = "/timekeeping";
  const queryString = paramsObjectToQueryString(params);
  const url = `${baseUrl}${endpoint}${queryString}`;

  const response = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json", Authorization: token ?? "" },
    credentials: "include",
  });

  const responseJson = await response.json();
  return responseJson;
};

export const updateTodayTimeKeeping = async (session: string | undefined | null, bodyData: TTimeKeepingCheckin) => {
  const token = `Bearer ${session}`;
  const baseUrl = "https://chamcong.vptw.dcs.vn/api/api/v1";
  const endpoint = "/timekeeping";
  const url = `${baseUrl}${endpoint}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: token },
    body: JSON.stringify(bodyData),
    credentials: "include",
  });
  const responseJson = await response.json();

  return responseJson;
};
