import { BASE_URL } from "@/constants/System";

export const fetchWorkingTypes = async (session: string | undefined | null) => {
  const token = `Bearer ${session}`;

  const baseUrl = BASE_URL;
  const endpoint = "/working-types";
  const url = `${baseUrl}${endpoint}`;

  const response = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json", Authorization: token ?? "" },
    credentials: "include",
  });

  const responseJson = await response.json();
  return responseJson;
};
