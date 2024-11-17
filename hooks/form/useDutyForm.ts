import { fetchDutySuggestedUsers } from "@/api/form";
import { TDutySuggestedUser, TDutySuggestedUserFilterParams } from "@/api/form/types";
import { fetchDutyTypes } from "@/api/setting";
import { TDutyType } from "@/api/setting/type";
import { DEFAULT_PAGI_PARAMS } from "@/constants/Misc";
import { useSession } from "@/contexts/ctx";
import { TPagiParams } from "@/types";
import { MyToast } from "@/ui/MyToast";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";

export function useDutyTypes() {
  const [dutyTypes, setDutyTypes] = useState<TDutyType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { session } = useSession();

  const onFetchDutyTypes = async () => {
    setIsLoading(true);
    try {
      const responseJson = await fetchDutyTypes(session);
      if (responseJson.statusCode === 200) {
        setDutyTypes(responseJson.data.dutyTypes);
      } else {
        MyToast.error(responseJson.error);
      }
    } catch (error: any) {
      MyToast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      onFetchDutyTypes();
    }, [session])
  );

  return { dutyTypes, isLoading, onFetchDutyTypes };
}

export function useSuggestDutyUsers() {
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState<TDutySuggestedUser[]>([]);
  const { session } = useSession();

  const onFetchDutySuggestedUsers = useCallback(async (pagiParams: TPagiParams, filterParams: TDutySuggestedUserFilterParams) => {
    setIsLoading(true);
    try {
      const responseJson = await fetchDutySuggestedUsers(session, pagiParams, filterParams);
      if (responseJson.statusCode === 200) {
        setUsers(responseJson.data.users);
      }
    } catch (error: any) {
      MyToast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { users, isLoading, onFetchDutySuggestedUsers };
}
