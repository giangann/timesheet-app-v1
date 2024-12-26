import { deleteSalaryCoefType, fetchSalaryCoefTypes } from "@/api/setting";
import { TSalaryCoefficientType } from "@/api/setting/type";
import { useSession } from "@/contexts/ctx";
import { MyToast } from "@/ui/MyToast";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";

export function useFetchSalaryCoefTypes() {
  const { session } = useSession();
  const [loading, setLoading] = useState(false);
  const [salaryCoefficientTypes, setSalaryCoefficientTypes] = useState<TSalaryCoefficientType[]>([]);

  const onFetchSalaryCoefTypes = async () => {
    setLoading(true);
    try {
      const responseJson = await fetchSalaryCoefTypes(session);
      if (responseJson.statusCode === 200) {
        setSalaryCoefficientTypes(responseJson.data.salaryCoefficientTypes);
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
      onFetchSalaryCoefTypes();
    }, [session])
  );

  return { isLoading: loading, salaryCoefficientTypes, refetch: onFetchSalaryCoefTypes };
}

export function useDeleteSalaryCoefType() {
  const [loading, setLoading] = useState(false);
  const { session } = useSession();

  const onDeleteSalaryCoefType = useCallback(
    async (salaryCoefTypeId: number) => {
      try {
        setLoading(true);
        const responseJson = await deleteSalaryCoefType(session, salaryCoefTypeId);
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
  return { loading, onDeleteSalaryCoefType };
}
