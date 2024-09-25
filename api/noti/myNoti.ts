
export const fetchAllMyNotis = async (session: string | undefined | null) => {
  const token = `Bearer ${session}` ?? "xxx";
  const baseUrl = "https://proven-incredibly-redbird.ngrok-free.app/api/v1";
  const endpoint = "/notifications";
  const queryString = `?page=0&size=50`;

  const url = `${baseUrl}${endpoint}${queryString}`;

  const response = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json", Authorization: token ?? "" },
    credentials: "include",
  });

  const responseJson = await response.json();
  return responseJson;
};
