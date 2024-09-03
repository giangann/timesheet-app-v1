import { TCredentials } from "./type";

export const loginByCredentials = async (credentials: TCredentials) => {
  const baseUrl = "http://13.228.145.165:8080/api/v1";
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
