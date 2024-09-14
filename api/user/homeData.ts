export async function fetchHomeData(session: string) {
    const token = `Bearer ${session}` ?? "xxx";
  
    const baseUrl = "http://13.228.145.165:8080/api/v1";
    const endpoint = `/users/home`;
    const url = `${baseUrl}${endpoint}`;
  
    const response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json", Authorization: token },
      credentials: "include",
    });
    const responseJson = await response.json();
  
    return responseJson
  }
  