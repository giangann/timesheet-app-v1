import {
  TTimeKeepingCheckin,
  TTimeKeepingCheckinFormFields,
  TTimeKeepingMember,
  TTimeKeepingMemberParams,
  TWorkingType,
  fetchTodayTimeKeeping,
  fetchWorkingTypes,
  updateTodayTimeKeeping,
} from "@/api/time-keeping";
import { useSession } from "@/contexts";
import { MyToast } from "@/ui/MyToast";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";

export const useFetchTimeKeepingMembers = () => {
  const [tkMembers, setTkMembers] = useState<TTimeKeepingMember[]>([]);
  const [loading, setLoading] = useState(false);
  const { session } = useSession();

  const onFetchTimeKeepingMembers = async (params: TTimeKeepingMemberParams) => {
    setLoading(true);
    try {
      const responseJson = await fetchTodayTimeKeeping(session, params);
      if (responseJson.statusCode === 200) {
        setTkMembers(responseJson.data.timeKeeping.users);
      } else {
        MyToast.error(responseJson.error);
      }
    } catch (error: any) {
      MyToast.error(error.message);
    }
    setLoading(false);
  };

  return { tkMembers, isLoading: loading, onFetchTimeKeepingMembers };
};

export const useUpdateTimeKeeping = () => {
  const { session } = useSession();

  const onSaveTimeKeeping = useCallback(
    async (fieldValues: TTimeKeepingCheckinFormFields) => {
      try {
        const bodyData: TTimeKeepingCheckin = {
          ...fieldValues,
        };
        console.log(bodyData);

        const responseJson = await updateTodayTimeKeeping(session, bodyData);

        
        if (responseJson.statusCode === 200) {
          MyToast.success("Thành công");
        } else {
          MyToast.error(responseJson.error);
        }
      } catch (error: any) {
        MyToast.error(error.message);
      }
    },
    [session]
  );

  return { onSaveTimeKeeping };
};

export const useFetchWorkingTypes = () => {
  const [workingTypes, setWorkingTypes] = useState<TWorkingType[]>([]);
  const [loading, setLoading] = useState(false);
  const { session } = useSession();

  const onFetchWorkingTypes = useCallback(async () => {
    setLoading(true);

    try {
      const responseJson = await fetchWorkingTypes(session);
      if (responseJson.statusCode === 200) {
        setWorkingTypes(responseJson.data.workingTypes);
      } else {
        MyToast.error(responseJson.error);
      }
    } catch (error: any) {
      MyToast.error(error.message);
    } finally {
      setLoading(false);
    }
  }, [session]);

  useFocusEffect(
    useCallback(() => {
      onFetchWorkingTypes();
    }, [session])
  );
  return { workingTypes, isLoading: loading, onRefetchWorkingTypes: onFetchWorkingTypes };
};
