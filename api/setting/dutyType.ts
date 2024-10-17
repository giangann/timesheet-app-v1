import { paramsObjectToQueryString } from "@/helper/common";
import { TDutyTypeFilterParams } from "./type";

export async function fetchDutyTypes(session: string | undefined | null, filterParams: TDutyTypeFilterParams) {
  const token = `Bearer ${session}`;

  const baseUrl = "https://proven-incredibly-redbird.ngrok-free.app/api/v1";
  const endpoint = "/duty-calendars/get-calendar";
  const queryString = paramsObjectToQueryString(filterParams);

  const url = `${baseUrl}${endpoint}${queryString}`;

  const response = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json", Authorization: token },
    credentials: "include",
  });
  const responseJson = await response.json();

  return responseJson;
}
