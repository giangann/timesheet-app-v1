import { DEFAULT_PAGI_PARAMS } from "@/constants/Misc";
import { TPagiParams } from "@/types";
import { TApproveLeaveFormFilterParams, TLeaveFormFilterParams } from "./types";
import moment from "moment";

export async function fetchMyLeaveForms(session: string | undefined | null, pagiParams?: TPagiParams, filterParams?: TLeaveFormFilterParams) {
  const token = `Bearer ${session}`;

  const baseUrl = "https://proven-incredibly-redbird.ngrok-free.app/api/v1";
  const endpoint = "/leave-forms/filter/user";

  const paginationParams = pagiParams ?? DEFAULT_PAGI_PARAMS;
  const { page, size } = paginationParams;
  const queryString = `?page=${page}&size=${size}&sort=endDate,desc&sort=id,desc`;

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

export async function fetchApproveLeaveForms(
  session: string | undefined | null,
  pagiParams?: TPagiParams,
  filterParams?: TApproveLeaveFormFilterParams
) {
  const token = `Bearer ${session}`;

  const baseUrl = "https://proven-incredibly-redbird.ngrok-free.app/api/v1";
  const endpoint = "/leave-forms/filter/user-approve";

  const paginationParams = pagiParams ?? DEFAULT_PAGI_PARAMS;
  const { page, size } = paginationParams;
  const queryString = `?page=${page}&size=${size}&sort=endDate,desc&sort=id,desc`;

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

export async function fetchLeaveFormDetail(session: string, formId: number) {
  const token = `Bearer ${session}`;

  const baseUrl = "https://proven-incredibly-redbird.ngrok-free.app/api/v1";
  const endpoint = `/leave-forms/${formId}`;
  const url = `${baseUrl}${endpoint}`;

  const response = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json", Authorization: token },
    credentials: "include",
  });
  const responseJson = await response.json();

  return responseJson;
}
