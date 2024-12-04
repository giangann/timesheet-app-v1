import { paramsObjectToQueryString } from "@/helper/common";
import { TWeekCalendarCreate } from "./type";

export async function fetchWeekCalendar(session: string | undefined | null) {
  const token = `Bearer ${session}`;

  const baseUrl = "https://proven-incredibly-redbird.ngrok-free.app/api/v1";
  const endpoint = "/week-calendars/filter";
  const url = `${baseUrl}${endpoint}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: token },
    credentials: "include",
    body: JSON.stringify({}),
  });
  const responseJson = await response.json();

  return responseJson;
}

export async function fetchWeekCalendarDetail(session: string | undefined | null, calendarId: number) {
  const token = `Bearer ${session}`;

  const baseUrl = "https://proven-incredibly-redbird.ngrok-free.app/api/v1";
  const endpoint = "/week-calendars";
  const querystring = paramsObjectToQueryString({ id: calendarId });
  const url = `${baseUrl}${endpoint}${querystring}`;

  const response = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json", Authorization: token },
    credentials: "include",
  });
  const responseJson = await response.json();

  return responseJson;
}

export async function createWeekCalendar(session: string | undefined | null, bodyData: TWeekCalendarCreate) {
  const token = `Bearer ${session}`;

  const baseUrl = "https://proven-incredibly-redbird.ngrok-free.app/api/v1";
  const endpoint = "/week-calendars";
  const url = `${baseUrl}${endpoint}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify(bodyData),
    credentials: "include",
  });
  const responseJson = await response.json();

  return responseJson;
}
