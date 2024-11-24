import { fetchDutyTypeDetail, updateDutyType } from "@/api/setting";
import { TDutyTypeDetail, TDutyTypeUpdate, TTeamUserSort } from "@/api/setting/type";
import { TTeam } from "@/api/team/type";
import { FormInput } from "@/components/FormInput";
import { CustomListAccordionWithCheckbox, CustomListItemWithCheckbox } from "@/components/accordion";
import { EditButton } from "@/components/button";
import { NunitoText } from "@/components/text/NunitoText";
import { OPACITY_TO_HEX } from "@/constants/Colors";
import { _mockDutyTypeDetail } from "@/constants/Misc";
import { useSession } from "@/contexts/ctx";
import { hasNullishValue, pickProperties } from "@/helper/common";
import { arrayObjectToMap, combineMaps, getMapKeysBySpecifyValue, getMapValues } from "@/helper/map";
import { AvatarByRole } from "@/ui/AvatarByRole";
import { MyToast } from "@/ui/MyToast";
import { useFocusEffect, useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useState } from "react";
import { UseFormReturn, useForm } from "react-hook-form";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button, List, Text, TouchableRipple, useTheme } from "react-native-paper";

type UpdateItem = {
  dutyTypeName: string | undefined;
};
export default function DutyTypeDetail() {
  // CONSTANTS
  const router = useRouter();
  const navigation = useNavigation();

  const local = useLocalSearchParams();
  const dutyTypeId = local.id as string;
  const dutyTypeName = local.dutyTypeName as string;

  const initDutyType: TDutyTypeDetail = {
    id: parseInt(dutyTypeId),
    name: dutyTypeName,
    teams: [],
  };

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<UpdateItem>({ defaultValues: { dutyTypeName: dutyTypeName } });

  const { session } = useSession();

  // STATES
  const [dutyType, setDutyType] = useState<TDutyTypeDetail>(initDutyType);
  const [isEdit, setIsEdit] = useState(false);

  // VARS
  const maps = useMemo(() => {
    if (!dutyType) return [];
    const temps: Map<string, boolean>[] = [];
    dutyType?.teams.forEach((team) => {
      const map = arrayObjectToMap<TTeamUserSort & { isActive: boolean }, "id", boolean>(team.users, "id", (user) => user.isActive);
      temps.push(map);
    });
    return temps;
  }, [dutyType]);
  const map1 = useMemo(() => combineMaps(maps), [maps]);

  // HANDLERS
  const toggleEditMode = () => setIsEdit((prev) => !prev);

  const onUpdateMap1 = useCallback(
    (userId: number, newStatus: boolean) => {
      const keyString = userId.toString();
      map1.set(keyString, newStatus);
    },
    [map1]
  );

  const onUpdateSideEffect = useCallback(
    (dutyTypeData: TDutyTypeUpdate) => {
      // update dutyTypeDetail in local
      const newDutyTypeName = dutyTypeData.dutyTypeName;
      const newDutyTypeTeams = dutyType.teams.map((team) => ({
        ...team,
        users: team.users.map((user) => ({
          ...user,
          isActive: map1.get(user.id.toString()) ?? false,
        })),
      }));
      setDutyType((prev) => ({ ...prev, dutyTypeName: newDutyTypeName, teams: newDutyTypeTeams }));
    },
    [map1]
  );

  const onUpdate = useCallback(
    async (fieldValues: UpdateItem) => {
      try {
        // Process form fieldsValues
        const requiredValues = pickProperties(fieldValues, ["dutyTypeName"]);
        if (hasNullishValue(requiredValues)) {
          MyToast.error("Hãy nhập đủ các thông tin yêu cầu");
          return;
        }
        if (!fieldValues.dutyTypeName) return;
        // map `fieldValues` to a `TDutyTypeCreate` object
        const dutyTypeData: TDutyTypeUpdate = {
          dutyTypeName: fieldValues.dutyTypeName,
          userIds: getMapKeysBySpecifyValue(map1, true).map((idString) => parseInt(idString)),
        };
        // Make request
        const responseJson = await updateDutyType(session, dutyTypeId, dutyTypeData);
        if (responseJson.statusCode === 200) {
          MyToast.success("Thành công");

          onUpdateSideEffect(dutyTypeData);
        } else {
          MyToast.error(responseJson.error);
        }
      } catch (error: any) {
        MyToast.error(error.message);
      } finally {
        toggleEditMode();
      }
    },
    [session, dutyTypeId, map1]
  );

  const onfetchDutyTypeDetail = async () => {
    try {
      const responseJson = await fetchDutyTypeDetail(session, dutyTypeId);

      if (responseJson.statusCode === 200) {
        setDutyType(responseJson.data.dutyType);
        // setDutyType({ ...initDutyType, ..._mockDutyTypeDetail });
      } else {
        MyToast.error(responseJson.error);
      }
    } catch (error: any) {
      MyToast.error(error.message);
    }
  };

  // EFFECTS
  useFocusEffect(
    useCallback(() => {
      onfetchDutyTypeDetail();
    }, [session, dutyTypeId, dutyTypeName])
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <EditButton isEdit={isEdit} onToggleEdit={toggleEditMode} />,
    });
  }, [router, isEdit, toggleEditMode]);

  return (
    <>
      {!dutyType && (
        <View>
          <NunitoText>Fetching...</NunitoText>
        </View>
      )}

      {dutyType && (
        <View style={styles.container}>
          <ScrollView contentContainerStyle={styles.listBox}>
            <Content dutyType={dutyType} formProps={{ control }} isEdit={isEdit} onUpdateMap1={onUpdateMap1} />
          </ScrollView>

          {isEdit && (
            <View style={styles.actionContainer}>
              <Button
                onPress={handleSubmit(onUpdate)}
                mode="contained"
                icon="content-save-all-outline"
                loading={isSubmitting}
                style={styles.buttonContained}
              >
                Lưu
              </Button>
            </View>
          )}
        </View>
      )}
    </>
  );
}

type ContentProps = {
  isEdit: boolean;
  formProps: Pick<UseFormReturn<UpdateItem>, "control">;
  dutyType: TDutyTypeDetail;
  onUpdateMap1: (userId: number, newStatus: boolean) => void;
};
const RawContent: React.FC<ContentProps> = ({ isEdit, formProps, dutyType, onUpdateMap1 }) => {
  const { control } = formProps;
  return (
    <>
      {isEdit && (
        <FormInput formInputProps={{ control: control, name: "dutyTypeName" }} label="Tên loại trực" required placeholder="Nhập tên loại trực..." />
      )}
      {!isEdit && <Item title="Tên loại trực" content={dutyType.name} />}

      {/* List users wrapper*/}
      <View style={styles.itemCustom}>
        <TeamGroup dutyType={dutyType} isEdit={isEdit} onUpdateMap1={onUpdateMap1} />
      </View>
    </>
  );
};
const Content = React.memo(RawContent);

type TeamGroupProps = {
  dutyType: TDutyTypeDetail;
  isEdit: boolean;
  onUpdateMap1: (userId: number, newStatus: boolean) => void;
};
const RawTeamGroup: React.FC<TeamGroupProps> = ({ dutyType, isEdit, onUpdateMap1 }) => {
  return (
    <>
      <NunitoText type="body2" style={{ opacity: 0.5 }}>
        Nhân viên tương ứng
      </NunitoText>
      <List.AccordionGroup>
        {dutyType.teams.map((team) => (
          <Team isEdit={isEdit} onUpdateMap1={onUpdateMap1} team={team} key={team.id} />
        ))}
      </List.AccordionGroup>
    </>
  );
};
const TeamGroup = React.memo(RawTeamGroup);

type TeamProps = {
  team: TTeam & { users: (TTeamUserSort & { isActive: boolean })[] };
  onUpdateMap1: (userId: number, newStatus: boolean) => void;
  isEdit: boolean;
};
const Team: React.FC<TeamProps> = ({ team, isEdit, onUpdateMap1 }) => {
  const [render, setRender] = useState(false);
  const forceRender = () => setRender((prev) => !prev);

  const checkedStatusMap = useMemo(
    () => arrayObjectToMap<TTeamUserSort & { isActive: boolean }, "id", boolean>(team.users, "id", (user) => user.isActive),
    [team]
  );

  const users = useMemo(() => (isEdit ? team.users : team.users.filter((user) => user.isActive)), [team, isEdit]);

  const numOfActiveUserOrigin = useMemo(() => team.users.filter((user) => user.isActive).length, [team]);
  const numOfActiveUser = useMemo(() => getMapValues(checkedStatusMap).filter((isActive) => isActive).length, [checkedStatusMap, render]);

  const isAccordionUncheck = useMemo(() => {
    return numOfActiveUser < team.users.length;
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
    <>
      {(isEdit || numOfActiveUserOrigin > 0) && (
        <CustomListAccordionWithCheckbox
          isShowCheckbox={isEdit}
          checkboxProps={{
            status: isEdit ? (isAccordionUncheck ? "unchecked" : "checked") : "indeterminate",
            onPress: () => onUpdateAll(isAccordionUncheck ? true : false),
          }}
          title={<NunitoText type="body2" style={{ color: "black", textTransform: "none" }}>{`P. ${team.name} (${numOfActiveUser})`}</NunitoText>}
          id={team.id}
          key={team.id}
          customContainerStyles={{ backgroundColor: `#EFF5FF`, borderRadius: 4 }}
          style={{ backgroundColor: `#EFF5FF`, borderRadius: 4 }}
          showDivide={true}
        >
          {users.map((user) => {
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
                isShowCheckbox={isEdit}
                checkboxProps={{
                  status: isEdit ? (isChecked ? "checked" : "unchecked") : "indeterminate",
                  onPress: () => onUpdate(user.id, !isChecked),
                }}
                key={user.id}
              />
            );
          })}
        </CustomListAccordionWithCheckbox>
      )}
    </>
  );
};

const Item = ({ title, content }: { title: string; content: string }) => {
  return (
    <View style={styles.item}>
      <NunitoText type="body3" style={{ opacity: 0.5 }}>
        {title}
      </NunitoText>
      <NunitoText type="body3">{content}</NunitoText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    minHeight: "100%",
  },
  listBox: {
    padding: 16,
    paddingBottom: 80,
    gap: 20,
  },
  item: {
    gap: 2,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: `#000000${OPACITY_TO_HEX["15"]}`,
  },

  itemCustom: {
    gap: 8,
  },
  actionContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 6,
  },
  buttonItem: {
    flexGrow: 1,
  },
  buttonContained: {
    borderRadius: 4,
    height: 44,
  },
  buttonOutlined: {
    justifyContent: "center",
    alignItems: "center",
    height: 44,
    borderColor: "#0B3A82",
    borderWidth: 1,
    borderRadius: 4,
  },

  teamUserContainer: {
    flexDirection: "row",
    gap: 16,
  },
});
