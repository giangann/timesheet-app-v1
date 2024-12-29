import { TeamCreateOrEdit } from "@/components/setting";
import { useLocalSearchParams } from "expo-router";

export default function EditTeam() {
  const local = useLocalSearchParams();
  const teamId = parseInt(local.id as string);
  return (
    <>
      <TeamCreateOrEdit teamId={teamId} />
    </>
  );
}
