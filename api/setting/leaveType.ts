import { BASE_URL } from "@/constants/System";

export async function fetchLeaveTypes(session: string | undefined | null) {
  const token = `Bearer ${session}`;

  const baseUrl = BASE_URL;
  const endpoint = "/leave-form-types";
  const url = `${baseUrl}${endpoint}`;

  const response = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json", Authorization: token },
    credentials: "include",
  });
  const responseJson = await response.json();

  return responseJson;
}

export async function deleteLeaveType(session: string | undefined | null, leaveTypeId: number) {
  const token = `Bearer ${session}`;

  const baseUrl = BASE_URL;
  const endpoint = `/leave-form-types/${leaveTypeId}`;
  const url = `${baseUrl}${endpoint}`;

  const response = await fetch(url, {
    method: "DELETE",
    headers: { "Content-Type": "application/json", Authorization: token },
    credentials: "include",
  });
  const responseJson = await response.json();

  return responseJson;
}
