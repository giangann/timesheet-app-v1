import { fetchDutyTypes } from "@/api/setting";
import { TDutyType } from "@/api/setting/type";
import { useSession } from "@/contexts/ctx";
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
