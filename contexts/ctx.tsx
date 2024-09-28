import { TCredentials, TUserInfo, loginByCredentials, verifyToken } from "@/api/auth";
import { useStorageState } from "@/hooks/useStorageState";
import { createContext, useContext, type PropsWithChildren } from "react";

const AuthContext = createContext<{
  signIn: (credentials: TCredentials) => Promise<void>;
  signOut: () => void;
  verifySessionToken: (token: string) => Promise<boolean>;
  session?: string | null;
  userInfo: TUserInfo | null;
  isLoading: boolean;
}>({
  signIn: () => Promise.resolve(), // Corrected this line
  signOut: () => null,
  verifySessionToken: () => Promise.resolve(false),
  session: null,
  userInfo: null,
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
  const [[_, userInfo], setUserInfo] = useStorageState("user");

  const signIn = async (credentials: TCredentials) => {
    const responseJson = await loginByCredentials(credentials);

    if (responseJson.statusCode === 200) {
      setSession(responseJson.data.token);
    } else {
      throw new Error(responseJson.error);
    }
  };

  const signOut = () => {
    setSession(null);
    setUserInfo(null);
  };

  const verifySessionToken = async (token: string) => {
    const responseJson = await verifyToken(token);

    if (responseJson.statusCode === 200) {
      const userInfo = responseJson.data.user;

      // Ensure the userInfo is saved as a string in storage
      setUserInfo(JSON.stringify(userInfo));

      return true;
    }
    return false;
  };

  return (
    <AuthContext.Provider
      value={{
        signIn,
        signOut,
        verifySessionToken,
        session,
        userInfo: typeof userInfo === "string" && userInfo ? JSON.parse(userInfo) : userInfo,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
