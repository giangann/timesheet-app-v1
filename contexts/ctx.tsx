import { loginByCredentials, TCredentials } from "@/api/auth";
import { useStorageState } from "@/hooks/useStorageState";
import { createContext, useContext, type PropsWithChildren } from "react";

const AuthContext = createContext<{
  signIn: (credentials: TCredentials) => Promise<void>;
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

  const signIn = async (credentials: TCredentials) => {
    const responseJson = await loginByCredentials(credentials);

    if (responseJson.statusCode === 200) {
      console.log("login success");
      setSession(responseJson.data.token);
    } else {
      throw new Error(responseJson.message);
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
