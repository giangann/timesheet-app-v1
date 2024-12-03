import { TWeekCalendarCreate } from "./type";

export async function fetchWeekCalendar(session: string | undefined | null) {
  const token = `Bearer ${session}`;

  const baseUrl = "https://proven-incredibly-redbird.ngrok-free.app/api/v1";
  const endpoint = "/week-calendars";
  const url = `${baseUrl}${endpoint}`;

  const response = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json", Authorization: token },
    credentials: "include",
  });
  const responseJson = await response.json();

  return responseJson;
}

export async function createWeekCalendar(session: string | undefined | null, bodyData:TWeekCalendarCreate ){
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
