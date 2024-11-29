import { paramsObjectToQueryString } from "@/helper/common";
import { TExceptionDayParams } from "./type";

export async function fetchExceptionDays(session: string | undefined | null, params?:TExceptionDayParams) {
    const token = `Bearer ${session}`;
  
    const baseUrl = "https://proven-incredibly-redbird.ngrok-free.app/api/v1";
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