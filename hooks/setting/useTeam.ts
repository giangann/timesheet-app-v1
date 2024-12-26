import { deleteTeam } from "@/api/team";
import { useSession } from "@/contexts";
import { MyToast } from "@/ui/MyToast";
import { useCallback, useState } from "react";

export function useDeleteTeam() {
    const [loading, setLoading] = useState(false);
    const { session } = useSession();
  
    const onDeleteTeam = useCallback(
      async (teamId: number) => {
        try {
          setLoading(true);
          const responseJson = await deleteTeam(session, teamId);
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
    return { loading, onDeleteTeam };
  }
  