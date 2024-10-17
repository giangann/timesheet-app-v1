import { TMonthTimesheetListParams } from "./type";

export const fetchMonthData = async (session: string | undefined | null, params: TMonthTimesheetListParams) => {
  const { userIdentifyCard, month, year } = params;

  const token = `Bearer ${session}`;
  const baseUrl = "https://proven-incredibly-redbird.ngrok-free.app/api/v1";
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
