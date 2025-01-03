import { ROLE_CODE } from "@/constants/Misc";
import { TListUserApproveParams } from "./types";
import { paramsObjectToQueryString } from "@/helper/common";

export async function fetchListUserByRole(session: string | null | undefined, params: TListUserApproveParams) {
  const token = `Bearer ${session}`;

  const baseUrl = "https://chamcong.vptw.dcs.vn/api/api/v1";
  const endpoint = "/users/list-user-by-role";

  const queryString = paramsObjectToQueryString(params);
  const url = `${baseUrl}${endpoint}${queryString}`;

  const response = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json", Authorization: token },
    credentials: "include",
  });
  const responseJson = await response.json();

  return responseJson;
}

export async function uploadAttachFile(session: string | null | undefined, file: File) {
  const token = `Bearer ${session}`;

  const baseUrl = "https://chamcong.vptw.dcs.vn/api/api/v1";
  const endpoint = "/attach-files";
  const url = `${baseUrl}${endpoint}`;

  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "multipart/form-data", Authorization: token },
    body: formData,
    credentials: "include",
  });

  const responseJson = await response.json();

  return responseJson;
}
