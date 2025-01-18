import { BASE_URL } from "@/constants/System";
import { TChangePassword } from "./types";

export async function fetchUserProfile(session: string) {
  const token = `Bearer ${session}`;

  const baseUrl = BASE_URL;
  const endpoint = `/users/profile`;
  const url = `${baseUrl}${endpoint}`;

  const response = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json", Authorization: token },
    credentials: "include",
  });
  const responseJson = await response.json();

  return responseJson;
}

export async function changePassword(session: string | null | undefined, bodyData: TChangePassword) {
  const token = `Bearer ${session}`;

  const baseUrl = BASE_URL;
  const endpoint = `/auth/change-password`;
  const url = `${baseUrl}${endpoint}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: token },
    body: JSON.stringify(bodyData),
    credentials: "include",
  });
  const responseJson = await response.json();

  return responseJson;
}
