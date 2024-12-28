import { createTeam, deleteTeam, editTeam, fetchTeam } from "@/api/team";
import { TTeam, TTeamCreate, TTeamDetail, TTeamEdit } from "@/api/team/type";
import { useSession } from "@/contexts";
import { MyToast } from "@/ui/MyToast";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
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

export function useCreateTeam() {
  const [loading, setLoading] = useState(false);
  const { session } = useSession();
  const router = useRouter();

  const onCreateTeam = useCallback(
    async (data: TTeamCreate) => {
      try {
        setLoading(true);

        const responseJson = await createTeam(session, data);
        if (responseJson.statusCode === 200) {
          MyToast.success("Thành công");
          router.back();
        } else {
          MyToast.error(responseJson.error);
        }
      } catch (error: any) {
        MyToast.error(error.message);
      } finally {
        setLoading(false);
      }
    },
    [session, router]
  );

  return { onCreateTeam, loading };
}

export function useEditTeam() {
  const [loading, setLoading] = useState(false);
  const { session } = useSession();
  const router = useRouter();

  const onEditTeam = useCallback(
    async (teamId: number, data: TTeamEdit) => {
      try {
        setLoading(true);

        const responseJson = await editTeam(session, teamId, data);
        if (responseJson.statusCode === 200) {
          MyToast.success("Thành công");
          router.back();
        } else {
          MyToast.error(responseJson.error);
        }
      } catch (error: any) {
        MyToast.error(error.message);
      } finally {
        setLoading(false);
      }
    },
    [session, router]
  );

  return { onEditTeam, loading };
}

export function useTeamDetail() {
  const { session } = useSession();
  const [loading, setLoading] = useState(false);
  const [team, setTeam] = useState<TTeamDetail | null>(null);

  const onFetchTeamDetail = useCallback(
    async (teamId: number) => {
      setLoading(true);
      try {
        const responseJson = await fetchTeam(session, teamId);

        if (responseJson.statusCode === 200) {
          setTeam(responseJson.data.team);
          return responseJson.data.team;
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

  return { isLoading: loading, team, onFetchTeamDetail };
}
