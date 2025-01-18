import { BASE_URL } from "@/constants/System";

export async function fetchSalaryCoefTypes(session: string | undefined | null) {
  const token = `Bearer ${session}`;

  const baseUrl = BASE_URL;
  const endpoint = "/salary-coefficient-types";
  const url = `${baseUrl}${endpoint}`;

  const response = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json", Authorization: token },
    credentials: "include",
  });
  const responseJson = await response.json();

  return responseJson;
}

export async function deleteSalaryCoefType(session: string | undefined | null, id: number) {
  const token = `Bearer ${session}`;

  const baseUrl = BASE_URL;
  const endpoint = `/salary-coefficient-types/${id}`;
  const url = `${baseUrl}${endpoint}`;

  const response = await fetch(url, {
    method: "DELETE",
    headers: { "Content-Type": "application/json", Authorization: token },
    credentials: "include",
  });
  const responseJson = await response.json();

  return responseJson;
}
