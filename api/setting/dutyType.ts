import { paramsObjectToQueryString } from "@/helper/common";
import { TDutyTypeCreate, TDutyTypeUpdate } from "./type";

export async function fetchDutyTypes(session: string | null | undefined) {
  const token = `Bearer ${session}`;

  const baseUrl = "https://proven-incredibly-redbird.ngrok-free.app/api/v1";
  const endpoint = "/duty-types";

  const url = `${baseUrl}${endpoint}`;

  const response = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json", Authorization: token },
    credentials: "include",
  });
  const responseJson = await response.json();

  return responseJson;
}

export async function softDeleteDutyType(session: string | null | undefined, dutyTypeId: number) {
  const token = `Bearer ${session}`;

  const baseUrl = "https://proven-incredibly-redbird.ngrok-free.app/api/v1";
  const endpoint = "/duty-types";
  const querystring = paramsObjectToQueryString({ id: dutyTypeId });

  const url = `${baseUrl}${endpoint}${querystring}`;

  const response = await fetch(url, {
    method: "DELETE",
    headers: { "Content-Type": "application/json", Authorization: token },
    credentials: "include",
  });
  const responseJson = await response.json();

  return responseJson;
}

export async function fetchDutyTypeDetail(session: string | null | undefined, dutyTypeId: number | string) {
  const token = `Bearer ${session}`;

  const baseUrl = "https://proven-incredibly-redbird.ngrok-free.app/api/v1";
  const endpoint = "/duty-types/users";
  const querystring = paramsObjectToQueryString({ id: dutyTypeId });

  const url = `${baseUrl}${endpoint}${querystring}`;

  const response = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json", Authorization: token },
    credentials: "include",
  });
  const responseJson = await response.json();

  return responseJson;
}

export async function createDutyType(session: string | undefined | null, data: TDutyTypeCreate) {
  const token = `Bearer ${session}`;
  const baseUrl = "https://proven-incredibly-redbird.ngrok-free.app/api/v1";
  const endpoint = "/duty-types";

  const url = `${baseUrl}${endpoint}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: token ?? "" },
    body: JSON.stringify(data),
    credentials: "include",
  });

  const responseJson = await response.json();

  return responseJson;
}

export async function updateDutyType(session: string | undefined | null, dutyTypeId: number | string, data: TDutyTypeUpdate) {
  const token = `Bearer ${session}`;
  const baseUrl = "https://proven-incredibly-redbird.ngrok-free.app/api/v1";
  const endpoint = "/duty-types";
  const querystring = paramsObjectToQueryString({ id: dutyTypeId });
  const url = `${baseUrl}${endpoint}${querystring}`;

  const response = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: token ?? "" },
    body: JSON.stringify(data),
    credentials: "include",
  });

  const responseJson = await response.json();

  return responseJson;
}
