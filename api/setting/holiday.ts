import { paramsObjectToQueryString } from "@/helper/common";
import { THolidayFilterParams } from "./type";

export async function fetchHolidaysByYear(session: string | undefined | null, params: THolidayFilterParams) {
  const token = `Bearer ${session}`;

  const baseUrl = "https://proven-incredibly-redbird.ngrok-free.app/api/v1";
  const endpoint = "/holidays";

  const queryString = paramsObjectToQueryString({ ...params, sort: "date,asc" });

  const url = `${baseUrl}${endpoint}${queryString}`;

  const response = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json", Authorization: token },
    credentials: "include",
  });
  const responseJson = await response.json();

  return responseJson;
}
