import { paramsObjectToQueryString } from "@/helper/common";

export async function fetchAllTeams(session: string | undefined | null) {
  const token = `Bearer ${session}`;

  const baseUrl = "https://proven-incredibly-redbird.ngrok-free.app/api/v1";
  const endpoint = `/teams`;
  const url = `${baseUrl}${endpoint}`;

  const response = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json", Authorization: token },
    credentials: "include",
  });
  const responseJson = await response.json();
  return responseJson;
}

export async function deleteTeam(session: string | undefined | null, teamId: number) {
  const token = `Bearer ${session}`;

  const baseUrl = "https://proven-incredibly-redbird.ngrok-free.app/api/v1";
  const endpoint = `/teams`;
  const querystring = paramsObjectToQueryString({ id: teamId });
  const url = `${baseUrl}${endpoint}${querystring}`;

  const response = await fetch(url, {
    method: "DELETE",
    headers: { "Content-Type": "application/json", Authorization: token },
    credentials: "include",
  });
  const responseJson = await response.json();

  return responseJson;
}
