import { TRegisterPushToken } from "./type";

export async function registerExponentPushToken(session: string | undefined | null, data: TRegisterPushToken) {
  const token = `Bearer ${session}`;
  const baseUrl = "https://chamcong.vptw.dcs.vn/api/api/v1";
  const endpoint = "/notifications/registerExpoPushToken";

  const url = `${baseUrl}${endpoint}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: token ?? "" },
    body: JSON.stringify(data),
    credentials: "include",
  });

  const responseJson = await response.json();

  return responseJson;
}
