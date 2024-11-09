import { useStorageState } from "@/hooks/useStorageState";
import { useCallback, useMemo } from "react";

export const useHasRegisterEPTInCurrentLoginSession = () => {
  const [[_isLoading, hasRegisterValue], setHasRegister] = useStorageState("has-register-ept-token-in-current-loggin-session");

  const hasRegister: boolean | null = useMemo(() => {
    if (hasRegisterValue === "true") return true;
    if (hasRegisterValue === "false") return false;
    return null;
  }, [hasRegisterValue]);

  const markHasRegister = useCallback((hasRegister: boolean) => {
    if (hasRegister === true) {
      setHasRegister("true");
    }
    if (hasRegister === false) {
      setHasRegister("false");
    }
  }, []);

  return { hasRegister, markHasRegister };
};
