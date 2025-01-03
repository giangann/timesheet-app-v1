export async function fetchAllTeamWithUsers(session: string | undefined | null) {
  const token = `Bearer ${session}`;

  const baseUrl = "https://chamcong.vptw.dcs.vn/api/api/v1";
  const endpoint = "/teams/get-all";

  const url = `${baseUrl}${endpoint}`;

  const response = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json", Authorization: token },
    credentials: "include",
  });
  const responseJson = await response.json();

  return responseJson;
}
