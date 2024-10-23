import { DEFAULT_PAGI_PARAMS, ROLE_CODE } from "@/constants/Misc";
import { TPagiParams } from "@/types";
import moment from "moment";
import { TApproveDutyFormFilterParams, TDutyFormFilterParams, TDutySuggestedUserFilterParams } from "./types";
import { paramsObjectToQueryString } from "@/helper/common";

///////////////////////////////////////////////////////////////////////////////
/**
 * DUTY FORMS
 */
export async function fetchMyDutyForms(session: string | undefined | null, pagiParams?: TPagiParams, filterParams?: TDutyFormFilterParams) {
  const token = `Bearer ${session}`;

  const baseUrl = "https://proven-incredibly-redbird.ngrok-free.app/api/v1";
  const endpoint = "/duty-forms/filter/user";

  const paginationParams = pagiParams ?? DEFAULT_PAGI_PARAMS;
  const { page, size } = paginationParams;
  const queryString = `?page=${page}&size=${size}&sort=id,desc`;

  const url = `${baseUrl}${endpoint}${queryString}`;

  const bodyFilterParams = { ...filterParams };
  if (bodyFilterParams?.createdAt) {
    bodyFilterParams.createdAt = moment(bodyFilterParams?.createdAt).format("YYYY-MM-DD");
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

export async function fetchApproveDutyForms(
  session: string | undefined | null,
  pagiParams?: TPagiParams,
  filterParams?: TApproveDutyFormFilterParams
) {
  const token = `Bearer ${session}`;

  const baseUrl = "https://proven-incredibly-redbird.ngrok-free.app/api/v1";
  const endpoint = "/duty-forms/filter/user-approve";

  const paginationParams = pagiParams ?? DEFAULT_PAGI_PARAMS;
  const { page, size } = paginationParams;
  const queryString = `?page=${page}&size=${size}&sort=id,desc`;

  const url = `${baseUrl}${endpoint}${queryString}`;

  const bodyFilterParams = { ...filterParams };
  if (bodyFilterParams?.createdAt) {
    bodyFilterParams.createdAt = moment(bodyFilterParams?.createdAt).format("YYYY-MM-DD");
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

export async function fetchDutyFormDetail(session: string, formId: number) {
  const token = `Bearer ${session}`;

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

export async function createDutyForm(session: string | null | undefined, bodyFormData: FormData) {
  const token = `Bearer ${session}`;

  const baseUrl = "https://proven-incredibly-redbird.ngrok-free.app/api/v1";
  const endpoint = "/duty-forms";
  const url = `${baseUrl}${endpoint}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: token,
    }, // do not set content-type for formData, let browser do it automatically
    body: bodyFormData,
    credentials: "include",
  });
  const responseJson = await response.json();

  return responseJson;
}

export async function fetchDutySuggestedUsers(session: string | null | undefined, pagiParams: TPagiParams, filterParams: TDutySuggestedUserFilterParams) {
  const token = `Bearer ${session}`;

  const baseUrl = "https://proven-incredibly-redbird.ngrok-free.app/api/v1";
  const endpoint = "/duty-forms/suggest-users";
  const queryString = paramsObjectToQueryString({ ...filterParams, ...pagiParams })

  const url = `${baseUrl}${endpoint}${queryString}`

  const response = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json", Authorization: token },
    credentials: "include",
  });
  const responseJson = await response.json();

  return responseJson;
}