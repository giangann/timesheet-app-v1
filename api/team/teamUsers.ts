export async function fetchListUserOfTeam(session: string | undefined | null, teamId: number) {
  const token = `Bearer ${session}`;

  const baseUrl = "https://proven-incredibly-redbird.ngrok-free.app/api/v1";
  const endpoint = `/teams/users-in-team/${teamId}`;
  const url = `${baseUrl}${endpoint}`;

  const response = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json", Authorization: token },
    credentials: "include",
  });
  const responseJson = await response.json();
  return responseJson;
}
