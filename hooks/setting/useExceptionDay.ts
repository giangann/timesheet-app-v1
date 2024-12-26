import { deleteExceptionDay } from "@/api/setting";
import { useSession } from "@/contexts";
import { MyToast } from "@/ui/MyToast";
import { useCallback, useState } from "react";

export function useDeleteExceptionDay() {
  const [loading, setLoading] = useState(false);
  const { session } = useSession();

  const onDeleteExceptionDay = useCallback(
    async (exceptionDayId: number) => {
      try {
        setLoading(true);
        const responseJson = await deleteExceptionDay(session, exceptionDayId);
        if (responseJson.statusCode === 200) {
          MyToast.success("Xóa thành công");
        } else {
          MyToast.error(responseJson.error ?? responseJson.message);
        }
      } catch (error: any) {
        MyToast.error(error.message);
      } finally {
        setLoading(false);
      }
    },
    [session]
  );
  return { loading, onDeleteExceptionDay };
}
