import { createDutyType, fetchAllTeamWithUsers } from "@/api/setting";
import { TDutyTypeCreate, TTeamUserSort } from "@/api/setting/type";
import { FormInput } from "@/components/FormInput";
import { CustomListAccordionWithCheckbox, CustomListItemWithCheckbox } from "@/components/accordion";
import { NunitoText } from "@/components/text/NunitoText";
import { useSession } from "@/contexts/ctx";
import { hasNullishValue, pickProperties } from "@/helper/common";
import { arrayObjectToMap, combineMaps, getMapKeysBySpecifyValue, getMapValues } from "@/helper/map";
import { AvatarByRole } from "@/ui/AvatarByRole";
import { MyToast } from "@/ui/MyToast";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { List } from "react-native-paper";

type CreateItem = {
  dutyTypeName: string | undefined;
};
type TTeam = {
  id: number;
  name: string;
  code: string | null;
};

export default function AddDutyType() {
  const [teamsWithUsers, setTeamsWithUsers] = useState<(TTeam & { users: TTeamUserSort[] })[]>([]);
  const { control, handleSubmit } = useForm<CreateItem>();
  const { session } = useSession();
  const router = useRouter();

  const maps = useMemo(() => {
    const temps: Map<string, boolean>[] = [];
    teamsWithUsers.forEach((team) => {
      const map = arrayObjectToMap(team.users, "id", false);
      temps.push(map);
    });

    return temps;
  }, [teamsWithUsers]);

  const map1 = useMemo(() => combineMaps(maps), [maps]);
  const onUpdateMap1 = useCallback(
    (userId: number, newStatus: boolean) => {
      const keyString = userId.toString();
      map1.set(keyString, newStatus);
    },
    [map1]
  );

  const onCreate = async (fieldValues: CreateItem) => {
    try {
      // Process form fieldsValues
      const requiredValues = pickProperties(fieldValues, ["dutyTypeName"]);
      if (hasNullishValue(requiredValues)) {
        MyToast.error("Hãy nhập đủ các thông tin yêu cầu");
        return;
      }
      if (!fieldValues.dutyTypeName) return;
      // map `fieldValues` to a `TDutyTypeCreate` object
      const dutyTypeData: TDutyTypeCreate = {
        dutyTypeName: fieldValues.dutyTypeName,
        userIds: getMapKeysBySpecifyValue(map1, true).map((idString) => parseInt(idString)),
      };
      // Make request
      const responseJson = await createDutyType(session, dutyTypeData);
      if (responseJson.statusCode === 200) {
        MyToast.success("Thành công");
        router.back();
      } else {
        MyToast.error(responseJson.error);
      }
    } catch (error: any) {
      MyToast.error(error.message);
    }
  };

  const onFetchAllTeamsWithUsers = async () => {
    try {
      const responseJson = await fetchAllTeamWithUsers(session);

      if (responseJson.statusCode === 200) {
        setTeamsWithUsers(responseJson.data.teams);
      } else {
        MyToast.error(responseJson.error);
      }
    } catch (error: any) {
      MyToast.error(error.message);
    }
  };

  useFocusEffect(
    useCallback(() => {
      onFetchAllTeamsWithUsers();
    }, [session])
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Your scrollable form inputs go here */}
        <FormInput formInputProps={{ control: control, name: "dutyTypeName" }} label="Tên loại trực" required placeholder="Nhập tên loại trực..." />

        {/* Accordions */}
        <NunitoText type="body2" style={{ color: "black" }}>
          Nhân viên tương ứng
        </NunitoText>
        <List.AccordionGroup>
          {teamsWithUsers.map((team) => (
            <TeamWithUsers onUpdateMap1={onUpdateMap1} team={team} key={team.id} />
          ))}
        </List.AccordionGroup>
        {/* Add more FormInput components as needed */}
      </ScrollView>
      <TouchableOpacity activeOpacity={0.8} onPress={handleSubmit(onCreate)} style={styles.buttonContainer}>
        <View style={styles.button}>
          <NunitoText type="body3" style={{ color: "white" }}>
            Tạo mới
          </NunitoText>
        </View>
      </TouchableOpacity>
    </View>
  );
}

type TeamWithUsersProps = {
  onUpdateMap1: (userId: number, newStatus: boolean) => void;
  team: TTeam & { users: TTeamUserSort[] };
};
const TeamWithUsers: React.FC<TeamWithUsersProps> = ({ team, onUpdateMap1 }) => {
  const [render, setRender] = useState(false);
  const forceRender = () => setRender((prev) => !prev);

  const checkedStatusMap = useMemo(() => arrayObjectToMap(team.users, "id", false), [team]);

  const isAccordionUncheck = useMemo(() => {
    return getMapValues(checkedStatusMap).includes(false);
  }, [checkedStatusMap, render]);

  const onUpdateAll = useCallback(
    (newStatus: boolean) => {
      checkedStatusMap.forEach((_v, k) => {
        // updated internal map
        checkedStatusMap.set(k, newStatus);
        // update parent map
        onUpdateMap1(parseInt(k), newStatus);
      });

      forceRender();
    },
    [checkedStatusMap]
  );

  const onUpdate = useCallback(
    (userId: number, newStatus: boolean) => {
      // updated internal map
      const keyString = userId.toString();
      checkedStatusMap.set(keyString, newStatus);

      // update parent map
      onUpdateMap1(userId, newStatus);

      forceRender();
    },
    [checkedStatusMap]
  );

  return (
    <CustomListAccordionWithCheckbox
      checkboxProps={{
        status: isAccordionUncheck ? "unchecked" : "checked",
        onPress: () => onUpdateAll(isAccordionUncheck ? true : false),
      }}
      title={<NunitoText type="body2" style={{ color: "black" }}>{`P. ${team.name}`}</NunitoText>}
      id={team.id}
      key={team.id}
      customContainerStyles={{ backgroundColor: `#EFF5FF`, borderRadius: 4 }}
      style={{ backgroundColor: `#EFF5FF`, borderRadius: 4 }}
    >
      {team.users.map((user) => {
        const isChecked = checkedStatusMap.get(user.id.toString()) ?? false;
        return (
          <CustomListItemWithCheckbox
            title={
              <View style={styles.teamUserContainer}>
                <AvatarByRole role={user.roleCode} customStyles={{}} />
                <View>
                  <NunitoText type="body3" style={{ color: "black" }}>
                    {user.name}
                  </NunitoText>
                  <NunitoText type="body4" style={{ color: "black" }}>
                    {user.roleName}
                  </NunitoText>
                </View>
              </View>
            }
            checkboxProps={{
              status: isChecked ? "checked" : "unchecked",
              onPress: () => onUpdate(user.id, !isChecked),
            }}
            key={user.id}
          />
        );
      })}
    </CustomListAccordionWithCheckbox>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    backgroundColor: "white",
  },
  scrollContent: {
    gap: 20,
    padding: 16,
    paddingBottom: 100, // Space at the bottom to prevent overlap with the button
  },

  teamUserContainer: {
    flexDirection: "row",
    gap: 16,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: "white", // Optional: To give the button a distinct background
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0B3A82",
    height: 44,
    borderRadius: 4,
  },
});
