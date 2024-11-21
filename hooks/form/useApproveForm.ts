import { fetchListUserByRole } from "@/api/form";
import { TListUserApproveInMultiTeamsParams, TListUserApproveParams, TUserApproveWithId } from "@/api/form/types";
import { useSession } from "@/contexts/ctx";
import { MyToast } from "@/ui/MyToast";
import { useCallback, useState } from "react";

export function useUserApprovesByRole() {
  const [users, setUsers] = useState<TUserApproveWithId[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { session } = useSession();

  const onFetchListUserByRole = useCallback(
    async ({ role, teamId }: TListUserApproveParams) => {
      const responseJson = await fetchListUserByRole(session, { role, teamId: teamId });
      return responseJson.data.users as TUserApproveWithId[];
    },
    [session]
  );

  const onFetchUsers = useCallback(
    async ({ role, teamId }: TListUserApproveParams) => {
      setIsLoading(true);
      try {
        const responseJson = await fetchListUserByRole(session, { role, teamId });
        if (responseJson.statusCode === 200) {
          return responseJson.data.users;
        } else {
          MyToast.error(responseJson.error);
        }
      } catch (error: any) {
        MyToast.error(error.message);
      } finally {
        setIsLoading(false);
      }
    },
    [session]
  );

  const onFetchUserApprovesInMultiTeams = useCallback(async ({ role, teamIds }: TListUserApproveInMultiTeamsParams) => {
    setIsLoading(true);

    try {
      if (teamIds.length === 0) setUsers([]);

      const promises = teamIds.map((teamId) => onFetchListUserByRole({ role, teamId: teamId }));
      const responseAll = await Promise.all(promises);

      const listUsers: TUserApproveWithId[] = [];
      for (const users of responseAll) {
        for (const user of users) listUsers.push(user);
      }
      setUsers(listUsers);
    } catch (error: any) {
      MyToast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  }, []);
  return { users, isLoading, onFetchUsers, onFetchUserApprovesInMultiTeams };
}
