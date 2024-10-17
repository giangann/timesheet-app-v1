import moment from "moment";

export const fetchTodayTimeKeeping = async (session: string | undefined | null) => {
  const token = `Bearer ${session}`;
  const date = moment(Date.now()).format("YYYY-MM-DD");
  const baseUrl = "https://proven-incredibly-redbird.ngrok-free.app/api/v1";
  const endpoint = "/timekeeping";
  const queryString = `?date=${date}`;
  const url = `${baseUrl}${endpoint}${queryString}`;

  const response = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json", Authorization: token ?? "" },
    credentials: "include",
  });

  const responseJson = await response.json();
  return responseJson;
};
