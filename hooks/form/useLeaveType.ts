import { TLeaveType } from "@/api/form/types";
import { deleteLeaveType, fetchLeaveTypes, fetchSalaryCoefTypes } from "@/api/setting";
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

export function useDeleteLeaveType() {
  const [loading, setLoading] = useState(false);
  const { session } = useSession();

  const onDeleteLeaveType = useCallback(
    async (leaveTypeId: number) => {
      try {
        setLoading(true);
        const responseJson = await deleteLeaveType(session, leaveTypeId);
        if (responseJson.statusCode === 200) {
          MyToast.success("Xóa thành công");
        } else {
          MyToast.error(responseJson.error);
        }
      } catch (error: any) {
        MyToast.error(error.message);
      } finally {
        setLoading(false);
      }
    },
    [session]
  );
  return { loading, onDeleteLeaveType };
}
