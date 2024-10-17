///////////////////////////////////////////////////////////////////////////

import { paramsObjectToQueryString } from "@/helper/common";
import { TDutyCalendarFilterParams } from "./type";

/**
 * DUTY CALENDARS
 */
export async function fetchListDutyCalendarByDateRange(session: string | null | undefined, filterParams: TDutyCalendarFilterParams) {
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

export async function fetchDutyCalendarDetail(session: string | null | undefined, calendarId: number) {
    const token = `Bearer ${session}`;

    const baseUrl = "https://proven-incredibly-redbird.ngrok-free.app/api/v1";
    const endpoint = `/duty-calendars/${calendarId}`;

    const url = `${baseUrl}${endpoint}`;

    const response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json", Authorization: token },
        credentials: "include",
    });

    const responseJson = await response.json();

    return responseJson;
}
