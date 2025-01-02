export async function fetchHomeData(session: string) {
  const token = `Bearer ${session}`;

  const baseUrl = "https://chamcong.vptw.dcs.vn/api/api/v1";
  const endpoint = `/users/home`;
  const url = `${baseUrl}${endpoint}`;

  const response = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json", Authorization: token },
    credentials: "include",
  });
  const responseJson = await response.json();

  return responseJson;
}
