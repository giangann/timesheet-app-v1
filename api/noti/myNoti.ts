import { DEFAULT_PAGI_PARAMS } from "@/constants/Misc";
import { TPagiParams } from "@/types";

export const fetchMyNotis = async (session: string | undefined | null, pagiParams?: TPagiParams) => {
  const token = `Bearer ${session}`;
  const baseUrl = "https://proven-incredibly-redbird.ngrok-free.app/api/v1";
  const endpoint = "/notifications";

  const paginationParams = pagiParams ?? DEFAULT_PAGI_PARAMS;
  const { page, size } = paginationParams;
  const queryString = `?page=${page}&size=${size}&sort=createdAt,desc`;

  const url = `${baseUrl}${endpoint}${queryString}`;

  const response = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json", Authorization: token ?? "" },
    credentials: "include",
  });

  const responseJson = await response.json();
  return responseJson;
};

export const readNoti = async (session: string | undefined | null, notiId: number) => {
  const token = `Bearer ${session}`;
  const baseUrl = "https://proven-incredibly-redbird.ngrok-free.app/api/v1";
  const endpoint = "/notifications";
  const pathParams = `/${notiId}`;

  const url = `${baseUrl}${endpoint}${pathParams}`;

  const response = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: token ?? "" },
    credentials: "include",
  });

  const responseJson = await response.json();
  return responseJson;
};
