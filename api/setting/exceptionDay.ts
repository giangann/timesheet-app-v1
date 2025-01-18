import { paramsObjectToQueryString } from "@/helper/common";
import { TExceptionDayParams } from "./type";
import { BASE_URL } from "@/constants/System";

export async function fetchExceptionDays(session: string | undefined | null, params?: TExceptionDayParams) {
  const token = `Bearer ${session}`;

  const baseUrl = BASE_URL;
  const endpoint = "/exception-dates";

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

export async function deleteExceptionDay(session: string | undefined | null, id: number) {
  const token = `Bearer ${session}`;

  const baseUrl = BASE_URL;
  const endpoint = `/exception-dates/${id}`;
  const url = `${baseUrl}${endpoint}`;

  const response = await fetch(url, {
    method: "DELETE",
    headers: { "Content-Type": "application/json", Authorization: token },
    credentials: "include",
  });
  const responseJson = await response.json();

  return responseJson;
}
