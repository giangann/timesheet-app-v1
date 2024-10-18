///////////////////////////////////////////////////////////////////////////

import { paramsObjectToQueryString } from "@/helper/common";
import { TDutyCalendarFilterParams } from "./type";
import { DEFAULT_DATE_RANGE_DUTY_CALENDAR } from "@/constants/Misc";
import moment from "moment";

/**
 * DUTY CALENDARS
 */
export async function fetchListDutyCalendarByDateRange(session: string | null | undefined, filterParams: TDutyCalendarFilterParams) {
    const token = `Bearer ${session}`;

    const baseUrl = "https://proven-incredibly-redbird.ngrok-free.app/api/v1";
    const endpoint = "/duty-calendars/get-calendar";

    // validate filter params
    let filterDateRangeParams: Required<TDutyCalendarFilterParams> = { startDate: '', endDate: '' }
    if (filterParams.startDate && filterParams.endDate) {
        filterDateRangeParams = { ...filterParams as Required<TDutyCalendarFilterParams> }
    }
    if (filterParams.startDate && !filterParams.endDate) {
        filterDateRangeParams.startDate = filterParams.startDate
        filterDateRangeParams.endDate = moment(Date.now()).format('YYYY-MM-DD')
    }
    if (filterParams.endDate && !filterParams.startDate) {
        filterDateRangeParams.endDate = filterParams.endDate
        filterDateRangeParams.startDate = DEFAULT_DATE_RANGE_DUTY_CALENDAR.startDate
    }
    if (!filterParams.startDate && !filterParams.endDate) {
        filterDateRangeParams = { ...DEFAULT_DATE_RANGE_DUTY_CALENDAR }
    }
    //

    const queryString = paramsObjectToQueryString(filterDateRangeParams);
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
