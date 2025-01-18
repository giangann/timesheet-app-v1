import { BASE_URL } from "@/constants/System";
import { TCredentials } from "./type";

export const loginByCredentials = async (credentials: TCredentials) => {
  const baseUrl = BASE_URL;
  const endpoint = "/auth/login";
  const url = `${baseUrl}${endpoint}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
    credentials: "include",
  });

  const responseJson = await response.json();
  return responseJson;
};

export const verifyToken = async (token: string) => {
  const baseUrl = BASE_URL;
  const endpoint = "/auth/verify-token";
  const queryString = `?token=${token}`;
  const url = `${baseUrl}${endpoint}${queryString}`;

  const response = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  const responseJson = await response.json();
  return responseJson;
};

export const logout = async (session: string | null | undefined, bodyData: { expoGoToken?: string }) => {
  const token = `Bearer ${session}`;

  const baseUrl = BASE_URL;
  const endpoint = "/auth/logout";
  const url = `${baseUrl}${endpoint}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: token },
    body: JSON.stringify(bodyData),
    credentials: "include",
  });

  const responseJson = await response.json();

  return responseJson;
};
