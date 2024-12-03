import { fetchListUserOfGroup } from "@/api/group";
import { TGroupUser } from "@/api/group/type";
import { useSession } from "@/contexts";
import { MyToast } from "@/ui/MyToast";
import { useCallback, useEffect, useState } from "react";

export const useGroupUser = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState<TGroupUser[]>([]);
  const { session } = useSession();

  const onFetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const responseJson = await fetchListUserOfGroup(session, { page: 0, size: 100 });
      if (responseJson.statusCode === 200) {
        setUsers(responseJson.data.users);
      } else {
        MyToast.error(responseJson.error ?? responseJson.message);
      }
    } catch (error: any) {
      MyToast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  }, [session]);

  useEffect(() => {
    onFetchUsers();
  }, [onFetchUsers]);

  return { users, isLoading, refetchUsers: onFetchUsers };
};
