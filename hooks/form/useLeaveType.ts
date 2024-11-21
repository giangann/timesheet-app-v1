import { TLeaveType } from "@/api/form/types";
import { fetchLeaveTypes, fetchSalaryCoefTypes } from "@/api/setting";
import { useSession } from "@/contexts/ctx";
import { MyToast } from "@/ui/MyToast";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";

export function useLeaveType() {
  const { session } = useSession();
  const [loading, setLoading] = useState(false);
  const [leaveTypes, setLeaveTypes] = useState<TLeaveType[]>([]);

  const onFetchLeaveTypes = async () => {
    setLoading(true);
    try {
      const responseJson = await fetchLeaveTypes(session);
      if (responseJson.statusCode === 200) {
        setLeaveTypes(responseJson.data.leaveFormTypes);
      } else {
        MyToast.error(responseJson.error);
      }
    } catch (error: any) {
      MyToast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      onFetchLeaveTypes();
    }, [session])
  );

  return { isLoading: loading, leaveTypes, refetch: onFetchLeaveTypes };
}
