import { NunitoText } from "@/components/text/NunitoText";
import { OPACITY_TO_HEX } from "@/constants/Colors";
import { ROLE_CODE } from "@/constants/Misc";
import { AvatarByRole } from "@/ui/AvatarByRole";
import { MyCheckRadio } from "@/ui/MyCheckRadio";
import { useFocusEffect } from "expo-router";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, TouchableOpacity, View, ViewStyle } from "react-native";

type TWorkingType = {
  id: number;
  name: string;
};

type TTimeKeepingMember = {
  name: string;
  identifyCard: string;
  roleId: number;
  roleName: string;
  roleCode: ROLE_CODE;
  workingTypeId: number | null;
  workingTypeName: string | null;
};

type TTimeKeepingMemberEdit = {
  userIdentifyCard: string;
  workingTypeId: number;
};

const workingTypesDefault: TWorkingType[] = [
  {
    id: 1,
    name: "Cả công",
  },
  {
    id: 2,
    name: "Nửa công",
  },
];

const memberDefault1 = {
  name: "Đặng Minh Chính",
  identifyCard: "000000001111",
  roleId: 4,
  roleName: "Lãnh đạo phòng",
  roleCode: ROLE_CODE.TEAM_DIRECTOR,
  workingTypeId: null,
  workingTypeName: null,
};
const memberDefault2 = {
  name: "Đặng Xuân Tiến",
  identifyCard: "0123456789",
  roleId: 4,
  roleName: "Văn thư",
  roleCode: ROLE_CODE.ARCHIVIST,
  workingTypeId: 1,
  workingTypeName: "Cả công",
};

const memberDefault3 = {
  name: "Nguyễn Văn Khái",
  identifyCard: "000011111111",
  roleId: 4,
  roleName: "Chuyên viên",
  roleCode: ROLE_CODE.SPECIALIST,
  workingTypeId: 1,
  workingTypeName: null,
};

const members = [memberDefault1, memberDefault2, memberDefault3];

export default function TodayTimeKeeping() {
  const workingTypes = workingTypesDefault;
  const [memberList, setMemberList] = useState<TTimeKeepingMember[]>([]);
  const [editTimeKeepingMembers, setEditTimeKeepingMembers] = useState<TTimeKeepingMemberEdit[]>([]);
  const [selectedIdCards, setSelectedIdCards] = useState<string[]>([]);
  const [isEdit, setIsEdit] = useState(false);
  const [disabledUpdate, setDisabledUpdate] = useState(true);
  const [isSelectAll, setIsSelectAll] = useState(false);

  const onToggleEdit = () => {
    setIsEdit(!isEdit);
    setSelectedIdCards([]);
    setIsSelectAll(false);
  };

  const onChooseSelectAll = () => {
    const newSelectedIdCards = memberList.map((member) => member.identifyCard);
    setSelectedIdCards([...newSelectedIdCards]);

    setIsSelectAll(true);
  };

  const onChooseUnselectAll = () => {
    setSelectedIdCards([]);
    setIsSelectAll(false);
  };

  const onEditTimeKeepingMember = (selectedWorkingTypeId: number) => {
    // create Map to save current editedTimeKeepingMembers
    const editedTKMap = new Map<string, TTimeKeepingMemberEdit>();
    editTimeKeepingMembers.forEach((tkMem) => editedTKMap.set(tkMem.userIdentifyCard, tkMem));

    // reflect selectedIdCards and workingTypeId to editTimeKeepingMembers
    const newTimeKeepingMembers: TTimeKeepingMemberEdit[] = selectedIdCards.map((idCard) => ({
      userIdentifyCard: idCard,
      workingTypeId: selectedWorkingTypeId,
    }));
    newTimeKeepingMembers.forEach((tkMem) => editedTKMap.set(tkMem.userIdentifyCard, tkMem));

    // get array from map and update current array
    const newEditedTimeKeepingMembers: TTimeKeepingMemberEdit[] = Object.entries(editedTKMap).map(([k, v]) => v);
    setEditTimeKeepingMembers([...newEditedTimeKeepingMembers]);
  };

  const onUpdateMemberList = (selectedWorkingTypeId: number) => {
    const selectedWorkingType: TWorkingType = workingTypes.filter((wkType) => wkType.id === selectedWorkingTypeId)?.[0] ?? {
      id: -1,
      name: "Unknown WkType",
    };
    //
    const memberListMap = new Map<string, TTimeKeepingMember>();
    memberList.forEach((mem) => memberListMap.set(mem.identifyCard, mem));

    //
    for (const idCard of selectedIdCards) {
      const mem = memberListMap.get(idCard);
      if (!mem) continue;

      const memUpdated: TTimeKeepingMember = {
        ...mem,
        workingTypeId: selectedWorkingType.id,
        workingTypeName: selectedWorkingType.name,
      };
      memberListMap.set(idCard, memUpdated);
    }

    //
    const updatedMemList = Object.entries(memberListMap).map(([k, v]) => v);
    setMemberList([...updatedMemList]);
  };

  const onMarkWkType = (chooseWkTypeId: number) => {
    onEditTimeKeepingMember(chooseWkTypeId);
    onUpdateMemberList(chooseWkTypeId);
    onToggleEdit()
  };

  const updateSelectedIdCards = (method: "add" | "remove", selectedIdCard: string) => {
    if (method === "add") {
      setSelectedIdCards([...selectedIdCards, selectedIdCard]);
    }
    if (method === "remove") {
      const newSelectedIdCards = selectedIdCards.filter((idCard) => idCard !== selectedIdCard);
      setSelectedIdCards([...newSelectedIdCards]);
    }
  };

  useFocusEffect(React.useCallback(() => setMemberList(members), []));

  return (
    <View style={styles.container}>
      {/* option bar */}
      {!isEdit && (
        <View style={styles.optionBarDefault}>
          <NunitoText type="body3">{moment(Date.now()).format("DD/MM/YYYY")}</NunitoText>
          <Pressable onPress={onToggleEdit} style={styles.editPressable}>
            <NunitoText type="body3" lightColor="#0B3A82">
              Sửa
            </NunitoText>
          </Pressable>
        </View>
      )}
      {isEdit && (
        <View style={styles.optionBarDefault}>
          <View style={styles.optionBarItemIsEdit}>
            <Pressable onPress={onToggleEdit} style={styles.editPressable}>
              <NunitoText type="body3" lightColor="#0B3A82">
                Thoát
              </NunitoText>
            </Pressable>
          </View>
          <View style={[styles.optionBarItemIsEdit, { flexGrow: 1.5 }]}>
            {selectedIdCards.length === 0 && <NunitoText>Chọn thành viên</NunitoText>}
            {selectedIdCards.length > 0 && <NunitoText>{selectedIdCards.length} đã chọn</NunitoText>}
          </View>
          <View style={styles.optionBarItemIsEdit}>
            {!isSelectAll && (
              <Pressable onPress={onChooseSelectAll} style={styles.editPressable}>
                <NunitoText type="body3" lightColor="#0B3A82">
                  Chọn tất cả
                </NunitoText>
              </Pressable>
            )}

            {isSelectAll && (
              <Pressable onPress={onChooseUnselectAll} style={styles.editPressable}>
                <NunitoText type="body3" lightColor="#0B3A82">
                  Bỏ chọn tất cả
                </NunitoText>
              </Pressable>
            )}
          </View>
        </View>
      )}

      {/* member list */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {memberList.map((member, index) => (
          <MemberItem key={index} updateSelectedIdCards={updateSelectedIdCards} isEdit={isEdit} member={member} isSelectAll={isSelectAll} />
        ))}
      </ScrollView>

      {/* action bar */}
      {isEdit && (
        <View style={styles.actionBar}>
          {workingTypes.map((wkType) => (
            <Pressable key={wkType.id} onPress={() => onMarkWkType(wkType.id)}>
              <NunitoText type="body3" lightColor="#0B3A82">
                {wkType.name}
              </NunitoText>
            </Pressable>
          ))}
        </View>
      )}

      {!isEdit && (
        <TouchableOpacity onPress={() => {}} disabled={disabledUpdate} activeOpacity={0.8} style={styles.buttonContainer}>
          <View style={disabledUpdate ? [styles.button, styles.buttonDisabled] : styles.button}>
            <NunitoText type="body3" style={disabledUpdate ? [styles.buttonText, styles.buttonTextDisabled] : styles.buttonText}>
              Cập nhật
            </NunitoText>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
}

type MemberItemProps = {
  isEdit: boolean;
  member: TTimeKeepingMember;
  updateSelectedIdCards: (method: "add" | "remove", selectedIdCard: string) => void;
  isSelectAll: boolean;
};
const MemberItem: React.FC<MemberItemProps> = ({ isEdit, member, updateSelectedIdCards, isSelectAll }) => {
  const [selected, setSelected] = useState(false);

  const onToggleSelected = () => setSelected(!selected);

  const onSelect = () => {
    updateSelectedIdCards(selected ? "remove" : "add", member.identifyCard);
    onToggleSelected();
  };

  useEffect(() => {
    setSelected(false);
  }, [isEdit]);

  useEffect(() => {
    if (isSelectAll) {
      setSelected(true);
    } else {
      setSelected(false);
    }
  }, [isSelectAll]);
  return (
    <Pressable onPress={onSelect} disabled={!isEdit}>
      <View style={styles.memberItemContainer}>
        <View style={styles.memberInfoWrapper}>
          {isEdit && <MyCheckRadio checked={selected} />}
          <View style={styles.memberInfo}>
            {/* avatar */}
            <AvatarByRole role={member.roleCode} />

            {/* name, role */}
            <View>
              <NunitoText type="body3">{member.name}</NunitoText>
              <NunitoText type="body4" style={{ opacity: 0.75 }}>
                {member.roleName}
              </NunitoText>
            </View>
          </View>
        </View>

        <View style={styles.timekeepingStatus}>
          <NunitoText type="body4" style={{ opacity: 0.675 }}>
            {member.workingTypeName ?? "Chưa chấm"}
          </NunitoText>
        </View>
      </View>
    </Pressable>
  );
};

const optionBarStyle: ViewStyle = {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",

  paddingBottom: 16,
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 0,
    height: "100%",
  },
  optionBarDefault: {
    ...optionBarStyle,
  },
  optionBarIsEdit: {
    ...optionBarStyle,
  },
  optionBarItemIsEdit: {
    flexBasis: 1,
    flexGrow: 1,
  },
  editPressable: {
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  scrollContent: {
    gap: 16,
    paddingBottom: 100,
  },
  memberItemContainer: {
    backgroundColor: `#0B3A82${OPACITY_TO_HEX["15"]}`,
    borderRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 12,

    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  memberInfoWrapper: {
    flexDirection: "row",
    gap: 12,

    alignItems: "center",
    justifyContent: "space-between",
  },
  memberInfo: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    gap: 16,
  },
  timekeepingStatus: {},
  actionBar: {
    paddingVertical: 16,

    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 48,
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
  buttonDisabled: {
    backgroundColor: `#000000${OPACITY_TO_HEX["15"]}`,
  },
  buttonText: {
    color: "white",
  },
  buttonTextDisabled: {
    color: `#000000${OPACITY_TO_HEX["30"]}`,
  },
});
