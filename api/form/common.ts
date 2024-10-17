import { ROLE_CODE } from "@/constants/Misc";
import { TListUserApproveParams } from "./types";
import { paramsObjectToQueryString } from "@/helper/common";

export async function fetchListUserByRole(session: string | null | undefined, params: TListUserApproveParams) {
    const token = `Bearer ${session}`;

    const baseUrl = "https://proven-incredibly-redbird.ngrok-free.app/api/v1";
    const endpoint = "/users/list-user-by-role";


    const queryString = paramsObjectToQueryString(params);
    const url = `${baseUrl}${endpoint}${queryString}`;

    const response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json", Authorization: token },
        credentials: "include",
    });
    const responseJson = await response.json();

    return responseJson;
}