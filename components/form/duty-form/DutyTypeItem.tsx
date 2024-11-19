import { TCheckAction } from "@/api/form/types";
import { NunitoText } from "@/components/text/NunitoText";
import { NoData } from "@/ui/NoData";
import { Entypo } from "@expo/vector-icons";
import { memo, useCallback, useMemo, useState } from "react";
import { StyleSheet, TouchableHighlight, View } from "react-native";
import { Divider, Menu } from "react-native-paper";
import { SelectDutyTypeUsersModal } from "./SelectDutyTypeUsersModal";
import { OPACITY_TO_HEX } from "@/constants/Colors";
import { arrayObjectToMap } from "@/helper/map";

type DutyTypeItemUserInfo = {
  id: number;
  name: string;
  roleName: string;
  teamName: string;
  teamId: number;
};
type DutyTypeItemProps = {
  dutyType: {
    dutyTypeId: number;
    dutyTypeName: string;
  };
  users: DutyTypeItemUserInfo[];
  selectedUserIds: number[];
  deleteDutyType: (index: number) => void;
  fieldArrayIndex: number;
  updateDutyTypeUserIds: (index: number, userId: number) => void;
  updateUserApproves: () => void;
  updateTeamIds: (newTeamId: number, action: TCheckAction) => void;
};
export const DutyTypeItem: React.FC<DutyTypeItemProps> = memo(
  ({ users, selectedUserIds, dutyType, deleteDutyType, fieldArrayIndex, updateDutyTypeUserIds, updateTeamIds, updateUserApproves }) => {
    // States
    const [visible, setVisible] = useState(false);
    const [openSelectUsersModal, setOpenSelectUsersModal] = useState(false);

    // Variables
    const allUsersMap: Map<string, DutyTypeItemUserInfo> = useMemo(() => arrayObjectToMap(users, "id"), [users]);
    const selectedUsers: DutyTypeItemUserInfo[] = useMemo(() => {
      return selectedUserIds.map((userId: number) => {
        const userInfo = allUsersMap.get(userId.toString()) as DutyTypeItemUserInfo;
        return userInfo;
      });
    }, [selectedUserIds]);
    console.log({ selectedUsers });
    const isNoUser = useMemo(() => selectedUserIds.length <= 0, [selectedUserIds]);

    // Handlers
    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);

    const openFullScrModal = () => setOpenSelectUsersModal(true);
    const closeFullScrModal = () => {
      setOpenSelectUsersModal(false);
      updateUserApproves();
    };

    const addOrRemoveUserId = useCallback(
      (userId: number) => {
        updateDutyTypeUserIds(fieldArrayIndex, userId);
      },
      [updateDutyTypeUserIds, fieldArrayIndex]
    );

    // press delete item of menu handler
    const onPressAttendee = useCallback(() => {
      closeMenu();
      openFullScrModal();
    }, []);
    const onPressDelete = useCallback(() => {
      deleteDutyType(fieldArrayIndex);
    }, [deleteDutyType, fieldArrayIndex]);

    return (
      <View style={styles.dutyTypeItemBox}>
        <View style={styles.dutyTypeItemContainer}>
          {/* Duty name */}
          <View style={styles.dutyTypeNameContainer}>
            <View style={styles.bulletBox}>
              <View style={styles.bullet} />
            </View>
            <NunitoText type="body2" style={styles.dutyTypeName}>
              {dutyType.dutyTypeName}
            </NunitoText>
          </View>

          {/* Duty users */}
          {isNoUser && (
            <View>
              <NoData message="Chưa có thành viên được chọn" />
            </View>
          )}

          {!isNoUser && (
            <View style={styles.dutyTypeUserContainer}>
              {selectedUsers.map((user) => (
                <View style={styles.dutyTypeUser} key={user.id}>
                  <NunitoText type="body3" style={styles.dutyTypeUserName}>
                    {`${user.name} - ${user.roleName}`}
                  </NunitoText>
                  <NunitoText type="body4" style={styles.dutyTypeUserTeam}>
                    {user.teamName}
                  </NunitoText>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Menu */}
        <View style={styles.iconThreeDotsAbsBox}>
          <Menu
            visible={visible}
            onDismiss={closeMenu}
            anchor={
              <TouchableHighlight underlayColor={`#000000${OPACITY_TO_HEX["15"]}`} onPress={openMenu} style={styles.iconThreeDotsBtn}>
                <Entypo name="dots-three-vertical" size={18} color="black" />
              </TouchableHighlight>
            }
          >
            <Menu.Item onPress={onPressAttendee} title="Thành viên" />
            <Divider />
            <Menu.Item onPress={onPressDelete} title="Xóa" />
          </Menu>
        </View>

        {/* Select users modal */}
        {openSelectUsersModal && (
          <SelectDutyTypeUsersModal
            onClose={closeFullScrModal}
            dutyType={dutyType}
            selectedUserIds={selectedUserIds}
            onAddOrRemoveUserId={addOrRemoveUserId}
            updateTeamIds={updateTeamIds}
          />
        )}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  dutyTypeItemBox: {
    position: "relative",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 14,
    backgroundColor: `#CADCE8`,
    borderRadius: 4,
  },
  iconThreeDotsAbsBox: {
    position: "absolute",
    right: 0,
    top: 0,
  },
  iconThreeDotsBtn: {
    padding: 12,
    borderRadius: 20,
  },
  dutyTypeItemContainer: {
    flexDirection: "column",
    gap: 10,
  },

  dutyTypeName: {
    color: "black",
  },
  dutyTypeNameContainer: {
    flexDirection: "row",
    gap: 4,
  },
  bulletBox: {
    position: "relative",
    top: 2,
  },
  bullet: {
    width: 3,
    height: 14,
    backgroundColor: `#0B3A82`,
    borderRadius: 1,
  },
  dutyTypeUserContainer: {
    gap: 10,
    paddingLeft: 16,
  },
  dutyTypeUser: {},
  dutyTypeUserName: {
    color: "black",
  },
  dutyTypeUserTeam: {
    color: "black",
    opacity: 0.75,
  },

});
