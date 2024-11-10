
import { fetchDutyTypeDetail } from "@/api/setting";
import { TDutyTypeDetail, TTeamUserSort } from "@/api/setting/type";
import { TTeam } from "@/api/team/type";
import { CustomListAccordionWithCheckbox, CustomListItemWithCheckbox } from "@/components/accordion";
import { EditButton } from "@/components/button";
import { NunitoText } from "@/components/text/NunitoText";
import { OPACITY_TO_HEX } from "@/constants/Colors";
import { _mockDutyTypeDetail } from "@/constants/Misc";
import { useSession } from "@/contexts/ctx";
import { AvatarByRole } from "@/ui/AvatarByRole";
import { MyToast } from "@/ui/MyToast";
import { useFocusEffect, useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useCallback, useLayoutEffect, useMemo, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { List } from "react-native-paper";

export default function DutyTypeDetail() {
  const router = useRouter();
  const navigation = useNavigation();

  const local = useLocalSearchParams();
  const dutyTypeId = local.id as string;
  const dutyTypeName = local.dutyTypeName as string;

  const [dutyType, setDutyType] = useState<TDutyTypeDetail>();
  const [isEdit, setIsEdit] = useState(false);
  const toggleEditMode = () => setIsEdit((prev) => !prev);

  const { session } = useSession();

  const onfetchDutyTypeDetail = async () => {
    try {
      const responseJson = await fetchDutyTypeDetail(session, dutyTypeId);

      if (responseJson.statusCode === 200) {
        // setDutyType({ ...responseJson.data, dutyTypeName: dutyTypeName, id: parseInt(dutyTypeId) });
        setDutyType({ ..._mockDutyTypeDetail, dutyTypeName: dutyTypeName, id: parseInt(dutyTypeId) });
      } else {
        MyToast.error(responseJson.error);
      }
    } catch (error: any) {
      MyToast.error(error.message);
    }
  };

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
        <ScrollView contentContainerStyle={[styles.listBox, styles.container]}>
          <Item title="Tên loại trực" content={dutyType.dutyTypeName} />

          {/* List users wrapper*/}
          <View style={styles.itemCustom}>
            <NunitoText type="body2" style={{ opacity: 0.5 }}>
              Nhân viên tương ứng
            </NunitoText>

            {/* List users */}
            <List.AccordionGroup>
              {dutyType.teams.map((team) => (
                <Team key={team.id} team={team} />
              ))}
            </List.AccordionGroup>
          </View>
        </ScrollView>
      )}
    </>
  );
}

type TeamProps = {
  team: TTeam & { users: (TTeamUserSort & { isActive: boolean })[] };
};
const Team: React.FC<TeamProps> = ({ team }) => {
  const numOfActiveUser = useMemo(() => team.users.filter((user) => user.isActive).length, [team]);
  return (
    <>
      {numOfActiveUser > 0 && (
        <CustomListAccordionWithCheckbox
          isShowCheckbox={false}
          checkboxProps={{
            status: "indeterminate",
          }}
          title={
            <NunitoText type="body2" style={{ color: "black", textTransform: "none" }}>{`P. ${team.name} (${numOfActiveUser})`}</NunitoText>
          }
          id={team.id}
          key={team.id}
          customContainerStyles={{ backgroundColor: `#EFF5FF`, borderRadius: 4 }}
          style={{ backgroundColor: `#EFF5FF`, borderRadius: 4 }}
          showDivide={true}
        >
          {team.users.map((user) => {
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
                  status: "indeterminate",
                }}
                isShowCheckbox={false}
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
    padding: 16,
    paddingBottom: 0,
    backgroundColor: "white",
    minHeight: "100%",
  },
  listBox: {
    paddingBottom: 16,
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
  approveContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: "white", // Optional: To give the button a distinct background
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 6,
  },
  buttonItem: {
    flexGrow: 1,
  },
  buttonContained: {
    justifyContent: "center",
    alignItems: "center",
    height: 44,
    backgroundColor: "#0B3A82",
    borderRadius: 4,
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
