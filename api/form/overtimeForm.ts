import { DEFAULT_PAGI_PARAMS } from "@/constants/Misc";
import { TPagiParams } from "@/types";
import { TApproveOvertimeFormFilterParams, TOvertimeFormFilterParams } from "./types";
import moment from "moment";
import { BASE_URL } from "@/constants/System";

export async function fetchMyOvertimeForms(session: string | undefined | null, pagiParams?: TPagiParams, filterParams?: TOvertimeFormFilterParams) {
  const token = `Bearer ${session}`;

  const baseUrl = BASE_URL;
  const endpoint = "/overtime-forms/filter/user";

  const paginationParams = pagiParams ?? DEFAULT_PAGI_PARAMS;
  const { page, size } = paginationParams;
  const queryString = `?page=${page}&size=${size}&sort=date,desc&sort=id,asc`;

  const url = `${baseUrl}${endpoint}${queryString}`;

  const bodyFilterParams = { ...filterParams };
  if (bodyFilterParams?.startCreatedAt) {
    bodyFilterParams.startCreatedAt = moment(bodyFilterParams?.startCreatedAt).format("YYYY-MM-DD");
  }
  if (bodyFilterParams?.endCreatedAt) {
    bodyFilterParams.endCreatedAt = moment(bodyFilterParams?.endCreatedAt).format("YYYY-MM-DD");
  }

  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify(bodyFilterParams),
    headers: { "Content-Type": "application/json", Authorization: token },
    credentials: "include",
  });
  const responseJson = await response.json();

  return responseJson;
}

export async function fetchApproveOvertimeForms(
  session: string | undefined | null,
  pagiParams?: TPagiParams,
  filterParams?: TApproveOvertimeFormFilterParams
) {
  const token = `Bearer ${session}`;

  const baseUrl = BASE_URL;
  const endpoint = "/overtime-forms/filter/user-approve";

  const paginationParams = pagiParams ?? DEFAULT_PAGI_PARAMS;
  const { page, size } = paginationParams;
  const queryString = `?page=${page}&size=${size}&sort=date,desc&sort=id,asc`;

  const url = `${baseUrl}${endpoint}${queryString}`;

  const bodyFilterParams = { ...filterParams };
  if (bodyFilterParams?.startCreatedAt) {
    bodyFilterParams.startCreatedAt = moment(bodyFilterParams?.startCreatedAt).format("YYYY-MM-DD");
  }
  if (bodyFilterParams?.endCreatedAt) {
    bodyFilterParams.endCreatedAt = moment(bodyFilterParams?.endCreatedAt).format("YYYY-MM-DD");
  }
  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify(bodyFilterParams),
    headers: { "Content-Type": "application/json", Authorization: token },
    credentials: "include",
  });
  const responseJson = await response.json();

  return responseJson;
}

export async function fetchOvertimeFormDetail(session: string | null | undefined, formId: number) {
  const token = `Bearer ${session}`;

  const baseUrl = BASE_URL;
  const endpoint = `/overtime-forms/${formId}`;
  const url = `${baseUrl}${endpoint}`;

  const response = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json", Authorization: token },
    credentials: "include",
  });
  const responseJson = await response.json();

  return responseJson;
}
