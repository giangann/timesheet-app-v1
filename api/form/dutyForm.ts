import { DEFAULT_PAGI_PARAMS } from "@/constants/Misc";
import { TPagiParams } from "@/types";
import { TApproveDutyFormFilterParams, TDutyFormFilterParams } from "./types";

export async function fetchMyDutyForms(session: string | undefined | null, pagiParams?: TPagiParams, filterParams?: TDutyFormFilterParams) {
  const token = `Bearer ${session}` ?? "xxx";

  const baseUrl = "https://proven-incredibly-redbird.ngrok-free.app/api/v1";
  const endpoint = "/duty-forms/filter/user";

  const paginationParams = pagiParams ?? DEFAULT_PAGI_PARAMS;
  const { page, size } = paginationParams;
  const queryString = `?page=${page}&size=${size}&sort=id,desc`;

  const url = `${baseUrl}${endpoint}${queryString}`;

  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify(filterParams),
    headers: { "Content-Type": "application/json", Authorization: token },
    credentials: "include",
  });
  const responseJson = await response.json();

  return responseJson;
}

export async function fetchApproveDutyForms(session: string | undefined | null, pagiParams?: TPagiParams, filterParams?: TApproveDutyFormFilterParams) {
  const token = `Bearer ${session}` ?? "xxx";

  const baseUrl = "https://proven-incredibly-redbird.ngrok-free.app/api/v1";
  const endpoint = "/duty-forms/filter/user-approve";

  const paginationParams = pagiParams ?? DEFAULT_PAGI_PARAMS;
  const { page, size } = paginationParams;
  const queryString = `?page=${page}&size=${size}&sort=id,desc`;

  const url = `${baseUrl}${endpoint}${queryString}`;

  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify(filterParams),
    headers: { "Content-Type": "application/json", Authorization: token },
    credentials: "include",
  });
  const responseJson = await response.json();

  return responseJson;
}

export async function fetchDutyFormDetail(session: string, formId: number) {
  const token = `Bearer ${session}` ?? "xxx";

  const baseUrl = "https://proven-incredibly-redbird.ngrok-free.app/api/v1";
  const endpoint = `/duty-forms/${formId}`;
  const url = `${baseUrl}${endpoint}`;

  const response = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json", Authorization: token },
    credentials: "include",
  });
  const responseJson = await response.json();

  return responseJson;
}
