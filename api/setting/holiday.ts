import { paramsObjectToQueryString } from "@/helper/common";
import { THolidayCreate, THolidayEdit, THolidayFilterParams } from "./type";
import { BASE_URL } from "@/constants/System";

export async function fetchHolidaysByYear(session: string | undefined | null, params: THolidayFilterParams) {
  const token = `Bearer ${session}`;

  const baseUrl = BASE_URL;
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

export async function fetchHoliday(session: string | undefined | null, holidayId: number) {
  const token = `Bearer ${session}`;

  const baseUrl = BASE_URL;
  const endpoint = `/holidays/${holidayId}`;
  const url = `${baseUrl}${endpoint}`;

  const response = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json", Authorization: token },
    credentials: "include",
  });
  const responseJson = await response.json();
  return responseJson;
}
export async function createHoliday(session: string | undefined | null, bodyData: THolidayCreate) {
  const token = `Bearer ${session}`;

  const baseUrl = BASE_URL;
  const endpoint = "/holidays";
  const url = `${baseUrl}${endpoint}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: token },
    body: JSON.stringify(bodyData),
    credentials: "include",
  });
  const responseJson = await response.json();

  return responseJson;
}
export async function editHoliday(session: string | undefined | null, holidayId: number, bodyData: THolidayEdit) {
  const token = `Bearer ${session}`;

  const baseUrl = BASE_URL;
  const endpoint = `/holidays`;
  const url = `${baseUrl}${endpoint}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: token },
    body: JSON.stringify({ ...bodyData, id: holidayId }),
    credentials: "include",
  });
  const responseJson = await response.json();

  return responseJson;
}

export async function deleteHoliday(session: string | undefined | null, holidayId: number) {
  const token = `Bearer ${session}`;

  const baseUrl = BASE_URL;
  const endpoint = `/holidays/${holidayId}`;
  const url = `${baseUrl}${endpoint}`;

  const response = await fetch(url, {
    method: "DELETE",
    headers: { "Content-Type": "application/json", Authorization: token },
    credentials: "include",
  });
  const responseJson = await response.json();

  return responseJson;
}
