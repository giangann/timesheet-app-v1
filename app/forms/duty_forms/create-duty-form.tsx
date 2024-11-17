import { TDutyFormCreate, TDutyFormCreateDutyTypeField, TDutySuggestedUser } from "@/api/form/types";
import { fetchSalaryCoefTypes } from "@/api/setting";
import { TSalaryCoefficientType } from "@/api/setting/type";
import { Delayed } from "@/components/Delayed";
import { FormInput } from "@/components/FormInput";
import { FormPickDate } from "@/components/FormPickDate";
import { FormPickTime } from "@/components/FormPickTime";
import { FormSelectV2 } from "@/components/FormSelectV2";
import FormUploadImage from "@/components/FormUploadImage";
import { MySlideModal } from "@/components/MySlideModal";
import { NunitoText } from "@/components/text/NunitoText";
import { Colors, OPACITY_TO_HEX } from "@/constants/Colors";
import { ROLE_CODE, _mockDutySuggestedUsers, _mockDutyTypes } from "@/constants/Misc";
import { useSession } from "@/contexts/ctx";
import { arrayObjectToMap } from "@/helper/map";
import { useDutyTypes, useSuggestDutyUsers, useUserApprovesByRole } from "@/hooks/form";
import { TDutyFormCreateFormField } from "@/types";
import { MyToast } from "@/ui/MyToast";
import { NoData } from "@/ui/NoData";
import { SkeletonRectangleLoader } from "@/ui/skeletons";
import { AntDesign, Entypo, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import { useRouter } from "expo-router";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Control, useFieldArray, useForm } from "react-hook-form";
import { Modal, ScrollView, StyleSheet, TouchableHighlight, TouchableOpacity, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  AnimatedFAB,
  Avatar,
  Button,
  Card,
  Checkbox,
  Divider,
  IconButton,
  Menu,
  SegmentedButtons,
  Text,
  TextInput,
  TouchableRipple,
} from "react-native-paper";

export default function CreateDutyForm() {
  const [salaryCoefficientTypes, setSalaryCoefficientTypes] = useState<TSalaryCoefficientType[]>([]);

  const { isLoading: isFetchingUserApproves, users, onFetchUserApprovesInMultiTeams } = useUserApprovesByRole();
  const teamIdsRef = useRef<number[]>([]);

  const updateTeamIdsRef = useCallback(
    (newTeamId: number) => {
      const nowTeamIds = teamIdsRef.current;

      if (nowTeamIds.includes(newTeamId)) {
        teamIdsRef.current = nowTeamIds.filter((teamId) => teamId !== newTeamId);
      } else teamIdsRef.current = [...nowTeamIds, newTeamId];

      return teamIdsRef.current;
    },
    [teamIdsRef.current]
  );

  const onRefetchUserApproveWhenChangeAttendance = useCallback(() => {
    const teamIds = teamIdsRef.current;
    onFetchUserApprovesInMultiTeams({ role: ROLE_CODE.TEAM_DIRECTOR, teamIds: teamIds });
  }, [teamIdsRef]);

  const { session } = useSession();
  const router = useRouter();
  const {
    control,
    formState: { isSubmitting },
    handleSubmit,
  } = useForm<TDutyFormCreateFormField>();
  const salaryCoefTypeOpts = salaryCoefficientTypes.map(({ id, name, coefficient }) => ({
    value: id,
    label: `${name} (x${coefficient.toFixed(2)})`,
  }));
  const userApproveOpts = users.map(({ identifyCard, name }) => ({ value: identifyCard, label: `${name}` }));
  const onFetchSalaryCoefTypes = async () => {
    const responseJson = await fetchSalaryCoefTypes(session);
    if (responseJson.statusCode === 200) {
      setSalaryCoefficientTypes(responseJson.data.salaryCoefficientTypes);
    } else {
      MyToast.error(responseJson.error);
    }
  };

  const onSubmit = useCallback(
    async (values: TDutyFormCreate) => {
      const dutyTypes: TDutyFormCreateDutyTypeField[] = values.dutyTypes.map((el) => ({ dutyTypeId: el.dutyTypeId, userIds: el.userIds })); // ok
    },
    [onFetchUserApprovesInMultiTeams]
  );
  useFocusEffect(
    useCallback(() => {
      onFetchSalaryCoefTypes();
    }, [session])
  );
  return (
    <KeyboardAwareScrollView>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <FormPickDate useControllerProps={{ control: control, name: "date" }} label="Ngày" required placeholder="Chọn ngày..." />
          <View style={styles.timeRangeContainer}>
            <View style={styles.timeRangeItem}>
              <FormPickTime
                useControllerProps={{ control: control, name: "startTime" }}
                label="Giờ bắt đầu"
                placeholder="Chọn giờ"
                required
                leftIcon={<MaterialCommunityIcons name="clock-start" size={18} color={Colors.light.inputIconNone} />}
              />
            </View>
            <View style={styles.timeRangeItem}>
              <FormPickTime
                useControllerProps={{ control: control, name: "endTime" }}
                label="Giờ kết thúc"
                placeholder="Chọn giờ"
                required
                leftIcon={<MaterialCommunityIcons name="clock-end" size={18} color={Colors.light.inputIconNone} />}
              />
            </View>
          </View>
          <FormSelectV2
            useControllerProps={{ control: control, name: "salaryCoefficientTypeId" }}
            options={salaryCoefTypeOpts}
            label="Loại ngoài giờ"
            required
            placeholder="Chọn loại ngoài giờ"
            leftIcon={<MaterialIcons name="more-time" size={18} color={Colors.light.inputIconNone} />}
          />

          <ChooseDutyTypesAndDutyTypeUsers
            updateTeamIds={updateTeamIdsRef}
            updateUserApproves={onRefetchUserApproveWhenChangeAttendance}
            control={control}
          />

          {isFetchingUserApproves && <SkeletonRectangleLoader height={60} />}
          {!isFetchingUserApproves && (
            <FormSelectV2
              useControllerProps={{ control: control, name: "userApproveIdentifyCard" }}
              options={userApproveOpts}
              label="Lãnh đạo phê duyệt"
              required
              placeholder="Chọn lãnh đạo phê duyệt"
              leftIcon={<MaterialCommunityIcons name="human-queue" size={18} color={Colors.light.inputIconNone} />}
            />
          )}

          <FormInput formInputProps={{ control: control, name: "note" }} label="Ghi chú" placeholder="Nhập ghi chú..." />
          <FormUploadImage label="Ảnh đính kèm" useControllerProps={{ control: control, name: "attachFile" }} />
          <View style={styles.actionContainer}>
            <Button
              onPress={handleSubmit(onSubmit)}
              mode="contained"
              icon="content-save-all-outline"
              loading={isSubmitting}
              style={styles.buttonContained}
            >
              Lưu
            </Button>
          </View>
        </ScrollView>
      </View>
    </KeyboardAwareScrollView>
  );
}

type ChooseDutyTypesAndDutyTypeUsersProps = {
  control: Control<TDutyFormCreateFormField>;
  updateUserApproves: () => void;
  updateTeamIds: (newTeamId: number) => void;
};

const ChooseDutyTypesAndDutyTypeUsers: React.FC<ChooseDutyTypesAndDutyTypeUsersProps> = memo(({ control, updateUserApproves, updateTeamIds }) => {
  const [openSlideModal, setOpenSlideModal] = useState(false);
  const { isLoading: isFetchingDutyTypes, dutyTypes } = useDutyTypes();

  const onOpenDutyTypesModal = useCallback(() => setOpenSlideModal(true), [setOpenSlideModal]);
  const onCloseDutyTypesModal = useCallback(() => setOpenSlideModal(false), [setOpenSlideModal]);

  const { fields, append, update, remove } = useFieldArray({ name: "dutyTypes", control: control });

  const onDutyTypeSelect = useCallback(
    (dutyTypeId: number, dutyTypeName: string) => {
      append({ dutyTypeName, dutyTypeId, userIds: [] });
      onCloseDutyTypesModal();
    },
    [append, onCloseDutyTypesModal, fields]
  );

  const onDutyTypeDelete = useCallback(
    (index: number) => {
      remove(index);
    },
    [remove]
  );

  const updateUserIds = useCallback(
    (fieldArrayIndex: number, userId: number) => {
      const dutyType = fields[fieldArrayIndex];

      if (dutyType.userIds.includes(userId)) {
        const newUserIds = dutyType.userIds.filter((id) => id !== userId);
        update(fieldArrayIndex, { ...dutyType, userIds: newUserIds });
      } else {
        update(fieldArrayIndex, { ...dutyType, userIds: [...dutyType.userIds, userId] });
      }
    },
    [fields]
  );

  return (
    <View style={styles.dutyTypeFieldContainer}>
      {/*  */}
      <FieldLabel />

      {/*  */}
      <View style={styles.dutyTypeGroup}>
        {fields.map((selectedDutyType, index) => (
          <DutyTypeItem
            key={selectedDutyType.dutyTypeId}
            users={_mockDutySuggestedUsers}
            selectedUserIds={selectedDutyType.userIds}
            dutyType={{
              dutyTypeName: selectedDutyType.dutyTypeName,
              dutyTypeId: selectedDutyType.dutyTypeId,
            }}
            deleteDutyType={onDutyTypeDelete}
            fieldArrayIndex={index}
            updateDutyTypeUserIds={updateUserIds}
            updateUserApproves={updateUserApproves}
            updateTeamIds={updateTeamIds}
          />
        ))}
      </View>

      {/*  */}
      <Button style={{ alignItems: "flex-start" }} onPress={onOpenDutyTypesModal} textColor="#0B3A82">
        + thêm loại trực
      </Button>
      <>
        {openSlideModal && (
          <MySlideModal onClose={onCloseDutyTypesModal}>
            <Delayed>
              {isFetchingDutyTypes && <SkeletonRectangleLoader height={100} />}
              {!isFetchingDutyTypes && (
                <>
                  {dutyTypes.map((dutyType) => (
                    <Button key={dutyType.id} onPress={() => onDutyTypeSelect(dutyType.id, dutyType.dutyTypeName)}>
                      {dutyType.dutyTypeName}
                    </Button>
                  ))}
                </>
              )}
              {!isFetchingDutyTypes && dutyTypes.length <= 0 && <NoData message="Không có loại trực" />}
            </Delayed>
          </MySlideModal>
        )}
      </>
    </View>
  );
});

const FieldLabel: React.FC = () => (
  <View style={styles.labelWrapper}>
    <NunitoText type="body2" style={{ marginRight: 6 }}>
      Loại trực và thành viên tham gia
    </NunitoText>
    <NunitoText type="body1" style={{ color: "red" }}>
      *
    </NunitoText>
  </View>
);

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
  updateTeamIds: (newTeamId: number) => void;
};
const DutyTypeItem: React.FC<DutyTypeItemProps> = memo(
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

type SelectDutyTypeUsersModalProps = {
  onClose: () => void;
  dutyType: {
    dutyTypeId: number;
    dutyTypeName: string;
  };
  selectedUserIds: number[];
  onAddOrRemoveUserId: (userId: number) => void;
  updateTeamIds: (newTeamId: number) => void;
};
type TFilterCheckStatus = "checked" | "all";
const SelectDutyTypeUsersModal: React.FC<SelectDutyTypeUsersModalProps> = memo(
  ({ onClose, dutyType, selectedUserIds, onAddOrRemoveUserId, updateTeamIds }) => {
    const { users: suggestedUsers, isLoading: isFetchingUsers, onFetchDutySuggestedUsers } = useSuggestDutyUsers();
    const [filterCheckStatus, setFilterCheckStatus] = useState<TFilterCheckStatus>("all");
    const [text, setText] = useState("");
    const [openFilterUserModal, setOpenFilterUserModal] = useState(false);
    const suggestedUsersMap = useMemo(() => {
      return arrayObjectToMap(suggestedUsers, "id");
    }, [suggestedUsers]);
    const selectedUsers: TDutySuggestedUser[] = useMemo(() => {
      return selectedUserIds.map((userId: number) => {
        const userInfo = suggestedUsersMap.get(userId.toString()) as TDutySuggestedUser;
        return userInfo;
      });
    }, [selectedUserIds, suggestedUsersMap]);
    const users = useMemo(() => (filterCheckStatus === "all" ? suggestedUsers : selectedUsers), [suggestedUsers, selectedUsers, filterCheckStatus]);

    const onOpenFilterUserModal = () => setOpenFilterUserModal(true);
    const onCloseFilterUserModal = () => setOpenFilterUserModal(false);

    useEffect(() => {
      onFetchDutySuggestedUsers(
        { page: 0, size: 50 },
        { date: "1970-01-01", dutyTypeId: dutyType.dutyTypeId, startDate: "2024-01-01", endDate: "2024-12-30" }
      );
    }, [onFetchDutySuggestedUsers]);

    return (
      <Modal transparent animationType="slide">
        <View style={styles.modalContainer}>
          <Delayed waitBeforeShow={100}>
            <>
              {/* Title */}
              <View style={styles.modalTitleWrapper}>
                <NunitoText type="heading2" style={styles.modalTitle}>
                  {dutyType.dutyTypeName} - chọn người tham gia
                </NunitoText>
                <TouchableOpacity onPress={onClose}>
                  <AntDesign name="close" size={20} color="black" />
                </TouchableOpacity>
              </View>

              {/* Content */}
              <ScrollView>
                <View style={styles.modalContentContainer}>
                  <View style={{ gap: 2 }}>
                    {/* Filter */}
                    <View style={styles.filterContainer}>
                      <View style={styles.filterItem}>
                        <SegmentedButtons
                          value={filterCheckStatus}
                          onValueChange={(value: string) => {
                            console.log({ value });
                            setFilterCheckStatus(value as TFilterCheckStatus);
                          }}
                          buttons={[
                            { value: "all", label: "Tất cả" },
                            { value: "checked", label: "Đã chọn" },
                          ]}
                          style={{ marginLeft: -1 }}
                        />
                      </View>
                      <IconButton
                        style={{ margin: 0 }}
                        icon="tune-variant"
                        size={24}
                        mode="outlined"
                        rippleColor={"grey"}
                        onPress={onOpenFilterUserModal}
                        animated
                      />
                    </View>

                    {/* Search */}
                    <TextInput
                      style={{ height: 36 }}
                      mode="outlined"
                      label="Tên thành viên"
                      value={text}
                      onChangeText={(text) => setText(text)}
                      placeholder="nhập tên để tìm kiếm "
                    />
                  </View>

                  {/* List */}
                  <View style={{ gap: 10, paddingTop: 16 }}>
                    {isFetchingUsers && <SkeletonRectangleLoader height={400} />}
                    {users.map((user) => (
                      <SuggestUserItem key={user.id} user={user} onChooseUser={onAddOrRemoveUserId} updateTeamIds={updateTeamIds} />
                    ))}
                  </View>
                </View>
              </ScrollView>

              <AnimatedFAB
                icon={"plus"}
                label={"Label"}
                extended={false}
                onPress={() => {
                  onClose();
                }}
                visible={true}
                animateFrom={"right"}
                iconMode={"static"}
                style={[styles.fabStyle]}
              />

              {openFilterUserModal && (
                <MySlideModal onClose={onCloseFilterUserModal}>
                  <NunitoText>Filter users modal</NunitoText>
                </MySlideModal>
              )}
            </>
          </Delayed>
        </View>
      </Modal>
    );
  }
);

type SuggestUserItemProps = {
  user: TDutySuggestedUser;
  onChooseUser: (userId: number) => void;
  updateTeamIds: (newTeamId: number) => void;
};
const SuggestUserItem: React.FC<SuggestUserItemProps> = memo(({ user, onChooseUser, updateTeamIds }) => {
  const LeftContent = (props: any) => <Avatar.Icon {...props} icon="account" />;
  const [checked, setChecked] = useState(false);

  const toggleCheck = () => setChecked((prev) => !prev);

  const onPressUserCard = useCallback(() => {
    toggleCheck();
    onChooseUser(user.id);
    updateTeamIds(user.teamId);
  }, [onChooseUser, toggleCheck, user]);
  return (
    <Card>
      <TouchableRipple borderless rippleColor="rgba(0, 0, 0, .32)" onPress={onPressUserCard}>
        <View style={styles.userCardWrapper}>
          <Card.Title title={user.name} subtitle={`P. ${user.teamName}`} left={LeftContent} />
          <Card.Content>
            <Text variant="bodyMedium">Chức vụ: {user.roleName}</Text>
            <Text variant="bodyMedium">Số lần trực: {user.numOnDuty}</Text>
          </Card.Content>
          <View style={styles.userCheckboxWrapper}>
            <Checkbox status={checked ? "checked" : "unchecked"} />
          </View>
        </View>
      </TouchableRipple>
    </Card>
  );
});

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
  actionContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
  },
  buttonContained: {
    borderRadius: 4,
    height: 44,
  },
  timeRangeContainer: {
    flexDirection: "row",
    gap: 12,
  },
  timeRangeItem: {
    flexGrow: 1,
  },

  dutyTypeFieldContainer: {
    gap: 6,
  },
  labelWrapper: {
    flexDirection: "row",
    alignContent: "flex-start",
    alignItems: "center",
  },

  dutyTypeGroup: {
    gap: 8,
  },
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

  modalContainer: {
    flex: 1,
    width: "100%",
    backgroundColor: "white",
    position: "relative",
  },

  modalTitleWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },

  modalTitle: {
    color: "black",
  },

  modalContentContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    flex: 1,
  },

  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },

  filterItem: {
    flexGrow: 1,
  },

  fabStyle: {
    bottom: 16,
    right: 16,
    position: "absolute",
  },

  userCardWrapper: {
    position: "relative",
    paddingBottom: 16,
  },
  userCheckboxWrapper: {
    position: "absolute",
    right: 20,
    top: 20,
  },
});
