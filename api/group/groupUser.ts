import { paramsObjectToQueryString } from "@/helper/common";
import { TPagiParams } from "@/types";

export async function fetchListUserOfGroup(session: string | undefined | null, filterParams?: TPagiParams) {
  const token = `Bearer ${session}`;

  const baseUrl = "https://chamcong.vptw.dcs.vn/api/api/v1";
  const endpoint = `/users`;
  const querystring = paramsObjectToQueryString(filterParams);

  const url = `${baseUrl}${endpoint}${querystring}`;

  const response = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json", Authorization: token },
    credentials: "include",
  });
  const responseJson = await response.json();
  return responseJson;
}
