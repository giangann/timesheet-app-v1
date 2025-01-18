import { BASE_URL } from "@/constants/System";
import { TMonthTimesheetListParams } from "./type";

export const fetchMonthData = async (session: string | undefined | null, params: TMonthTimesheetListParams) => {
  const { userIdentifyCard, month, year } = params;

  const token = `Bearer ${session}`;
  const baseUrl = BASE_URL;
  const endpoint = "/users/timesheet";
  const queryString = `?userIdentifyCard=${userIdentifyCard}&month=${month}&year=${year}`;
  const url = `${baseUrl}${endpoint}${queryString}`;

  const response = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json", Authorization: token ?? "" },
    credentials: "include",
  });

  const responseJson = await response.json();
  return responseJson;
};
