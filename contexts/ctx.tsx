import { useStorageState } from "@/hooks/useStorageState";
import { useContext, createContext, type PropsWithChildren } from "react";

const AuthContext = createContext<{
  signIn: () => Promise<void>;
  signOut: () => void;
  session?: string | null;
  isLoading: boolean;
}>({
  signIn: () => Promise.resolve(), // Corrected this line
  signOut: () => null,
  session: null,
  isLoading: false,
});

// This hook can be used to access the user info.
export function useSession() {
  const value = useContext(AuthContext);
  if (process.env.NODE_ENV !== "production") {
    if (!value) {
      throw new Error("useSession must be wrapped in a <SessionProvider />");
    }
  }

  return value;
}

export function SessionProvider({ children }: PropsWithChildren) {
  const [[isLoading, session], setSession] = useStorageState("session");

  const signIn = async () => {
    try {
      const baseUrl = "http://13.228.145.165:8080/api/v1";
      const endpoint = "/auth/login";
      const url = `${baseUrl}${endpoint}`;
      const params = { identifyCard: "0123456789", password: "!Daxuti01011970" };

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
        credentials: "include",
      });

      const responseJson = await response.json();

      console.log(responseJson);

      if (responseJson.statusCode === 200) {
        console.log("login success");
        setSession(responseJson.data.token);
      } else {
        console.log("failure", responseJson.message);
      }
    } catch (error: any) {
      console.log("An error occured", error.message);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        signIn: signIn,
        signOut: () => {
          setSession(null);
        },
        session,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
