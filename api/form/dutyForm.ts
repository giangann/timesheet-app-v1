import { DEFAULT_PAGI_PARAMS, ROLE_CODE } from "@/constants/Misc";
import { TPagiParams } from "@/types";
import moment from "moment";
import { TApproveDutyFormFilterParams, TDutyFormCreate, TDutyFormFilterParams, TDutySuggestedUserFilterParams } from "./types";
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

export async function fetchUserCreateDutyForms(session: string | undefined | null, pagiParams?: TPagiParams, filterParams?: TDutyFormFilterParams) {
  const token = `Bearer ${session}`;

  const baseUrl = "https://proven-incredibly-redbird.ngrok-free.app/api/v1";
  const endpoint = "/duty-forms/filter/user-create";

  const paginationParams = pagiParams ?? DEFAULT_PAGI_PARAMS;
  const { page, size } = paginationParams;
  const queryString = `?page=${page}&size=${size}&sort=id,desc`;

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

export async function fetchGroupDutyForms(session: string | undefined | null, pagiParams?: TPagiParams, filterParams?: TDutyFormFilterParams) {
  const token = `Bearer ${session}`;

  const baseUrl = "https://proven-incredibly-redbird.ngrok-free.app/api/v1";
  const endpoint = "/duty-forms/filter/all";

  const paginationParams = pagiParams ?? DEFAULT_PAGI_PARAMS;
  const { page, size } = paginationParams;
  const queryString = `?page=${page}&size=${size}&sort=id,desc`;

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

export async function fetchDutyFormDetail(session: string | undefined | null, formId: number) {
  const token = `Bearer ${session}`;

  const baseUrl = "https://proven-incredibly-redbird.ngrok-free.app/api/v1";
  const endpoint = `/duty-forms`;
  const querystring = paramsObjectToQueryString({ id: formId });
  const url = `${baseUrl}${endpoint}${querystring}`;

  const response = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json", Authorization: token },
    credentials: "include",
  });
  const responseJson = await response.json();

  return responseJson;
}

export async function createDutyForm(session: string | null | undefined, bodyData: TDutyFormCreate) {
  const token = `Bearer ${session}`;

  const baseUrl = "https://proven-incredibly-redbird.ngrok-free.app/api/v1";
  const endpoint = "/duty-forms";
  const url = `${baseUrl}${endpoint}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    }, // do not set content-type for formData, let browser do it automatically
    body: JSON.stringify(bodyData),
    credentials: "include",
  });
  const responseJson = await response.json();

  return responseJson;
}

export async function fetchDutySuggestedUsers(
  session: string | null | undefined,
  pagiParams: TPagiParams,
  filterParams: TDutySuggestedUserFilterParams
) {
  const token = `Bearer ${session}`;

  const baseUrl = "https://proven-incredibly-redbird.ngrok-free.app/api/v1";
  const endpoint = "/duty-forms/suggest-users";
  const queryString = paramsObjectToQueryString({ ...filterParams, ...pagiParams });

  const url = `${baseUrl}${endpoint}${queryString}`;

  const response = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json", Authorization: token },
    credentials: "include",
  });
  const responseJson = await response.json();

  return responseJson;
}

export async function deleteForm(session: string | null | undefined, formId: number) {
  const token = `Bearer ${session}`;

  const baseUrl = "https://proven-incredibly-redbird.ngrok-free.app/api/v1";
  const endpoint = `/duty-forms/cancel`;
  const querystring = paramsObjectToQueryString({ id: formId });
  const url = `${baseUrl}${endpoint}${querystring}`;

  const response = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json", Authorization: token },
    credentials: "include",
  });
  const responseJson = await response.json();

  return responseJson;
}
