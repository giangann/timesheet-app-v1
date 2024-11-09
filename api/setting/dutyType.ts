import { paramsObjectToQueryString } from "@/helper/common";

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

export async function fetchDutyTypeDetail(session: string | null | undefined, dutyTypeId:number) {
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